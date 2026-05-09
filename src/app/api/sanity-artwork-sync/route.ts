import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

// Webhook trigger from Sanity when an artwork is published
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { _id: artworkId, sizes } = body

    if (!artworkId) {
      return NextResponse.json({ error: 'Missing artwork ID' }, { status: 400 })
    }

    // Sync each size to Supabase artwork_stock
    if (sizes && Array.isArray(sizes)) {
      const syncPromises = sizes.map(async (size: any) => {
        const { sizeId } = size
        
        if (!sizeId) return

        // Upsert logic: insert if not exists, do nothing if exists (to preserve price/stock)
        const { error } = await (supabaseAdmin as any)
          .from('artwork_stock')
          .insert([{
            artwork_sanity_id: artworkId,
            size_sanity_id: sizeId,
            price_cents: 0,
            currency: 'CAD',
            remaining: 0,
            is_sold: false,
            is_unique: false,
          }])
          .select()
          // We use error check because .insert() will fail on conflict if not handled, 
          // and we want to ignore conflicts on (artwork_sanity_id, size_sanity_id)
          
        if (error && error.code !== '23505') { // 23505 is unique_violation
          console.error(`Error syncing size ${sizeId}:`, error)
          throw error
        }
      })

      await Promise.all(syncPromises)
    }

    return NextResponse.json({ message: 'Sync successful' })
  } catch (error: any) {
    console.error('Webhook sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
