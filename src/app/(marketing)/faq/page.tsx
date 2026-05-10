import { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ | Questions Fréquentes',
  description: 'Tout savoir sur l\'acquisition d\'œuvres, les tirages, la livraison et les garanties de MoreArt Mag.',
}

export default function FAQPage() {
  const faqs = [
    {
      q: "Qu'est-ce qu'un tirage Fine Art ?",
      a: "Nos photographies sont imprimées sur du papier Hahnemühle de qualité musée (310g/m²). Ce papier 100% coton garantit une conservation exceptionnelle des couleurs et des noirs profonds pendant plus de 100 ans."
    },
    {
      q: "Les œuvres sont-elles signées ?",
      a: "Oui, chaque tirage est accompagné d'un certificat d'authenticité. Les éditions limitées sont numérotées et signées manuellement par l'artiste Bazan Togola."
    },
    {
      q: "Quels sont les délais de livraison ?",
      a: "Chaque commande est préparée à la demande pour garantir une qualité optimale. Comptez 5 à 10 jours ouvrés pour la France et le Canada, et 10 à 15 jours pour le reste du monde."
    },
    {
      q: "Comment sont protégées les œuvres pendant le transport ?",
      a: "Nous utilisons des emballages renforcés sur mesure : tubes rigides de haute densité pour les tirages seuls, et caisses de protection renforcées pour les œuvres encadrées."
    },
    {
      q: "Quelle est votre politique de retour ?",
      a: "Vous disposez de 14 jours après réception pour changer d'avis. L'œuvre doit nous être retournée dans son emballage d'origine et en parfait état. Les frais de retour sont à la charge du client, sauf en cas de dommage durant le transport."
    }
  ]

  return (
    <main className="pt-40 pb-40 bg-background-primary min-h-screen">
      <div className="container-custom">
        {/* Header Style Musée */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            05
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            SUPPORT & INFOS
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            Vos questions, <br/> 
            <span className="italic text-accent ml-12 md:ml-24">nos réponses.</span>
          </h1>
        </div>

        <div className="max-w-4xl space-y-24">
          {faqs.map((faq, index) => (
            <div key={index} className="group border-t border-white/5 pt-16 flex flex-col md:flex-row gap-8 md:gap-24">
               <span className="text-accent font-display italic text-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                  {String(index + 1).padStart(2, '0')}
               </span>
               <div className="flex-1">
                  <h2 className="text-3xl md:text-5xl font-display italic text-white mb-8 group-hover:text-accent transition-colors duration-700 leading-tight">
                    {faq.q}
                  </h2>
                  <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
               </div>
            </div>
          ))}
          
          <div className="pt-24 border-t border-white/10 flex flex-col items-center text-center">
             <p className="eyebrow text-text-muted mb-8 uppercase tracking-[0.3em]">Vous n&apos;avez pas trouvé votre réponse ?</p>
             <a 
               href="/contact" 
               className="group flex items-center gap-6 text-2xl md:text-3xl font-display italic text-white hover:text-accent transition-all duration-700"
             >
                Nous contacter directement
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all duration-700">
                   <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-500" />
                </div>
             </a>
          </div>
        </div>
      </div>
    </main>
  )
}
