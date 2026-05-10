import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { client as sanityClient } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import type { Database } from '@/types/supabase'

type ArtworkStockRow = Database['public']['Tables']['artwork_stock']['Row']

interface CheckoutItem {
  artworkId: string
  sizeId: string
  quantity: number
}

interface SanityArtwork {
  _id: string
  title: string
  mainImage: unknown
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()

    if (
      !body ||
      typeof body !== 'object' ||
      !('items' in body) ||
      !Array.isArray((body as { items: unknown }).items)
    ) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }

    const rawItems = (body as { items: unknown[] }).items

    if (rawItems.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Validate shape — client sends only artworkId + sizeId + quantity (never prices)
    const items: CheckoutItem[] = []
    for (const item of rawItems) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof (item as Record<string, unknown>).artworkId !== 'string' ||
        typeof (item as Record<string, unknown>).sizeId !== 'string' ||
        typeof (item as Record<string, unknown>).quantity !== 'number'
      ) {
        return NextResponse.json({ error: 'Item invalide' }, { status: 400 })
      }
      const { artworkId, sizeId, quantity } = item as CheckoutItem
      if (quantity < 1 || !Number.isInteger(quantity)) {
        return NextResponse.json({ error: 'Quantité invalide' }, { status: 400 })
      }
      items.push({ artworkId, sizeId, quantity })
    }

    const artworkIds = items.map((i) => i.artworkId)
    const sizeIds = items.map((i) => i.sizeId)

    // 1. Fetch prices and stock from Supabase — server is source of truth, never the client
    const { data: stockRows, error: stockError } = await supabaseAdmin
      .from('artwork_stock')
      .select('*')
      .in('artwork_sanity_id', artworkIds)
      .in('size_sanity_id', sizeIds)

    if (stockError) {
      console.error('Supabase stock fetch error:', stockError)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    const typedRows = (stockRows ?? []) as ArtworkStockRow[]
    const stockMap = new Map(
      typedRows.map((row) => [
        `${row.artwork_sanity_id}::${row.size_sanity_id}`,
        row,
      ])
    )

    // 2. Verify stock for each item before touching Stripe
    for (const item of items) {
      const key = `${item.artworkId}::${item.sizeId}`
      const stock = stockMap.get(key)

      if (!stock) {
        return NextResponse.json(
          { error: `Œuvre introuvable : ${item.artworkId}` },
          { status: 404 }
        )
      }

      if (stock.is_sold) {
        return NextResponse.json(
          { error: 'Cette œuvre est déjà vendue.' },
          { status: 409 }
        )
      }

      if (stock.is_unique && item.quantity > 1) {
        return NextResponse.json(
          { error: 'Une pièce unique ne peut pas être achetée en plusieurs exemplaires.' },
          { status: 409 }
        )
      }

      if (stock.remaining !== null && stock.remaining < item.quantity) {
        const msg =
          stock.remaining === 0
            ? 'Cette édition est épuisée.'
            : `Stock insuffisant — seulement ${stock.remaining} exemplaire(s) disponible(s).`
        return NextResponse.json({ error: msg }, { status: 409 })
      }
    }

    // 3. Fetch artwork title and image from Sanity for Stripe display
    const sanityArtworks = await sanityClient.fetch<SanityArtwork[]>(
      `*[_type == "artwork" && _id in $ids] { _id, title, mainImage }`,
      { ids: artworkIds }
    )
    const sanityMap = new Map(sanityArtworks.map((a) => [a._id, a]))

    // 4. Build line items with server-verified prices
    const lineItems = items.map((item) => {
      const key = `${item.artworkId}::${item.sizeId}`
      const stock = stockMap.get(key)!
      const artwork = sanityMap.get(item.artworkId)

      const imageUrl =
        artwork?.mainImage
          ? urlFor(artwork.mainImage).width(400).url()
          : undefined

      return {
        price_data: {
          currency: stock.currency.toLowerCase(),
          product_data: {
            name: artwork?.title ?? item.artworkId,
            ...(imageUrl ? { images: [imageUrl] } : {}),
            metadata: {
              artworkId: item.artworkId,
              sizeId: item.sizeId,
            },
          },
          unit_amount: stock.price_cents,
          tax_behavior: 'exclusive' as const,
        },
        quantity: item.quantity,
      }
    })

    // 5. Create Checkout Session with automatic tax and correct country list
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        // V1 countries per spec: Canada (principal) + US, FR, BE, CH, GB
        allowed_countries: ['CA', 'US', 'FR', 'BE', 'CH', 'GB'],
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/panier`,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            artworkId: i.artworkId,
            sizeId: i.sizeId,
            quantity: i.quantity,
          }))
        ),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('Checkout error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
