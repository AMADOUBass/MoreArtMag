import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Info, Globe, Shield } from 'lucide-react'

export default function LegalMentions() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20">
      <div className="container-custom max-w-4xl py-20">
        <Link href="/" className="eyebrow text-text-muted hover:text-accent transition-colors flex items-center gap-2 mb-12">
           <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display italic text-white mb-16">
          Mentions <span className="text-accent">Légales</span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Info size={24} className="text-accent" /> Édition du Site
            </h2>
            <p>
              Le site <strong>MoreArt Mag</strong> est édité par l'artiste Bazan Togola.
              <br/>Domiciliation : Bamako, Mali / Québec, Canada.
              <br/>Contact : contact@moreartmag.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Globe size={24} className="text-accent" /> Hébergement
            </h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>
              <br/>Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              <br/>Site web : https://vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Shield size={24} className="text-accent" /> Propriété Intellectuelle
            </h2>
            <p>
              L'ensemble des contenus présents sur ce site (photographies, peintures, textes, logos) sont la propriété exclusive de Bazan Togola ou du collectif Triple Vision. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
            </p>
          </section>

          <div className="pt-12 border-t border-white/5 text-xs eyebrow text-text-muted">
            MoreArt Mag © 2026 — Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  )
}
