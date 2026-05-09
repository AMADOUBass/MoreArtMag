import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Eye, Lock } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20">
      <div className="container-custom max-w-4xl py-20">
        <Link href="/" className="eyebrow text-text-muted hover:text-accent transition-colors flex items-center gap-2 mb-12">
           <ChevronLeft size={16} /> Retour à l'accueil
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-display italic text-white mb-16">
          Politique de <span className="text-accent">Confidentialité</span>
        </h1>

        <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section className="bg-white/5 p-8 rounded-sm border border-white/5">
            <p className="text-white font-bold mb-4">Conformité Loi 25 (Québec)</p>
            <p className="text-sm">
              Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25), MoreArt Mag s'engage à protéger la vie privée de ses utilisateurs et à assurer la transparence du traitement de leurs données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Eye size={24} className="text-accent" /> Collecte des Renseignements
            </h2>
            <p>
              Nous collectons uniquement les renseignements nécessaires à la fourniture de nos services :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identité</strong> : Nom et prénom pour le traitement des commandes et messages.</li>
              <li><strong>Coordonnées</strong> : Adresse courriel et adresse de livraison pour l'expédition et le suivi.</li>
              <li><strong>Paiement</strong> : Les transactions sont traitées de manière sécurisée par Stripe. MoreArt Mag ne stocke jamais vos informations de carte de crédit.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <Lock size={24} className="text-accent" /> Utilisation et Conservation
            </h2>
            <p>
              Vos données sont utilisées exclusivement pour :
              <br/>- Le traitement et la livraison de vos commandes.
              <br/>- La réponse à vos demandes via le formulaire de contact.
              <br/>- L'amélioration de votre expérience sur le site.
            </p>
            <p>
              Les renseignements sont conservés uniquement le temps nécessaire aux fins prévues ou pour répondre aux exigences légales (ex: fiscalité).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display italic text-white mb-6 flex items-center gap-4">
               <ShieldCheck size={24} className="text-accent" /> Responsable de la Protection des Données
            </h2>
            <p>
              Pour toute question, accès ou rectification de vos renseignements personnels, vous pouvez contacter le responsable :
            </p>
            <div className="bg-white/5 p-6 rounded-sm border border-white/5 mt-4">
              <p className="text-white font-bold">Bazan Togola</p>
              <p>Email : privacy@moreartmag.com</p>
              <p>Sujet : Responsable Loi 25</p>
            </div>
          </section>

          <div className="pt-12 border-t border-white/5 text-xs eyebrow text-text-muted">
            Dernière mise à jour : Mai 2026
          </div>
        </div>
      </div>
    </main>
  )
}
