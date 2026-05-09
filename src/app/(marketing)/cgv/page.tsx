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

        <div className="prose prose-invert max-w-none space-y-16 text-text-secondary leading-relaxed">
          <section>
             <h2 className="text-3xl font-display italic text-white mb-8 flex items-center gap-4">
                <ShoppingBag size={28} className="text-accent" /> 01. Commandes et Tarification
             </h2>
             <p>
               Toute commande passée sur le site **MoreArt Mag** constitue une acceptation ferme et définitive des présentes conditions. Les prix affichés sont exprimés en Euros (€) ou Dollars ($) et s'entendent hors taxes et frais de port, sauf mention contraire. 
             </p>
             <p>
               Les œuvres étant pour la plupart des tirages limités ou des pièces uniques, la disponibilité est confirmée au moment du paiement. En cas d'indisponibilité exceptionnelle après commande, un remboursement intégral sera effectué sous 48h.
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-display italic text-white mb-8 flex items-center gap-4">
                <Truck size={28} className="text-accent" /> 02. Expédition et Logistique
             </h2>
             <p>
               Nous apportons un soin extrême à l'emballage de chaque œuvre. Les tirages sont expédiés dans des tubes rigides de haute protection, et les toiles dans des caisses sur mesure. 
             </p>
             <ul className="list-disc pl-6 space-y-4">
                <li><strong>Délais :</strong> Expédition sous 5 à 10 jours ouvrés pour les tirages, 15 jours pour les toiles encadrées.</li>
                <li><strong>Zones :</strong> Nous livrons dans le monde entier via des transporteurs spécialisés (UPS, DHL, FedEx).</li>
                <li><strong>Assurance :</strong> Toutes nos expéditions sont assurées à hauteur de la valeur de l'œuvre.</li>
             </ul>
          </section>

          <section>
             <h2 className="text-3xl font-display italic text-white mb-8 flex items-center gap-4">
                <RefreshCcw size={28} className="text-accent" /> 03. Rétractation et Retours
             </h2>
             <p>
               Conformément à la législation en vigueur, vous disposez d'un droit de rétractation de 14 jours à compter de la réception de l'œuvre. 
             </p>
             <p className="bg-white/5 p-6 border-l-2 border-accent italic">
               Note importante : Les commandes de "Commissions" (œuvres réalisées sur mesure) et les tirages personnalisés ne peuvent faire l'objet d'un retour ou d'un remboursement, sauf en cas de dommage durant le transport.
             </p>
             <p>
               En cas de dommage à la livraison, vous devez impérativement émettre des réserves auprès du transporteur et nous contacter sous 24h avec des photographies du colis et de l'œuvre.
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-display italic text-white mb-8">04. Propriété et Droits d'Auteur</h2>
             <p>
               L'achat d'une œuvre ne transfère en aucun cas les droits de reproduction ou d'exploitation à l'acheteur. Bazan Togola conserve l'intégralité de sa propriété intellectuelle sur chaque création.
             </p>
          </section>

          <div className="pt-12 border-t border-white/5 text-[10px] eyebrow text-text-muted flex justify-between items-center">
             <span>Dernière mise à jour : Mai 2026</span>
             <span>MoreArt Mag © All Rights Reserved</span>
          </div>
        </div>
      </div>
    </main>
  )
}
