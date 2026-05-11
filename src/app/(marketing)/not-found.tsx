'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[140px] font-display text-black/[0.03] leading-none mb-4 select-none">
            404
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-8 tracking-tighter">
            L'œuvre <span className="text-[#a3a3a3]">introuvable.</span>
          </h1>
          <p className="text-[#737373] text-lg md:text-xl leading-relaxed mb-12 max-w-lg mx-auto">
             "Parfois, l'œil cherche ce qui n'est pas encore né. Cette page est un espace vide, une toile qui attend son image."
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link 
               href="/" 
               className="bg-[#0a0a0a] text-white px-10 py-5 eyebrow hover:bg-[#262626] transition-all duration-500 rounded-sm flex items-center justify-center gap-3 shadow-xl"
             >
                <Home size={16} /> Retour à l'accueil
             </Link>
             <Link 
               href="/photographies" 
               className="border border-black/10 text-[#0a0a0a] px-10 py-5 eyebrow hover:border-black transition-all duration-500 rounded-sm flex items-center justify-center gap-3 group"
             >
                Voir la galerie <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
             </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
