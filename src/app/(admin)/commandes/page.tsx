'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Truck, CheckCircle2, XCircle, Clock, Search, ChevronRight, X, Printer, MapPin, CreditCard, Info } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const STATUS_COLORS = {
  pending: 'bg-warning/20 text-warning',
  paid: 'bg-success/20 text-success',
  shipped: 'bg-info/20 text-info',
  delivered: 'bg-success text-white',
  cancelled: 'bg-error/20 text-error',
  refunded: 'bg-white/10 text-text-muted',
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const supabase = createClient()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error: any) {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await (supabase
        .from('orders') as any)
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      toast.success(`Statut : ${newStatus}`)
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      toast.error('Erreur de mise à jour')
    }
  }

  const saveNotes = async () => {
    if (!selectedOrder) return
    try {
      const { error } = await (supabase
        .from('orders') as any)
        .update({ admin_notes: adminNotes })
        .eq('id', selectedOrder.id)
      if (error) throw error
      toast.success('Notes enregistrées')
      fetchOrders()
    } catch (error) {
      toast.error('Erreur notes')
    }
  }

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h1 className="text-4xl font-display italic text-white mb-2">Commandes</h1>
            <p className="eyebrow text-text-muted">Suivi des ventes et de la logistique.</p>
         </div>
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </header>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-text-muted eyebrow animate-pulse">Chargement...</div>
        ) : filteredOrders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => {
              setSelectedOrder(order)
              setAdminNotes(order.admin_notes || '')
            }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer group"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
               <div className="flex gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                     <ShoppingBag size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-display italic text-white">{order.order_number}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] eyebrow uppercase ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>
                           {order.status}
                        </span>
                     </div>
                     <p className="text-text-secondary text-sm eyebrow tracking-normal">{order.customer_name} • {order.customer_email}</p>
                  </div>
               </div>
               <div className="text-right flex flex-col justify-center">
                  <p className="text-2xl font-display italic text-white">{(order.total_cents / 100).toLocaleString()} {order.currency}</p>
                  <p className="text-[9px] eyebrow text-text-muted mt-1 uppercase">Voir détails <ChevronRight size={10} className="inline ml-1" /></p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Détail */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-display italic text-white">Détail {selectedOrder.order_number}</h2>
                    <span className={`px-3 py-1 rounded-full text-[9px] eyebrow uppercase ${STATUS_COLORS[selectedOrder.status as keyof typeof STATUS_COLORS]}`}>
                       {selectedOrder.status}
                    </span>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Colonne 1: Infos Client */}
                    <div className="space-y-6">
                       <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2"><MapPin size={12} /> Livraison</h4>
                       <div className="bg-white/5 p-6 rounded-2xl space-y-2 text-sm italic text-text-secondary">
                          <p className="text-white font-bold not-italic">{selectedOrder.customer_name}</p>
                          <p>{selectedOrder.shipping_address.line1}</p>
                          {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                          <p>{selectedOrder.shipping_address.postal_code} {selectedOrder.shipping_address.city}</p>
                          <p className="uppercase">{selectedOrder.shipping_address.country}</p>
                       </div>
                    </div>

                    {/* Colonne 2: Articles */}
                    <div className="md:col-span-2 space-y-6">
                       <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2"><ShoppingBag size={12} /> Articles</h4>
                       <div className="space-y-4">
                          {selectedOrder.order_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden relative">
                                     {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" />}
                                  </div>
                                  <div>
                                     <p className="text-white italic">{item.title}</p>
                                     <p className="text-[10px] eyebrow text-text-muted">{item.size_label} x{item.quantity}</p>
                                  </div>
                               </div>
                               <p className="text-white font-mono">{(item.total_price_cents / 100).toLocaleString()} {selectedOrder.currency}</p>
                            </div>
                          ))}
                          <div className="pt-4 space-y-2">
                             <div className="flex justify-between text-[10px] eyebrow text-text-muted">
                                <span>Sous-total</span>
                                <span>{(selectedOrder.subtotal_cents / 100).toLocaleString()} {selectedOrder.currency}</span>
                             </div>
                             <div className="flex justify-between text-[10px] eyebrow text-text-muted">
                                <span>Frais de port</span>
                                <span>{(selectedOrder.shipping_cents / 100).toLocaleString()} {selectedOrder.currency}</span>
                             </div>
                             <div className="flex justify-between text-xl font-display italic text-white border-t border-white/5 pt-4">
                                <span>Total</span>
                                <span>{(selectedOrder.total_cents / 100).toLocaleString()} {selectedOrder.currency}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Paiement & Actions */}
                    <div className="space-y-6">
                       <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2"><CreditCard size={12} /> Transaction</h4>
                       <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                          <p className="text-[10px] eyebrow text-text-muted">Stripe ID: {selectedOrder.stripe_payment_intent_id || 'N/A'}</p>
                          <div className="flex gap-2">
                            <select 
                               className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] eyebrow text-white flex-1"
                               value={selectedOrder.status}
                               onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                            >
                               <option value="pending">En attente</option>
                               <option value="paid">Payé</option>
                               <option value="shipped">Expédié</option>
                               <option value="delivered">Livré</option>
                               <option value="cancelled">Annulé</option>
                            </select>
                            <button className="p-3 bg-white/5 text-text-muted hover:text-white rounded-xl transition-colors">
                               <Printer size={18} />
                            </button>
                          </div>
                       </div>
                    </div>

                    {/* Notes Admin */}
                    <div className="space-y-6">
                       <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2"><Info size={12} /> Notes Internes</h4>
                       <div className="space-y-4">
                          <textarea 
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm italic text-text-secondary focus:outline-none focus:border-accent/50 min-h-[100px]"
                            placeholder="Ajouter une note de suivi (ex: Emballage spécial demandé...)"
                          />
                          <button 
                            onClick={saveNotes}
                            className="w-full py-3 bg-white/5 text-white eyebrow text-[10px] rounded-xl hover:bg-white/10 transition-all"
                          >
                             Enregistrer les notes
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
