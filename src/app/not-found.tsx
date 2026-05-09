'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background-primary flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[140px] font-display italic text-white/[0.03] leading-none mb-4 select-none">
            404
          </p>
          <h1 className="text-5xl md:text-7xl font-display italic text-white mb-8">
            L'œuvre <span className="text-accent">introuvable.</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl italic leading-relaxed mb-12 max-w-lg mx-auto">
             "Parfois, l'œil cherche ce qui n'est pas encore né. Cette page est un espace vide, une toile qui attend son image."
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link 
               href="/" 
               className="bg-white text-black px-10 py-5 eyebrow hover:bg-accent hover:text-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3"
             >
                <Home size={16} /> Retour à l'accueil
             </Link>
             <Link 
               href="/moreart" 
               className="border border-white/10 text-white px-10 py-5 eyebrow hover:border-white transition-all duration-500 rounded-sm flex items-center justify-center gap-3 group"
             >
                Voir la galerie <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
             </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
