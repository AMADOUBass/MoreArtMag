'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, X, Search, ChevronRight,
  MapPin, CreditCard, Info, Truck,
} from 'lucide-react'
import { toast } from 'sonner'
import { updateOrderStatus, saveAdminNotes, saveTrackingNumber } from './actions'

export interface OrderItem {
  id: string
  title: string
  image_url: string
  size_label: string
  quantity: number
  total_price_cents: number
  edition_number: string | null
}

export interface Order {
  id: string
  order_number: string
  status: string
  customer_name: string
  customer_email: string
  currency: string
  total_cents: number
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  stripe_payment_intent_id: string | null
  admin_notes: string | null
  tracking_number: string | null
  shipping_address: Record<string, string>
  created_at: string
  order_items: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payé',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
  refunded: 'Remboursé',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  paid: 'bg-success/20 text-success',
  shipped: 'bg-blue-500/20 text-blue-400',
  delivered: 'bg-success text-white',
  cancelled: 'bg-error/20 text-error',
  refunded: 'bg-white/10 text-text-muted',
}

export default function CommandesClient({ initialOrders }: { initialOrders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [notes, setNotes] = useState('')
  const [tracking, setTracking] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = initialOrders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openOrder = (order: Order) => {
    setSelected(order)
    setNotes(order.admin_notes ?? '')
    setTracking(order.tracking_number ?? '')
  }

  const handleStatusChange = (orderId: string, status: string) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status)
        if (selected?.id === orderId) setSelected({ ...selected, status })
        toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`)
      } catch {
        toast.error('Erreur de mise à jour du statut')
      }
    })
  }

  const handleSaveNotes = () => {
    if (!selected) return
    startTransition(async () => {
      try {
        await saveAdminNotes(selected.id, notes)
        toast.success('Notes enregistrées')
      } catch {
        toast.error('Erreur sauvegarde notes')
      }
    })
  }

  const handleSaveTracking = () => {
    if (!selected) return
    startTransition(async () => {
      try {
        await saveTrackingNumber(selected.id, tracking)
        if (selected) setSelected({ ...selected, tracking_number: tracking })
        toast.success('Numéro de suivi enregistré')
      } catch {
        toast.error('Erreur sauvegarde numéro de suivi')
      }
    })
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display italic text-white mb-2">Commandes</h1>
          <p className="eyebrow text-text-muted">Suivi des ventes et de la logistique.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Numéro, nom, email…"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="py-20 text-center text-text-muted eyebrow text-[10px]">
            Aucune commande trouvée.
          </p>
        )}
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => openOrder(order)}
            className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer group p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8"
          >
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors shrink-0">
                <ShoppingBag size={22} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-display italic text-white">{order.order_number}</h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] eyebrow uppercase ${STATUS_COLORS[order.status] ?? ''}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <p className="text-text-secondary text-xs eyebrow">
                  {order.customer_name} · {order.customer_email}
                </p>
                <p className="text-text-muted text-[10px] mt-1">
                  {new Date(order.created_at).toLocaleDateString('fr-CA', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="text-right flex flex-col justify-center shrink-0">
              <p className="text-2xl font-display italic text-white">
                {(order.total_cents / 100).toLocaleString('fr-CA', {
                  style: 'currency', currency: order.currency,
                })}
              </p>
              <p className="text-[9px] eyebrow text-text-muted mt-1 uppercase">
                Voir détails <ChevronRight size={10} className="inline ml-1" />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal détail */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header modal */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-display italic text-white">
                    {selected.order_number}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-[9px] eyebrow uppercase ${STATUS_COLORS[selected.status] ?? ''}`}>
                    {STATUS_LABELS[selected.status] ?? selected.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                {/* Livraison + Articles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2">
                      <MapPin size={12} /> Livraison
                    </h4>
                    <div className="bg-white/5 p-6 rounded-2xl space-y-2 text-sm text-text-secondary">
                      <p className="text-white font-semibold">{selected.customer_name}</p>
                      <p>{selected.customer_email}</p>
                      <p className="mt-2">{selected.shipping_address?.line1}</p>
                      {selected.shipping_address?.line2 && <p>{selected.shipping_address.line2}</p>}
                      <p>
                        {selected.shipping_address?.postal_code} {selected.shipping_address?.city}
                      </p>
                      <p className="uppercase">{selected.shipping_address?.country}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2">
                      <ShoppingBag size={12} /> Articles ({selected.order_items?.length ?? 0})
                    </h4>
                    <div className="space-y-3">
                      {selected.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-4 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden relative shrink-0">
                              {item.image_url && (
                                <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-white italic">{item.title}</p>
                              <p className="text-[10px] eyebrow text-text-muted">
                                {item.size_label}
                                {item.edition_number && ` · ${item.edition_number}`}
                                {' '}× {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-white shrink-0">
                            {(item.total_price_cents / 100).toLocaleString('fr-CA', {
                              style: 'currency', currency: selected.currency,
                            })}
                          </p>
                        </div>
                      ))}
                      <div className="pt-4 space-y-2 text-[10px] eyebrow text-text-muted">
                        <div className="flex justify-between">
                          <span>Sous-total</span>
                          <span>{(selected.subtotal_cents / 100).toLocaleString('fr-CA', { style: 'currency', currency: selected.currency })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Livraison</span>
                          <span>{(selected.shipping_cents / 100).toLocaleString('fr-CA', { style: 'currency', currency: selected.currency })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes</span>
                          <span>{(selected.tax_cents / 100).toLocaleString('fr-CA', { style: 'currency', currency: selected.currency })}</span>
                        </div>
                        <div className="flex justify-between text-xl font-display italic text-white border-t border-white/5 pt-4">
                          <span>Total</span>
                          <span>{(selected.total_cents / 100).toLocaleString('fr-CA', { style: 'currency', currency: selected.currency })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut + Suivi + Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Statut */}
                  <div className="space-y-4">
                    <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2">
                      <CreditCard size={12} /> Statut & Paiement
                    </h4>
                    <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                      <p className="text-[10px] eyebrow text-text-muted truncate">
                        Stripe : {selected.stripe_payment_intent_id ?? 'N/A'}
                      </p>
                      <select
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] eyebrow text-white"
                        value={selected.status}
                        disabled={isPending}
                        onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Numéro de suivi */}
                  <div className="space-y-4">
                    <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2">
                      <Truck size={12} /> Numéro de suivi
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="Ex : 1Z999AA10123456784"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50"
                      />
                      <button
                        onClick={handleSaveTracking}
                        disabled={isPending}
                        className="w-full py-3 bg-accent/10 text-accent eyebrow text-[10px] rounded-xl hover:bg-accent/20 transition-all disabled:opacity-50"
                      >
                        {isPending ? 'Enregistrement…' : 'Enregistrer le suivi'}
                      </button>
                    </div>
                  </div>

                  {/* Notes admin */}
                  <div className="space-y-4">
                    <h4 className="eyebrow text-[10px] text-accent flex items-center gap-2">
                      <Info size={12} /> Notes internes
                    </h4>
                    <div className="space-y-3">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Emballage spécial, instructions particulières…"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm italic text-text-secondary focus:outline-none focus:border-accent/50 min-h-[100px] resize-none"
                      />
                      <button
                        onClick={handleSaveNotes}
                        disabled={isPending}
                        className="w-full py-3 bg-white/5 text-white eyebrow text-[10px] rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
                      >
                        {isPending ? 'Enregistrement…' : 'Enregistrer les notes'}
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
