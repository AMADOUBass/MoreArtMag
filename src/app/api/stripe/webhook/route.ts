import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { resend } from '@/lib/resend'
import { CustomerOrderEmail } from '@/emails/CustomerOrderEmail'
import { AdminNotificationEmail } from '@/emails/AdminNotificationEmail'

// Initialisation de Supabase avec la clé SERVICE ROLE pour bypasser les RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const sig = headerList.get('stripe-signature')

  let event

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
    }
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Gestion de l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    
    // 1. Récupérer les métadonnées (notre panier stringifié)
    const cartItems = JSON.parse(session.metadata.cartItems || '[]')
    
    try {
      // 2. Créer la commande dans Supabase
      const { data: order, error: orderError } = await (supabaseAdmin
        .from('orders') as any)
        .insert({
          customer_email: session.customer_details.email,
          customer_name: session.customer_details.name,
          status: 'paid',
          shipping_address: session.shipping_details.address,
          billing_address: session.customer_details.address,
          subtotal_cents: session.amount_subtotal,
          total_cents: session.amount_total,
          shipping_cents: session.total_details?.amount_shipping || 0,
          tax_cents: session.total_details?.amount_tax || 0,
          currency: session.currency.toUpperCase(),
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 3. Ajouter les items de la commande et réduire les stocks
      for (const item of cartItems) {
         // Récupérer les infos de l'œuvre pour OrderItems (on pourrait aussi les passer en metadata)
         const { data: stockInfo } = await (supabaseAdmin
           .from('artwork_stock') as any)
           .select('*')
           .eq('artwork_sanity_id', item.id.split('-')[0])
           .eq('size_sanity_id', item.id.split('-')[1])
           .single()

         if (stockInfo) {
            // Insérer dans order_items (table auxiliaire pour le détail)
            await (supabaseAdmin.from('order_items') as any).insert({
              order_id: order.id,
              artwork_sanity_id: stockInfo.artwork_sanity_id,
              title: item.title,
              size_label: item.size,
              quantity: item.q,
              unit_price_cents: stockInfo.price_cents,
              total_price_cents: stockInfo.price_cents * item.q,
              image_url: item.image 
            })

            // Réduire le stock
            await (supabaseAdmin.from('artwork_stock') as any)
              .update({ remaining: Math.max(0, (stockInfo.remaining || 0) - item.q) })
              .eq('id', stockInfo.id)
         }
      }

      // 4. Envoyer les emails via Resend
      // Email au Client
      await resend.emails.send({
        from: 'MoreArt Mag <commandes@moreartmag.art>',
        to: session.customer_details.email,
        subject: `Confirmation de votre commande ${order.order_number}`,
        react: CustomerOrderEmail({
          orderNumber: order.order_number,
          customerName: session.customer_details.name,
          items: cartItems, // On pourrait enrichir ici
          totalAmount: session.amount_total
        })
      })

      // Email à Bazan
      await resend.emails.send({
        from: 'Boutique MoreArt <alertes@moreartmag.art>',
        to: 'bazan@moreartmag.com', // À remplacer par l'email de Bazan
        subject: `Nouvelle vente ! 🎉 (${order.order_number})`,
        react: AdminNotificationEmail({
          orderNumber: order.order_number,
          customerName: session.customer_details.name,
          customerEmail: session.customer_details.email,
          shippingAddress: `${session.shipping_details.address.line1}, ${session.shipping_details.address.city}`,
          items: cartItems,
          totalAmount: session.amount_total
        })
      })

      console.log(`Order ${order.order_number} processed successfully.`)

    } catch (dbError: any) {
      console.error('Database/Email Error:', dbError.message)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
