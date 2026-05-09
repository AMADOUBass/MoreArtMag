import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag, Truck, RefreshCcw } from 'lucide-react'

export default function CGV() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20">
      <div className="container-custom max-w-4xl py-20">
        <Link href="/" className="eyebrow text-text-muted hover:text-accent transition-colors flex items-center gap-2 mb-12">
           <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display italic text-white mb-16">
          Conditions Générales <span className="text-accent">de Vente</span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <ShoppingBag size={24} className="text-accent" /> Commandes et Prix
            </h2>
            <p>
              Toute commande passée sur le site MoreArt Mag implique l'acceptation sans réserve des présentes CGV. Les prix sont indiqués en Euros (EUR) ou Dollars (CAD) selon votre zone géographique et n'incluent pas les frais de livraison, calculés lors du paiement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Truck size={24} className="text-accent" /> Livraison et Délais
            </h2>
            <p>
              Les œuvres sont expédiées dans un délai de 3 à 7 jours ouvrés. Les délais de livraison varient selon la destination. MoreArt Mag n'est pas responsable des retards causés par les services de douane ou les transporteurs tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <RefreshCcw size={24} className="text-accent" /> Retours et Remboursements
            </h2>
            <p>
              Conformément à la loi, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation. Notez que les œuvres personnalisées (commandes spéciales / commissions) ne sont ni échangeables ni remboursables.
            </p>
          </section>

          <div className="pt-12 border-t border-white/5 text-xs eyebrow text-text-muted">
            Dernière mise à jour : Mai 2026
          </div>
        </div>
      </div>
    </main>
  )
}
