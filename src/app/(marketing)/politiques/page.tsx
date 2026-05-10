import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politiques | Remboursement & Mentions Légales',
  description: 'Consultez nos politiques de remboursement, conditions de retour et informations légales.',
}

export default function PolitiquesPage() {
  return (
    <main className="pt-40 pb-40 bg-background-primary min-h-screen">
      <div className="container-custom">
        {/* Header Style Musée */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            06
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            LÉGAL & TRANSPARENCE
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            Politiques <br/> 
            <span className="italic text-accent ml-12 md:ml-24">& engagements.</span>
          </h1>
        </div>

        <div className="max-w-3xl space-y-32">
          {/* Section Remboursement */}
          <section className="border-t border-white/5 pt-12">
             <h2 className="text-4xl font-display italic text-white mb-10">Politique de Remboursement</h2>
             <div className="prose prose-invert text-text-secondary leading-relaxed space-y-6">
                <p>
                  Chez MoreArt Mag, nous nous engageons à ce que chaque œuvre vous apporte une entière satisfaction. Si ce n'est pas le cas, vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation.
                </p>
                <h3 className="text-white text-xl font-display italic mt-12 mb-4">Conditions de retour</h3>
                <ul className="list-disc pl-6 space-y-3">
                  <li>L'œuvre doit être retournée dans son état d'origine, sans aucun dommage ni trace de manipulation.</li>
                  <li>Elle doit être renvoyée dans son emballage d'origine (tube ou caisse) pour garantir sa protection.</li>
                  <li>Le certificat d'authenticité doit impérativement être inclus dans le colis de retour.</li>
                </ul>
                <p className="mt-8">
                  Une fois l'œuvre réceptionnée et inspectée par notre équipe, nous procéderons au remboursement intégral du montant de l'œuvre via le mode de paiement initial sous 7 à 10 jours ouvrés.
                </p>
             </div>
          </section>

          {/* Section Mentions Légales */}
          <section className="border-t border-white/5 pt-12">
             <h2 className="text-4xl font-display italic text-white mb-10">Mentions Légales</h2>
             <div className="prose prose-invert text-text-secondary leading-relaxed space-y-6">
                <p>
                  <strong>Éditeur du site :</strong> MoreArt Mag / Bazan Togola Studio.<br />
                  <strong>Hébergement :</strong> Vercel Inc. (San Francisco, USA).<br />
                  <strong>Propriété Intellectuelle :</strong> Toutes les images, textes et œuvres présentés sur ce site sont la propriété exclusive de Bazan Togola. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
                </p>
             </div>
          </section>
        </div>
      </div>
    </main>
  )
}
