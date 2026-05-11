import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Eye, Lock } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
      <div className="container-custom max-w-4xl py-20">
        <Link href="/" className="eyebrow text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors flex items-center gap-2 mb-12">
           <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display text-[#0a0a0a] mb-16">
          Politique de <span className="text-[#a3a3a3]">Confidentialité</span>
        </h1>

        <div className="prose max-w-none space-y-16 text-[#737373] leading-relaxed">
          <section className="bg-black/5 p-8 rounded-sm border border-black/5 relative overflow-hidden group">
            <p className="text-[#0a0a0a] font-bold mb-4 flex items-center gap-2">
               <ShieldCheck size={20} className="text-green-600/60" /> Conformité Loi 25 (Québec)
            </p>
            <p className="text-sm">
              Conformément à la **Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25)**, MoreArt Mag s'engage à protéger la vie privée de ses utilisateurs et à assurer la transparence du traitement de leurs données. Nous appliquons les principes de collecte minimale et de sécurité renforcée.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
               01. Collecte des Données
            </h2>
            <p>
              Nous collectons uniquement les renseignements nécessaires à la fourniture de nos services artistiques et commerciaux :
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>Identité & Contact</strong> : Nom, prénom et adresse courriel pour répondre à vos demandes et vous informer du suivi de vos commandes.</li>
              <li><strong>Logistique</strong> : Adresse de livraison et numéro de téléphone pour garantir la bonne réception de vos œuvres par nos transporteurs.</li>
              <li><strong>Transactions</strong> : Les paiements sont gérés exclusivement par **Stripe**. MoreArt Mag n'a jamais accès à vos coordonnées bancaires complètes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
               02. Utilisation et Sécurité
            </h2>
            <p>
              Vos données sont traitées avec la plus grande confidentialité. Elles ne sont jamais vendues ou cédées à des tiers à des fins commerciales.
              <br/><br/>
              L'accès à vos informations est restreint à l'éditeur du site et aux prestataires nécessaires à l'exécution du contrat (Stripe pour le paiement, UPS/DHL pour la livraison).
            </p>
          </section>

          <section>
             <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">03. Témoins (Cookies)</h2>
             <p>
               Nous utilisons des témoins essentiels au bon fonctionnement du site (panier, sessions) et des outils d'analyse anonymisés (Vercel Analytics) pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour bloquer ces témoins, bien que cela puisse affecter certaines fonctionnalités.
             </p>
          </section>

          <section>
            <h2 className="text-3xl font-display text-[#0a0a0a] mb-8">
               04. Responsable de la Protection
            </h2>
            <p>
              Pour toute question relative à vos données ou pour exercer vos droits d'accès et de rectification, vous pouvez contacter :
            </p>
            <div className="bg-white border border-black/5 p-8 rounded-sm shadow-xl mt-6">
              <p className="text-[#0a0a0a] font-bold text-xl font-display">Bazan Togola</p>
              <p className="text-[#a3a3a3] eyebrow text-[10px] mt-2">Responsable de la protection des renseignements personnels</p>
              <div className="w-12 h-px bg-black/10 my-4" />
              <p>Email : privacy@moreartmag.com</p>
              <p className="text-xs text-[#737373] italic mt-4">Nous nous engageons à répondre à toute demande sous un délai de 30 jours.</p>
            </div>
          </section>

          <div className="pt-12 border-t border-black/5 text-[10px] eyebrow text-[#a3a3a3]">
            Dernière mise à jour : Mai 2026. Ce document est révisé annuellement pour garantir sa conformité.
          </div>
        </div>
      </div>
    </main>
  )
}
