import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminLayoutWrapper from '@/components/admin/admin-layout-wrapper'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!pathname.includes('/admin/login')) {
    if (!user) {
      redirect('/admin/login')
    }

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      redirect('/admin/login?error=unauthorized')
    }
  }

  // Pour la page login, on n'affiche pas le wrapper (sidebar)
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  )
}
