import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Peintures | La Trace du Temps',
  description: 'Découvrez les œuvres picturales de Bazan Togola. Une exploration de la matière et de la sédimentation à travers la technique mixte.',
}

async function getPaintings(): Promise<Artwork[]> {
  const sanityArtworks = await client.fetch(`
    *[_type == "artwork" && type == "peinture" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, availableInShop, featured, shortDescription
    }
  `)
  
  // Fallback si Sanity est vide ou peu rempli
  const fallbacks = [
    {
      _id: 'pa1',
      title: 'Genèse Tactile I',
      slug: { current: 'genese-tactile-1' },
      type: 'peinture',
      mainImage: null,
      year: '2026',
      location: 'Studio',
      featured: true,
      shortDescription: "Une exploration de la sédimentation et des couches de mémoire à travers la technique mixte."
    } as any,
    {
      _id: 'pa2',
      title: 'Sédimentation Ocre',
      slug: { current: 'sedimentation-ocre' },
      type: 'peinture',
      mainImage: null,
      year: '2025',
      location: 'Studio',
      featured: false,
      shortDescription: "Le dialogue entre les pigments naturels et la structure de la toile."
    } as any,
    {
      _id: 'pa3',
      title: 'Mémoire Bleue',
      slug: { current: 'memoire-bleue' },
      type: 'peinture',
      mainImage: null,
      year: '2026',
      location: 'Studio',
      featured: false,
      shortDescription: "Une immersion dans les teintes indigo, rappelant les teintures traditionnelles revisitées."
    } as any,
    {
      _id: 'pa4',
      title: 'Éclat de Terre',
      slug: { current: 'eclat-de-terre' },
      type: 'peinture',
      mainImage: null,
      year: '2026',
      location: 'Studio',
      featured: true,
      shortDescription: "La force brute de la terre capturée dans un mouvement ascendant et lumineux."
    } as any
  ]

  const combined = [...(sanityArtworks || []), ...fallbacks]
  const uniqueArtworks = Array.from(new Map(combined.map(item => [item._id, item])).values())
  return uniqueArtworks.slice(0, 4)
}

export default async function PeinturesPage() {
  const artworks = await getPaintings()

  return (
    <main className="pt-32 md:pt-64 pb-20 bg-[#f5f5f5] min-h-screen">
      <div className="container-custom">
        {/* Header Harmonisé */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display text-black/[0.03] select-none pointer-events-none leading-none">
            02
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4 text-[#404040]">
            <span className="w-12 h-[1px] bg-black/20" />
            Matière & Sédimentation
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter text-[#0a0a0a]">
            La trace <br/> 
            <span className="text-[#a3a3a3] ml-12 md:ml-24">du temps.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center ml-auto md:max-w-2xl">
             <div className="w-px h-24 bg-black/10 hidden md:block" />
             <p className="text-[#737373] text-xl md:text-2xl leading-relaxed">
              "Peindre, c'est sédimenter l'instant. C'est laisser la matière raconter ce que les mots ne peuvent plus contenir."
            </p>
          </div>
        </div>

        {/* Gallery Sections */}
        <div className="space-y-40">
          {artworks.map((art, idx) => (
            <div 
              key={art._id} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              <div className={`lg:col-span-7 ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <Link href={`/oeuvres/${art.slug.current}`} className="relative block aspect-[4/5] rounded-sm overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.08)] group cursor-pointer border border-black/5">
                  <Image
                    src={art._id.startsWith('pa') ? `/images/placeholders/painting_${art._id === 'pa3' ? '1' : art._id === 'pa4' ? '2' : art._id.replace('pa', '')}.png` : (art.mainImage ? urlFor(art.mainImage).width(1200).url() : '/images/placeholders/painting_1.png')}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className={`lg:col-span-5 ${idx % 2 === 0 ? 'lg:order-2 lg:pl-12' : 'lg:order-1 lg:pr-12'}`}>
                <p className="eyebrow text-[#a3a3a3] mb-6">Fragment {idx + 1}</p>
                <h2 className="text-5xl font-display text-[#0a0a0a] mb-8 leading-tight">{art.title}</h2>
                <p className="text-[#737373] text-lg leading-relaxed mb-12">
                  {art.shortDescription || "Une exploration profonde de la matière, où chaque couche de pigment raconte une histoire de sédimentation et de mémoire."}
                </p>
                <Link href={`/oeuvres/${art.slug.current}`}>
                  <button className="px-10 py-5 border border-black/10 hover:border-black hover:bg-black/5 text-[#0a0a0a] transition-all duration-500 eyebrow text-[10px] uppercase tracking-widest rounded-sm cursor-pointer">
                     Découvrir l'œuvre
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
