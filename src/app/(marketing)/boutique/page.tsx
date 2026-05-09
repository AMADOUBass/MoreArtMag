import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'
import { ShoppingBag, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Boutique | Acquisition & Collection',
  description: 'Acquérez un fragment d\'âme. Découvrez les tirages limités et les œuvres originales de Bazan Togola.',
}

async function getShopArtworks(): Promise<Artwork[]> {
  const artworks = await client.fetch(`
    *[_type == "artwork" && availableInShop == true && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, availableInShop, featured
    }
  `)

  if (artworks.length > 0) return artworks

  // Fallbacks si la boutique est vide dans Sanity
  return [
    {
      _id: 'shop1',
      title: 'Silence du Sahel',
      slug: { current: 'silence-du-sahel' },
      type: 'photo',
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-1' } },
      availableInShop: true,
      featured: true
    } as any,
    {
      _id: 'shop2',
      title: 'Genèse Tactile I',
      slug: { current: 'genese-tactile-1' },
      type: 'peinture',
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-1' } },
      availableInShop: true,
      featured: false
    } as any
  ]
}

export default async function BoutiquePage() {
  const artworks = await getShopArtworks()

  return (
    <main className="pt-40 pb-20 bg-background-primary">
      <div className="container-custom">
        {/* Header Harmonisé */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            03
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            Acquisition & Collection
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            Posséder un <br/> 
            <span className="italic text-accent ml-12 md:ml-24">fragment d'âme.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center ml-auto md:max-w-2xl">
             <div className="w-px h-24 bg-white/10 hidden md:block" />
             <p className="text-text-secondary text-xl md:text-2xl leading-relaxed italic">
              "L'art ne doit pas seulement être contemplé, il doit être vécu au quotidien, trouvant sa place dans l'intimité de votre espace."
            </p>
          </div>
        </div>

        {/* Info barre boutique */}
        <div className="flex flex-wrap gap-8 md:gap-16 eyebrow text-text-muted mb-24 border-b border-white/5 pb-12">
            <div className="flex flex-col">
              <span className="text-white text-xl font-display italic">Livraison</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">Monde Entier</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-white text-xl font-display italic">Certificat</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">Authenticité Garantie</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-white text-xl font-display italic">Support</span>
              <span className="text-[10px] uppercase tracking-widest mt-1">Fine Art & Toile</span>
            </div>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {artworks.map((art) => {
             const isPlaceholder = art._id.startsWith('shop');
             const imgSrc = isPlaceholder 
               ? (art.type === 'photo' ? '/images/placeholders/photo_1.png' : '/images/placeholders/painting_1.png')
               : urlFor(art.mainImage).width(1000).url();
             
             return (
              <div key={art._id} className="group flex flex-col">
                 <Link href={`/oeuvres/${art.slug.current}`} className="relative aspect-[3/4] overflow-hidden bg-background-secondary mb-8 rounded-sm shadow-2xl">
                    <Image
                      src={imgSrc}
                      alt={art.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                       <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-500 transform scale-90 group-hover:scale-100">
                          <ShoppingBag size={24} />
                       </div>
                       <div className="w-14 h-14 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 transform scale-90 group-hover:scale-100">
                          <Eye size={24} />
                       </div>
                    </div>
                 </Link>

                 <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-display italic text-white group-hover:text-accent transition-colors mb-2">{art.title}</h3>
                      <p className="eyebrow text-[10px] text-text-muted">{art.type === 'photo' ? 'Tirage Limité / Fine Art' : 'Œuvre Originale / Technique Mixte'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display italic text-white">{art.type === 'photo' ? 'À partir de 450€' : 'Prix sur demande'}</p>
                      <p className="text-[9px] eyebrow text-success tracking-[0.2em] mt-1 uppercase">Disponible</p>
                    </div>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                    <span className="px-4 py-1.5 bg-white/5 text-[9px] eyebrow rounded-full border border-white/5">Plusieurs Formats</span>
                    <span className="px-4 py-1.5 bg-white/5 text-[9px] eyebrow rounded-full border border-white/5">Expédition Sécurisée</span>
                 </div>
              </div>
             );
          })}
        </div>

        {artworks.length === 0 && (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
             <ShoppingBag size={48} className="mx-auto text-white/10 mb-8" />
             <h2 className="text-3xl font-display italic text-white mb-4">La boutique se prépare.</h2>
             <p className="text-text-muted eyebrow max-w-sm mx-auto">Nous sélectionnons actuellement les meilleures pièces pour la collection en ligne.</p>
          </div>
        )}
      </div>
    </main>
  )
}
