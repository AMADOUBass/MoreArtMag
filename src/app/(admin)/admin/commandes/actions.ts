'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = data as { role: string } | null
  if (!profile || profile.role !== 'admin') throw new Error('Accès refusé')
}

export async function updateOrderStatus(orderId: string, status: string) {
  await assertAdmin()

  const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']
  if (!validStatuses.includes(status)) throw new Error('Statut invalide')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any)
    .update({ status })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/commandes')
}

export async function saveAdminNotes(orderId: string, notes: string) {
  await assertAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any)
    .update({ admin_notes: notes })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/commandes')
}

export async function saveTrackingNumber(orderId: string, tracking: string) {
  await assertAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('orders') as any)
    .update({ tracking_number: tracking })
    .eq('id', orderId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/commandes')
}
