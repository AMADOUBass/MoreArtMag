import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email("Format d'email invalide"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = newsletterSchema.parse(body)
    
    const supabase = await createClient()

    // 1. Vérifier si l'utilisateur est déjà inscrit
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Vous êtes déjà inscrit à notre journal d'art." },
        { status: 400 }
      )
    }

    // 2. Insérer dans Supabase
    const { error: dbError } = await (supabase as any)
      .from('newsletter_subscribers')
      .insert({
        email: validatedData.email,
        is_confirmed: true, // Pour l'instant on confirme automatiquement
      })

    if (dbError) throw dbError

    // 3. Envoyer une notification
    await resend.emails.send({
      from: 'MoreArt Mag <onboarding@resend.dev>',
      to: 'bassoumamadou0@gmail.com',
      subject: `Nouvel abonné au Journal d'Art`,
      html: `
        <h2>Nouvel abonné !</h2>
        <p>L'adresse suivante vient de s'inscrire à la newsletter :</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Newsletter error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription." }, { status: 500 })
  }
}
