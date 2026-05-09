import React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import Breadcrumbs from '@/components/marketing/breadcrumbs'
import PortfolioCarousel from '@/components/marketing/portfolio-carousel'

export const metadata: Metadata = {
  title: 'À Propos | L\'Artiste & La Vision',
  description: 'Découvrez l\'univers de Bazan Togola, photographe et peintre explorant ses racines entre le Québec et le Mali.',
}

export default async function ArtistPage() {
  const artist = {
    name: "Bazan Togola",
    bio: "Un voyageur immobile entre deux mondes. Né au Québec, Bazan Togola explore les profondeurs de son héritage malien à travers une lentille contemporaine. Son œuvre est un dialogue vibrant entre son héritage nord-américain et une mémoire ancestrale qu'il explore à travers l'image et la matière.",
    quote: "Capturer l'invisible pour rendre hommage à ce qui nous précède.",
    vision: "Ma vision est celle d'une réconciliation. À travers le collectif Triple Vision, je cherche à exprimer ce que signifie être l'héritier d'une culture millénaire tout en vivant ici. La photographie fige cet entre-deux, la peinture lui donne une profondeur organique, créant un pont entre ma terre de naissance et mes racines lointaines."
  }

  return (
    <main className="bg-background-primary pt-32 overflow-hidden">
      {/* Hero Section - Portrait de l'Artiste */}
      <section className="container-custom py-20 lg:py-40">
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <Breadcrumbs items={[{ label: 'À PROPOS' }]} />
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            Bio
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            L'Artiste & La Quête
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            Bazan <br/> 
            <span className="italic text-accent ml-12 md:ml-24">Togola.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm group shadow-2xl">
             <Image
                src="/images/artist/bazan_portrait.png"
                alt={artist.name}
                fill
                className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
             <div className="space-y-8">
                <p className="text-text-secondary text-2xl md:text-3xl leading-tight font-display italic">
                   {artist.bio}
                </p>
                <div className="w-20 h-px bg-accent/30" />
                <p className="text-text-muted text-lg leading-relaxed">
                   De Bamako à Québec, Bazan a construit un langage visuel unique. Son travail est une méditation profonde sur l'identité, capturée à travers le grain argentique et la matière brute, créant une œuvre qui défie les frontières temporelles et géographiques.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Focus Artistique */}
      <section className="py-40 bg-white/5 relative">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="order-2 lg:order-1">
              <p className="eyebrow text-accent mb-6">La Vision</p>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-display italic text-white mb-10 leading-tight">
                 Une quête de <span className="text-accent">clarté</span> dans le chaos.
              </h2>
              <p className="text-text-secondary text-xl leading-relaxed mb-8">
                 {artist.vision}
              </p>
           </div>
           <div className="order-1 lg:order-2 relative aspect-square lg:aspect-video rounded-sm overflow-hidden shadow-2xl group">
              <Image 
                src="/images/gallery/vision_shot.png"
                alt="Vision Artistique" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
           </div>
        </div>
      </section>

      {/* Portfolio Carousel */}
      <PortfolioCarousel />

      {/* Philosophy Section */}
      <section className="bg-background-secondary py-40">
        <div className="container-custom text-center max-w-4xl">
          <span className="text-[120px] font-display italic text-accent/10 select-none">"</span>
          <h2 className="text-4xl md:text-6xl font-display italic leading-tight -mt-16 text-white mb-20">
            {artist.quote}
          </h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
             <div className="flex flex-col items-center">
                <span className="text-5xl font-display italic text-accent">15+</span>
                <p className="eyebrow mt-4 text-xs">Années de Recherche</p>
             </div>
             <div className="w-px h-16 bg-white/10 hidden md:block" />
             <div className="flex flex-col items-center">
                <span className="text-5xl font-display italic text-accent">200+</span>
                <p className="eyebrow mt-4 text-xs">Œuvres Originales</p>
             </div>
             <div className="w-px h-16 bg-white/10 hidden md:block" />
             <div className="flex flex-col items-center">
                <span className="text-5xl font-display italic text-accent">12</span>
                <p className="eyebrow mt-4 text-xs">Expositions Solo</p>
             </div>
          </div>
        </div>
      </section>

      {/* Triple Vision Section */}
      <section className="py-40 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="order-2 lg:order-1">
              <div className="flex items-center gap-6 mb-8">
                 <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5 p-2">
                    <Image 
                      src="/images/studio/logo.png" 
                      alt="Triple Vision Logo" 
                      fill 
                      className="object-contain p-2"
                    />
                 </div>
                 <h3 className="text-4xl font-display italic text-white">Triple Vision</h3>
              </div>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Plus qu'un simple atelier, **Triple Vision** est le collectif créatif fondé par Bazan et ses deux alliés. C'est ici que les idées s'entrechoquent, entre photographie, design et peinture, pour donner naissance à des œuvres qui défient les frontières.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed italic border-l-2 border-accent/30 pl-8">
                "À trois, notre regard ne se contente pas de voir, il construit une perspective nouvelle, une vision partagée de la beauté brute."
              </p>
           </div>
           <div className="order-1 lg:order-2 relative aspect-video rounded-sm overflow-hidden border border-white/5 shadow-2xl group">
              <Image 
                src="/images/studio/view.png" 
                alt="Triple Vision Studio" 
                fill 
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                 <p className="eyebrow text-white">L'Atelier Créatif — Québec</p>
              </div>
           </div>
        </div>
      </section>
    </main>
  )
}
