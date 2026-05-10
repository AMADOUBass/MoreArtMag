import { supabaseAdmin } from '@/lib/supabase/admin'
import CommandesClient, { type Order } from './commandes-client'

async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur chargement commandes:', error)
    return []
  }

  return (data ?? []) as unknown as Order[]
}

export default async function AdminCommandesPage() {
  const orders = await fetchOrders()
  return <CommandesClient initialOrders={orders} />
}
