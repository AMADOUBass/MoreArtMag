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
  const artworks = await client.fetch(`
    *[_type == "artwork" && type == "photo" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, continent, availableInShop, featured
    }
  `)
  
  if (artworks.length > 0) return artworks

  // Fallback Placeholders si Sanity est vide
  return [
    {
      _id: 'ph1',
      title: 'Matière Éphémère I',
      slug: { current: 'matiere-ephemere-1' },
      type: 'photo',
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-1' } },
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
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-2' } },
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
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-3' } },
      year: '2026',
      location: 'Dogon Country, Mali',
      featured: false,
      shortDescription: "Une étude sur les parois de pierre et le temps qui s'y inscrit."
    } as any
  ]
}

export default async function PhotographiesPage() {
  const artworks = await getPhotos()

  return (
    <main className="pt-40 pb-20 bg-[#080808]">
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
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Lumière</span>
                <p className="text-text-muted text-sm leading-relaxed">Une étude permanente sur la diffraction et le contraste naturel, sans artifice.</p>
             </div>
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Humain</span>
                <p className="text-text-muted text-sm leading-relaxed">Le portrait comme miroir d'une âme collective et d'une histoire partagée.</p>
             </div>
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Texture</span>
                <p className="text-text-muted text-sm leading-relaxed">Le grain de la peau répondant à celui de la terre, capturé en haute résolution.</p>
             </div>
        </div>

        {/* Layout : Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12 pb-40">
          {artworks.map((art) => {
            const isPlaceholder = art._id.startsWith('ph');
            const imgSrc = isPlaceholder 
              ? `/images/placeholders/photo_${art._id.replace('ph', '')}.png`
              : (art.mainImage ? urlFor(art.mainImage).width(1000).url() : '/images/placeholders/photo_1.png');

            return (
              <div key={art._id} className="break-inside-avoid group relative rounded-sm overflow-hidden bg-background-secondary shadow-xl transition-all duration-500 hover:shadow-accent/5">
                 <Link href={`/oeuvres/${art.slug.current}`} className="block relative">
                    <Image
                      src={imgSrc}
                      alt={art.title}
                      width={800}
                      height={1000}
                      className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                       <p className="eyebrow text-accent text-[10px] mb-2">{art.location} — {art.year}</p>
                       <h3 className="text-2xl font-display italic text-white mb-2">{art.title}</h3>
                       <p className="text-white/60 text-xs italic line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                         {art.shortDescription}
                       </p>
                    </div>
                 </Link>
              </div>
            );
          })}
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
              <div className="relative aspect-video bg-white/5 rounded-sm overflow-hidden group">
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
      </div>
    </main>
  )
}
