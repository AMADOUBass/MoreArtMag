'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/button'
import { useIrisStore } from '@/stores/iris-store'
import { usePathname } from 'next/navigation'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const traversed = useIrisStore((s) => s.traversed)
  const pathname = usePathname()
  
  const isHome = pathname === '/'
  const showNewsletter = !isHome || traversed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      toast.success("Inscription réussie ! Bienvenue dans l'aventure.")
      setEmail('')
    }, 1500)
  }

  return (
    <AnimatePresence>
      {showNewsletter && (
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="py-32 relative overflow-hidden bg-background-primary"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-display italic text-white/[0.02] select-none pointer-events-none whitespace-nowrap">
             Newsletter — MoreArt
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
               <p className="eyebrow text-accent mb-6 tracking-[0.3em]">Exclusivité</p>
               <h2 className="text-4xl md:text-7xl font-display italic text-white mb-12 leading-tight">
                  Rejoignez le <span className="text-accent">collectif.</span>
               </h2>
               <p className="text-text-secondary text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed italic">
                 Recevez des avant-premières sur les nouvelles collections, des récits de voyages et des invitations aux vernissages privés.
               </p>

               <form 
                 onSubmit={handleSubmit}
                 className="relative max-w-xl mx-auto group"
               >
                  <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 focus-within:border-accent transition-all duration-500 shadow-2xl">
                     <input 
                       type="email" 
                       required
                       placeholder="votre@email.com"
                       className="flex-1 bg-transparent px-6 py-4 text-white focus:outline-none placeholder:text-text-muted eyebrow text-xs"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       disabled={status === 'success'}
                     />
                     <Button 
                       type="submit"
                       loading={status === 'loading'}
                       disabled={status === 'success'}
                       className="md:w-auto w-full group/btn"
                       icon={status === 'success' ? <CheckCircle2 size={16} /> : <Send size={16} />}
                     >
                        {status === 'success' ? 'Inscrit' : 'S\'inscrire'}
                     </Button>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-4 text-[10px] eyebrow text-text-muted">
                     <span className="w-1 h-1 bg-accent rounded-full" />
                     Pas de spam. Désinscription possible en un clic.
                  </div>
               </form>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
