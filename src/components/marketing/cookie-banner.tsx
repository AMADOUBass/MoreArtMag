'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { useIrisStore } from '@/stores/iris-store'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  const traversed = useIrisStore((s) => s.traversed)

  useEffect(() => {
    const consent = localStorage.getItem('moreart-cookie-consent')
    if (!consent && traversed) {
      setShow(true)
    } else if (consent) {
      setShow(false)
    }
  }, [traversed])

  const handleAccept = () => {
    localStorage.setItem('moreart-cookie-consent', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed bottom-8 left-8 right-8 z-[300] flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-white/10 p-6 md:px-10 md:py-6 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-6 max-w-4xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                   <Cookie size={20} />
                </div>
                <p className="text-[10px] md:text-xs eyebrow text-white leading-relaxed max-w-md">
                   Nous utilisons des cookies pour sublimer votre expérience et assurer la sécurité des transactions. En continuant, vous acceptez notre <Link href="/politique-confidentialite" className="text-accent underline underline-offset-4">politique de confidentialité</Link>.
                </p>
             </div>
             <div className="flex items-center gap-4">
                <button 
                  onClick={handleAccept}
                  className="bg-white text-black px-8 py-3 rounded-full text-[10px] eyebrow font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-lg shadow-accent/20"
                >
                   Accepter
                </button>
                <button 
                  onClick={() => setShow(false)}
                  className="p-2 text-text-muted hover:text-white transition-colors"
                >
                   <X size={20} />
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
