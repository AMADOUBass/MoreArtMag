import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/marketing/breadcrumbs'

export const metadata: Metadata = {
  title: 'À Propos | L\'Artiste & La Vision',
  description: 'Découvrez l\'univers de Bazan Togola, photographe et peintre explorant ses racines entre le Québec et le Mali.',
}

export default async function ArtistPage() {
  const artist = {
    name: "Bazan Togola",
    bio: "Un voyageur immobile entre deux mondes. Né au Québec, Bazan Togola explore les profondeurs de son héritage malien à travers une lentille contemporaine. Son œuvre est un dialogue vibrant entre son héritage nord-américain et une mémoire ancestrale qu'il explore à travers l'image et la matière.",
    quote: "Capturer l'invisible pour rendre hommage à ce qui nous précède.",
    vision: "Ma vision est celle d'une réconciliation. À travers le collectif Triple Vision, je cherche à exprimer ce que signifie être l'héritier d'une culture millénaire tout en vivant ici. La photographie fige cet entre-deux, la peinture lui donne une profondeur organique."
  }

  return (
    <main className="bg-[#f5f5f5] pt-32 md:pt-64 overflow-hidden">
      {/* Hero Section - Portrait de l'Artiste */}
      <section className="container-custom pb-20">
        <div className="mb-24 max-w-4xl relative">
          <Breadcrumbs items={[{ label: 'À PROPOS' }]} />
          <div className="absolute -left-12 -top-12 text-[140px] font-display text-black/[0.03] select-none pointer-events-none leading-none">
            Bio
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4 text-[#404040]">
            <span className="w-12 h-[1px] bg-black/20" />
            L'Artiste & La Quête
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter text-[#0a0a0a]">
            Bazan <br/> 
            <span className="text-[#a3a3a3] ml-12 md:ml-24">Togola.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm group shadow-xl">
             <Image
                src="/images/artist/bazan_portrait.png"
                alt={artist.name}
                fill
                className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
             <div className="space-y-8">
                <p className="text-[#0a0a0a] text-2xl md:text-3xl leading-tight font-display">
                   {artist.bio}
                </p>
                <div className="w-20 h-px bg-black/10" />
                <p className="text-[#737373] text-lg leading-relaxed">
                   De Bamako à Québec, Bazan a construit un langage visuel unique. Son travail est une méditation profonde sur l'identité, capturée à travers le grain argentique et la matière brute, créant une œuvre qui défie les frontières.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Vision Combined */}
      <section className="py-32 container-custom border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center mb-24">
           <h2 className="text-3xl md:text-5xl font-display text-[#0a0a0a] mb-10 leading-tight">
             "{artist.quote}"
           </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
           <div className="space-y-10">
              <div>
                 <p className="eyebrow text-[#0a0a0a] mb-4">La Vision</p>
                 <p className="text-[#737373] text-xl leading-relaxed">
                   {artist.vision}
                 </p>
              </div>
              <div className="pt-10 border-t border-black/5">
                 <p className="eyebrow text-[#0a0a0a] mb-6 flex items-center gap-4">
                    <span className="w-2 h-2 bg-black rounded-full" />
                    Triple Vision Collective
                 </p>
                 <p className="text-[#737373] text-lg leading-relaxed">
                   Fondé par Bazan et ses alliés, le collectif Triple Vision est le berceau de ses explorations. C'est ici que photographie, design et peinture fusionnent pour donner naissance à des perspectives nouvelles.
                 </p>
              </div>
           </div>
           
           <div className="relative aspect-video rounded-sm overflow-hidden shadow-xl group border border-black/5">
              <Image 
                src="/images/studio/view.png" 
                alt="Triple Vision Studio" 
                fill 
                className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute bottom-6 left-6">
                 <p className="eyebrow text-white text-[9px] bg-black/40 px-2 py-1 backdrop-blur-sm rounded-sm">L'Atelier — Québec, Canada</p>
              </div>
           </div>
        </div>
      </section>

      {/* Editorial Gateway / Manifeste */}
      <section className="bg-white py-32 border-t border-black/5 relative overflow-hidden">
         <div className="container-custom relative z-10">
            <div className="text-center mb-24">
               <p className="eyebrow text-[#0a0a0a] mb-6">Explorer l'Œuvre</p>
               <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-[#0a0a0a] mb-8 leading-[0.9]">
                  Trois piliers, <br/> une <span className="text-[#a3a3a3]">seule vision.</span>
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
               {/* Bloc Boutique (Left) */}
               <Link href="/boutique" className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-black md:mt-24">
                  <Image 
                    src="/images/beyond-grid/boutique.png" 
                    alt="Boutique" 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                     <p className="eyebrow text-white/80 mb-2 transition-all duration-700" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Acquérir une Œuvre</p>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-tight transition-all duration-700" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>Tirages d'Art</h3>
                     <div className="mt-4 w-0 group-hover:w-full h-px bg-white/30 transition-all duration-1000 ease-out" />
                  </div>
               </Link>

               {/* Bloc Photographie (Middle - Highest) */}
               <Link href="/photographies" className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-black">
                  <Image 
                    src="/images/beyond-grid/photo.png" 
                    alt="Photographies" 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                     <p className="eyebrow text-white/80 mb-2 transition-all duration-700" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>L'Art de l'Instant</p>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-tight transition-all duration-700" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>Photographies</h3>
                     <div className="mt-4 w-0 group-hover:w-full h-px bg-white/30 transition-all duration-1000 ease-out" />
                  </div>
               </Link>

               {/* Bloc Peinture (Right) */}
               <Link href="/peintures" className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-black md:mt-24">
                  <Image 
                    src="/images/beyond-grid/peinture.png" 
                    alt="Peintures" 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                     <p className="eyebrow text-white/80 mb-2 transition-all duration-700" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Matière & Lumière</p>
                     <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-tight transition-all duration-700" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>Peintures</h3>
                     <div className="mt-4 w-0 group-hover:w-full h-px bg-white/30 transition-all duration-1000 ease-out" />
                  </div>
               </Link>
            </div>
         </div>
      </section>
    </main>
  )
}
