import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string; slug?: { current: string } }>(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Revalidate by tag (e.g., 'artwork', 'collection')
    // In Next.js 16+, revalidateTag requires a second argument (e.g., 'max')
    revalidateTag(body._type, 'max')
    
    // Also revalidate specific slug if present
    if (body.slug?.current) {
      revalidateTag(`${body._type}:${body.slug.current}`, 'max')
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      type: body._type 
    })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, { status: 500 })
  }
}
