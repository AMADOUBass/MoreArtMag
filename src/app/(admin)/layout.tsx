import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminLayoutWrapper from '@/components/admin/admin-layout-wrapper'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''

  // Page login : pas de vérification, pas de wrapper
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  // Pour toutes les autres routes /admin/* : double vérification auth + rôle
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Vérification du rôle via supabaseAdmin (service role, bypass RLS)
  // Le client anon ne suffit pas ici — on ne fait pas confiance à la session seule
  const { data: profileRow } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileRow as { role: string } | null

  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  )
}
