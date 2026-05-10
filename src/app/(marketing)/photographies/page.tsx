import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Photographies | L\'Immersion dans l\'Instant',
  description: 'Explorez la collection photographique de Bazan Togola. Des captures poétiques entre le grain du papier et la mémoire du lieu.',
}

async function getPhotos(): Promise<Artwork[]> {
  const sanityArtworks = await client.fetch(`
    *[_type == "artwork" && type == "photo" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, continent, availableInShop, featured
    }
  `)
  
  // Fallback Placeholders si Sanity est vide ou peu rempli
  const fallbacks = [
    {
      _id: 'ph1',
      title: 'Matière Éphémère I',
      slug: { current: 'matiere-ephemere-1' },
      type: 'photo',
      mainImage: null,
      year: '2026',
      location: 'Sahara, Mali',
      featured: true,
      shortDescription: "Une capture du mouvement du sable sous une lumière rasante, révélant la texture du désert comme une peau vivante."
    } as any,
    {
      _id: 'ph2',
      title: 'L\'Ombre Portée',
      slug: { current: 'ombre-portee' },
      type: 'photo',
      mainImage: null,
      year: '2025',
      location: 'Bamako, Mali',
      featured: false,
      shortDescription: "Le jeu des contrastes dans les rues de Bamako, où l'obscurité définit la forme."
    } as any,
    {
      _id: 'ph3',
      title: 'Sédimentation Tactile',
      slug: { current: 'sedimentation-tactile' },
      type: 'photo',
      mainImage: null,
      year: '2026',
      location: 'Dogon Country, Mali',
      featured: false,
      shortDescription: "Une étude sur les parois de pierre et le temps qui s'y inscrit."
    } as any,
    {
      _id: 'ph4',
      title: 'Le Regard du Père',
      slug: { current: 'regard-du-pere' },
      type: 'photo',
      mainImage: null,
      year: '2024',
      location: 'Bamako, Mali',
      featured: true,
      shortDescription: "Un portrait d'une profondeur rare, où chaque ride raconte un siècle d'histoire et de résilience."
    } as any,
    {
      _id: 'ph5',
      title: 'Grain de Vie',
      slug: { current: 'grain-de-vie' },
      type: 'photo',
      mainImage: null,
      year: '2026',
      location: 'Mopti, Mali',
      featured: false,
      shortDescription: "L'intersection entre la peau et la terre, une exploration macroscopique de la matière vivante."
    } as any,
    {
      _id: 'ph6',
      title: 'Le Souffle du Fleuve',
      slug: { current: 'souffle-du-fleuve' },
      type: 'photo',
      mainImage: null,
      year: '2025',
      location: 'Ségou, Mali',
      featured: true,
      shortDescription: "Une pose longue sur le fleuve Niger, où l'eau devient une brume mystique sous le soleil couchant."
    } as any,
    {
      _id: 'ph7',
      title: 'L\'Appel de l\'Ancestral',
      slug: { current: 'appel-ancestral' },
      type: 'photo',
      mainImage: null,
      year: '2026',
      location: 'Tombouctou, Mali',
      featured: false,
      shortDescription: "Un détail architectural d'une porte sculptée, témoin silencieux de siècles de savoir et de culture."
    } as any
  ]

  const combined = [...(sanityArtworks || []), ...fallbacks]
  // On s'assure d'avoir une liste unique (basée sur l'ID) et de limiter à un nombre harmonieux (ex: 6)
  const uniqueArtworks = Array.from(new Map(combined.map(item => [item._id, item])).values())
  return uniqueArtworks.slice(0, 6)
}

export default async function PhotographiesPage() {
  const artworks = await getPhotos()

  return (
    <main className="pt-40 pb-20 bg-[#080808] min-h-screen">
      <div className="container-custom">
        {/* Header Harmonisé */}
        <div className="mb-32 md:mb-48 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            01
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            Collection Photographique
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            L'immersion <br/> 
            <span className="italic text-accent ml-12 md:ml-24">dans l'instant.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center ml-auto md:max-w-2xl">
             <div className="w-px h-24 bg-white/10 hidden md:block" />
             <p className="text-text-secondary text-xl md:text-2xl leading-relaxed italic">
              "Saisir la lumière là où elle s'oublie, pour raconter ce que le regard ne voit plus, entre le grain du papier et la mémoire du lieu."
            </p>
          </div>
        </div>

        {/* Détails Techniques / Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-48 border-t border-white/5 pt-12">
             <div className="space-y-6 group">
                <div className="relative aspect-square w-full rounded-sm overflow-hidden mb-8 shadow-2xl">
                   <Image 
                     src="/images/placeholders/photo_2.png" 
                     alt="Lumière" 
                     fill 
                     className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                   />
                </div>
                <span className="text-accent font-display italic text-2xl">Lumière</span>
                <p className="text-text-muted text-sm leading-relaxed">Une étude permanente sur la diffraction et le contraste naturel, sans artifice.</p>
             </div>
             <div className="space-y-6 group">
                <div className="relative aspect-square w-full rounded-sm overflow-hidden mb-8 shadow-2xl">
                   <Image 
                     src="/images/placeholders/photo_4.png" 
                     alt="Humain" 
                     fill 
                     className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                   />
                </div>
                <span className="text-accent font-display italic text-2xl">Humain</span>
                <p className="text-text-muted text-sm leading-relaxed">Le portrait comme miroir d'une âme collective et d'une histoire partagée.</p>
             </div>
             <div className="space-y-6 group">
                <div className="relative aspect-square w-full rounded-sm overflow-hidden mb-8 shadow-2xl">
                   <Image 
                     src="/images/placeholders/photo_5.png" 
                     alt="Texture" 
                     fill 
                     className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                   />
                </div>
                <span className="text-accent font-display italic text-2xl">Texture</span>
                <p className="text-text-muted text-sm leading-relaxed">Le grain de la peau répondant à celui de la terre, capturé en haute résolution.</p>
             </div>
        </div>

        {/* Processus Section */}
        <section className="py-40 border-t border-white/5">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <p className="eyebrow text-accent mb-6">Le Processus</p>
                 <h2 className="text-5xl font-display italic text-white mb-10">L'alchimie du <span className="text-accent">regard.</span></h2>
                 <p className="text-text-secondary text-lg leading-relaxed mb-8">
                   Chaque photographie est le fruit d'une attente. Bazan travaille principalement en lumière naturelle, privilégiant les "heures bleues" et les contrastes forts du Sahel. L'objectif n'est pas de documenter, mais de traduire une émotion brute en une image intemporelle.
                 </p>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                       <div className="w-2 h-2 bg-accent rounded-full" />
                       <p className="text-white text-sm eyebrow">Tirages Fine Art sur papier Hahnemühle</p>
                    </div>
                    <div className="flex gap-4 items-center">
                       <div className="w-2 h-2 bg-accent rounded-full" />
                       <p className="text-white text-sm eyebrow">Certificat d'authenticité signé</p>
                    </div>
                    <div className="flex gap-4 items-center">
                       <div className="w-2 h-2 bg-accent rounded-full" />
                       <p className="text-white text-sm eyebrow">Éditions limitées à 12 exemplaires</p>
                    </div>
                 </div>
              </div>
              <div className="relative aspect-video bg-white/5 rounded-sm overflow-hidden group shadow-2xl">
                 <Image 
                   src="/images/beyond-grid/photo.png"
                   alt="Processus Photo"
                   fill
                   className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
                 <div className="absolute bottom-8 left-8">
                    <p className="eyebrow text-white italic">"Le silence est le meilleur réglage."</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Full Gallery Grid */}
        <section className="py-24 border-t border-white/5">
          <div className="flex justify-between items-end mb-16">
             <div>
                <p className="eyebrow text-accent mb-4">Portfolio</p>
                <h2 className="text-4xl md:text-5xl font-display italic text-white">Œuvres Disponibles</h2>
             </div>
             <p className="eyebrow text-text-muted hidden md:block">
               {artworks.length} Tirages Originaux
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {artworks.map((art) => (
              <Link key={art._id} href={`/oeuvres/${art.slug.current}`} className="group space-y-6 cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-background-secondary shadow-xl">
                  <Image
                    src={
                      art.mainImage 
                        ? (art._id.startsWith('ph') 
                            ? `/images/placeholders/photo_${art._id === 'ph6' ? '4' : art._id === 'ph7' ? '5' : art._id.replace('ph', '')}.png` 
                            : urlFor(art.mainImage).width(800).url())
                        : `/images/placeholders/photo_${(art.title.toLowerCase().includes('sahel') || art.title.toLowerCase().includes('silence')) ? '1' : '2'}.png`
                    }
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-display italic text-white group-hover:text-accent transition-colors duration-300">{art.title}</h3>
                  <p className="eyebrow text-text-muted text-[10px] mt-2">{art.location} — {art.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
