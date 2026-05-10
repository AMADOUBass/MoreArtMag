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
        body: JSON.stringify({ items }),
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
    <div className="min-h-screen bg-background-primary pt-40 flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const isCartEmpty = items.length === 0

  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20">
      <div className="container-custom py-20">
        {/* Header Harmonisé - Style Musée */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            04
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            VOTRE SÉLECTION
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            L'art à <br/> 
            <span className="italic text-accent ml-12 md:ml-24">portée de main.</span>
          </h1>
          <p className="text-text-secondary text-xl md:text-2xl leading-relaxed italic max-w-2xl mt-12 border-t border-white/5 pt-12">
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
              className="py-40 text-center border border-dashed border-white/5 rounded-sm"
            >
               <ShoppingBag size={48} className="mx-auto text-white/5 mb-8" />
               <p className="text-3xl font-display italic text-white mb-12">Votre panier est vide.</p>
               <Link 
                 href="/photographies" 
                 className="inline-block px-12 py-6 border border-white/10 text-white hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-500 eyebrow uppercase tracking-widest text-[10px] rounded-sm"
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
                    className="flex flex-col md:flex-row gap-8 pb-12 border-b border-white/5 group"
                  >
                    <div className="relative aspect-[4/5] w-full md:w-40 bg-background-secondary rounded-sm overflow-hidden flex-shrink-0">
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
                             <h3 className="text-2xl font-display italic text-white mb-2">{item.title}</h3>
                             <p className="eyebrow text-[10px] text-text-muted">{item.sizeLabel} — Tirage Fine Art</p>
                          </div>
                          <button 
                            onClick={() => {
                               removeItem(item.id)
                               toast.info(`${item.title} retiré du panier`)
                            }}
                            className="p-2 text-text-muted hover:text-error transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>

                       <div className="flex justify-between items-center mt-8">
                          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/5">
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                             >
                                <Minus size={14} />
                             </button>
                             <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                             <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                                disabled={item.stockRemaining !== null && item.quantity >= item.stockRemaining}
                             >
                                <Plus size={14} />
                             </button>
                          </div>
                          <p className="text-xl font-display text-white">
                             {(item.priceCents * item.quantity / 100).toLocaleString('fr-FR', { style: 'currency', currency: item.currency })}
                          </p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                 <div className="bg-background-secondary border border-white/5 p-6 md:p-10 rounded-sm sticky top-40 shadow-2xl">
                    <h2 className="text-2xl font-display italic text-white mb-8 pb-8 border-b border-white/5">Récapitulatif</h2>
                    
                    <div className="space-y-6 mb-12">
                       <div className="flex justify-between eyebrow text-text-muted">
                          <span>Sous-total</span>
                          <span>{(totalPrice() / 100).toLocaleString('fr-FR', { style: 'currency', currency: items[0]?.currency || 'EUR' })}</span>
                       </div>
                       <div className="flex justify-between eyebrow text-text-muted">
                          <span>Livraison</span>
                          <span className="text-accent italic">Calculée à l'étape suivante</span>
                       </div>
                       <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                          <span className="text-white font-display italic text-xl">Total</span>
                          <span className="text-3xl font-display text-accent">
                             {(totalPrice() / 100).toLocaleString('fr-FR', { style: 'currency', currency: items[0]?.currency || 'EUR' })}
                          </span>
                       </div>
                    </div>

                    <Button 
                      onClick={handleCheckout}
                      loading={isCheckingOut}
                      size="xl"
                      className="w-full"
                      icon={<ArrowRight size={16} />}
                    >
                       Passer à la caisse 
                    </Button>

                    <div className="mt-12 space-y-4">
                       <p className="text-[10px] eyebrow text-text-muted flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-success rounded-full" /> Paiement sécurisé par Stripe
                       </p>
                       <p className="text-[10px] eyebrow text-text-muted flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Livraison mondiale assurée
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
