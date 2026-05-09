import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminSidebar from '../../components/admin/sidebar'

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

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-12">
        {children}
      </main>
    </div>
  )
}
