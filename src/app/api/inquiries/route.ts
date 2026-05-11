import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { z } from 'zod'

const inquirySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  type: z.enum(['general', 'commission', 'press', 'gallery']),
  budget: z.string().optional(),
  size: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = inquirySchema.parse(body)
    
    const supabase = await createClient()

    // 1. Insert into Supabase
    // We use a slightly more flexible insert to avoid 'never' inference issues in some TS versions
    const { error: dbError } = await (supabase as any)
      .from('inquiries')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        type: validatedData.type,
        budget_range: validatedData.budget,
        requested_size: validatedData.size,
        status: 'new',
        metadata: {
          userAgent: req.headers.get('user-agent'),
        }
      })

    if (dbError) throw dbError

    // 2. Send email via Resend
    await resend.emails.send({
      from: 'MoreArt Mag <onboarding@resend.dev>',
      to: 'bassoumamadou0@gmail.com',
      subject: `Nouveau message: ${validatedData.subject}`,
      html: `
        <h2>Nouvelle demande reçue</h2>
        <p><strong>Nom:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Type:</strong> ${validatedData.type}</p>
        <p><strong>Sujet:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
