'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { toast } from 'sonner'

import Breadcrumbs from '@/components/marketing/breadcrumbs'

import Button from '@/components/ui/button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ artworkId, sizeId, quantity }) => ({
            artworkId,
            sizeId,
            quantity,
          })),
        }),
      })

      const { url, error } = await response.json()

      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Une erreur est survenue lors de l\'initialisation du paiement.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!mounted) return (
    <div className="min-h-screen bg-[#f5f5f5] pt-40 flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-black/5" />
          <div className="absolute inset-0 rounded-full border-2 border-t-black/40 animate-spin" />
        </div>
    </div>
  )

  const isCartEmpty = items.length === 0

  return (
    <main className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
      <div className="container-custom py-20">
        {/* Header Harmonisé - Style Musée */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display text-black/[0.03] select-none pointer-events-none leading-none">
            04
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4 text-[#404040]">
            <span className="w-12 h-[1px] bg-black/20" />
            VOTRE SÉLECTION
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter text-[#0a0a0a]">
            L'art à <br/> 
            <span className="text-[#a3a3a3] ml-12 md:ml-24">portée de main.</span>
          </h1>
          <p className="text-[#737373] text-xl md:text-2xl leading-relaxed max-w-2xl mt-12 border-t border-black/5 pt-12">
             {totalItems()} {totalItems() > 1 ? 'œuvres attendent' : 'œuvre attend'} de rejoindre votre espace personnel.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isCartEmpty ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-40 text-center border border-dashed border-black/10 rounded-sm"
            >
               <ShoppingBag size={48} className="mx-auto text-black/5 mb-8" />
               <p className="text-3xl font-display text-[#0a0a0a] mb-12">Votre panier est vide.</p>
               <Link 
                 href="/photographies" 
                 className="inline-block px-12 py-6 border border-black/10 text-[#0a0a0a] hover:bg-black hover:text-white transition-all duration-500 eyebrow uppercase tracking-widest text-[10px] rounded-sm"
               >
                  Découvrir la collection
               </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16"
            >
              {/* Items List */}
              <div className="lg:col-span-8 space-y-12">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col md:flex-row gap-8 pb-12 border-b border-black/5 group"
                  >
                    <div className="relative aspect-[4/5] w-full md:w-40 bg-white rounded-sm overflow-hidden flex-shrink-0 shadow-xl border border-black/5">
                       <Image 
                          src={item.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop'} 
                          alt={item.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-2">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-2xl font-display text-[#0a0a0a] mb-2">{item.title}</h3>
                             <p className="eyebrow text-[10px] text-[#737373]">{item.sizeLabel} — Tirage Fine Art</p>
                          </div>
                          <button 
                            onClick={() => {
                               removeItem(item.id)
                               toast.info(`${item.title} retiré du panier`)
                            }}
                            className="p-2 text-[#a3a3a3] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>

                       <div className="flex justify-between items-center mt-8">
                          <div className="flex items-center gap-4 bg-black/5 p-1 rounded-full border border-black/5">
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#0a0a0a] transition-colors"
                             >
                                <Minus size={14} />
                             </button>
                             <span className="w-8 text-center text-sm font-bold text-[#0a0a0a]">{item.quantity}</span>
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#0a0a0a] transition-colors"
                                disabled={item.stockRemaining !== null && item.quantity >= item.stockRemaining}
                             >
                                <Plus size={14} />
                             </button>
                          </div>
                          <p className="text-xl font-display text-[#0a0a0a]">
                             {(item.priceCents * item.quantity / 100).toLocaleString('fr-CA', { style: 'currency', currency: item.currency })}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                 <div className="bg-white border border-black/5 p-6 md:p-10 rounded-sm sticky top-40 shadow-2xl">
                    <h2 className="text-2xl font-display text-[#0a0a0a] mb-8 pb-8 border-b border-black/5">Récapitulatif</h2>
                    
                    <div className="space-y-6 mb-12">
                       <div className="flex justify-between eyebrow text-[#737373]">
                          <span>Sous-total</span>
                          <span>{(totalPrice() / 100).toLocaleString('fr-CA', { style: 'currency', currency: items[0]?.currency || 'CAD' })}</span>
                       </div>
                       <div className="flex justify-between eyebrow text-[#737373]">
                          <span>Livraison</span>
                          <span className="text-[#a3a3a3]">Calculée à l'étape suivante</span>
                       </div>
                       <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                          <span className="text-[#0a0a0a] font-display text-xl">Total</span>
                          <span className="text-3xl font-display text-[#0a0a0a]">
                             {(totalPrice() / 100).toLocaleString('fr-CA', { style: 'currency', currency: items[0]?.currency || 'CAD' })}
                          </span>
                       </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className={`w-full flex items-center justify-center gap-3 h-16 rounded-sm font-display text-xl transition-all duration-500 ${
                        isCheckingOut 
                        ? 'bg-black/10 text-black/40 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-[#1a1a1a] shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1'
                      }`}
                    >
                       {isCheckingOut ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                       ) : (
                         <>
                           Passer à la caisse 
                           <ArrowRight size={18} />
                         </>
                       )}
                    </button>

                    <div className="mt-12 space-y-4">
                       <p className="text-[10px] eyebrow text-[#a3a3a3] flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-green-500/40 rounded-full" /> Paiement sécurisé par Stripe
                       </p>
                       <p className="text-[10px] eyebrow text-[#a3a3a3] flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-black/20 rounded-full" /> Livraison mondiale assurée
                       </p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
