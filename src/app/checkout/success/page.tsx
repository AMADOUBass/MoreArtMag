'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Package, Download, Home } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    // 1. Clear the cart immediately
    clearCart()

    // 2. Fetch session info to personalize (optional but nice)
    if (sessionId) {
      // We'll just simulate a small delay for cinematic effect
      setTimeout(() => {
        setLoading(false)
        setCustomerName('Artiste') // Placeholder until we have the real fetch
      }, 1500)
    }
  }, [clearCart, sessionId])

  return (
    <main className="min-h-screen bg-background-primary flex items-center justify-center pt-20">
      <div className="container-custom max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 border border-success/20 mb-12">
             <CheckCircle size={48} className="text-success" />
          </div>

          <h1 className="text-5xl md:text-7xl font-display italic text-white mb-8">
             Merci pour votre <span className="text-accent">confiance.</span>
          </h1>
          
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-12 italic max-w-xl mx-auto">
             "Chaque œuvre qui quitte le studio emporte avec elle un fragment de mon histoire. Je suis honoré qu'elle rejoigne la vôtre."
          </p>

          <div className="bg-background-secondary border border-white/5 p-8 rounded-sm mb-12 text-left space-y-6">
             <div className="flex items-center gap-4 text-white">
                <Package size={20} className="text-accent" />
                <div>
                   <p className="eyebrow text-[10px] text-text-muted">Statut de la commande</p>
                   <p className="text-sm font-bold">En préparation — Expédition sous 3 à 5 jours</p>
                </div>
             </div>
             <p className="text-[10px] eyebrow text-text-muted leading-relaxed">
                Un email de confirmation vient d'être envoyé à votre adresse. Vous recevrez un numéro de suivi dès que votre colis aura été confié à notre transporteur.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link 
               href="/moreart" 
               className="bg-white text-black px-10 py-5 eyebrow hover:bg-accent hover:text-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3"
             >
                <Home size={16} /> Retour à la galerie
             </Link>
             <Link 
               href="/a-propos" 
               className="border border-white/10 text-white px-10 py-5 eyebrow hover:border-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3"
             >
                Découvrir l'univers <ArrowRight size={16} />
             </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
