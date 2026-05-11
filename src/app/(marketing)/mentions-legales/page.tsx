import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Info, Globe, Shield } from 'lucide-react'

export default function LegalMentions() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
      <div className="container-custom max-w-4xl py-20">
        <Link href="/" className="eyebrow text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors flex items-center gap-2 mb-12">
           <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-16">
          Mentions <span className="text-[#a3a3a3]">Légales</span>
        </h1>

        <div className="prose max-w-none space-y-16 text-[#737373] leading-relaxed">
          <section>
             <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
                01. Édition du Site
             </h2>
             <p>
               Le site **MoreArt Mag** (accessible à l'adresse moreartmag.art) est une publication artistique éditée par :
               <br/><strong>Bazan Togola</strong>
               <br/>Artiste Visual & Photographe
               <br/>Siège social : 430 Rue Faraday #102, Québec, QC G1N 4E5, Canada
               <br/>Email : contact@moreartmag.com
               <br/>Directeur de la publication : Bazan Togola
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
                02. Hébergement
             </h2>
             <p>
               La plateforme est hébergée par la société **Vercel Inc.**
               <br/>Siège social : 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
               <br/>Site web : https://vercel.com
               <br/>Infrastructure de données : Supabase (AWS East Coast).
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
                03. Propriété Intellectuelle
             </h2>
             <p>
               L'intégralité du site (structure, mise en page, logos, textes, photographies, peintures) est protégée par les lois internationales sur la propriété intellectuelle et le droit d'auteur.
             </p>
             <p className="bg-black/5 p-6 border-l-2 border-[#0a0a0a]">
               Toute reproduction, représentation, modification ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Bazan Togola.
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">04. Limitation de Responsabilité</h2>
             <p>
               MoreArt Mag s'efforce d'assurer l'exactitude des informations diffusées. Toutefois, l'éditeur ne pourra être tenu responsable des omissions ou des carences dans la mise à jour, qu'elles soient de son fait ou du fait des partenaires tiers qui lui fournissent ces informations.
             </p>
          </section>

          <div className="pt-12 border-t border-black/5 text-[10px] eyebrow text-[#a3a3a3]">
             MoreArt Mag © 2026 — Tous droits réservés. Design & Code par le collectif Triple Vision.
          </div>
        </div>
      </div>
    </main>
  )
}
