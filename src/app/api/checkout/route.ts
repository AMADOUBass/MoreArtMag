import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { CartItem } from '@/store/use-cart'

export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Prepare line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: item.currency.toLowerCase(),
        product_data: {
          name: `${item.title} — ${item.sizeLabel}`,
          images: [item.image],
          metadata: {
            artworkId: item.artworkId,
            sizeId: item.sizeId,
          },
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }))

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/panier`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'US', 'CA', 'GB', 'ML'], // Added ML for Mali
      },
      // metadata can be used for webhooks later
      metadata: {
        cartItems: JSON.stringify(items.map(i => ({ id: i.id, q: i.quantity })))
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
