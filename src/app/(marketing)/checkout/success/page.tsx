'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Package, Download, Home } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

function SuccessContent() {
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
    <div className="container-custom max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 border border-green-100 mb-12 shadow-sm">
           <CheckCircle size={48} className="text-green-600/60" />
        </div>

        <h1 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-8 leading-tight">
           Merci pour votre <span className="text-[#a3a3a3]">confiance.</span>
        </h1>
        
        <p className="text-[#737373] text-lg md:text-xl leading-relaxed mb-12 italic max-w-xl mx-auto">
           "Chaque œuvre qui quitte le studio emporte avec elle un fragment de mon histoire. Je suis honoré qu'elle rejoigne la vôtre."
        </p>

        <div className="bg-white border border-black/5 p-8 rounded-sm mb-12 text-left space-y-6 shadow-xl">
           <div className="flex items-center gap-4 text-[#0a0a0a]">
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                <Package size={20} className="text-[#a3a3a3]" />
              </div>
              <div>
                 <p className="eyebrow text-[10px] text-[#737373]">Statut de la commande</p>
                 <p className="text-sm font-bold">En préparation — Expédition sous 3 à 5 jours</p>
              </div>
           </div>
           <p className="text-[10px] eyebrow text-[#a3a3a3] leading-relaxed border-t border-black/5 pt-6">
              Un email de confirmation vient d'être envoyé à votre adresse. Vous recevrez un numéro de suivi dès que votre colis aura été confié à notre transporteur.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
           <Link 
             href="/moreart" 
             className="bg-black text-white px-10 py-5 eyebrow hover:bg-[#1a1a1a] transition-all duration-500 rounded-sm flex items-center justify-center gap-3 shadow-lg"
           >
              <Home size={16} /> Retour à la galerie
           </Link>
           <Link 
             href="/a-propos" 
             className="border border-black/10 text-[#0a0a0a] px-10 py-5 eyebrow hover:bg-black hover:text-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3"
           >
              Découvrir l'univers <ArrowRight size={16} />
           </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center pt-20">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-black/5" />
            <div className="absolute inset-0 rounded-full border-2 border-t-black/40 animate-spin" />
          </div>
          <p className="eyebrow text-[#a3a3a3]">Confirmation en cours...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
