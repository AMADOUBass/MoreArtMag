import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'
import { ShoppingBag, Eye } from 'lucide-react'

async function getShopArtworks(): Promise<Artwork[]> {
  return client.fetch(`
    *[_type == "artwork" && availableInShop == true && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, availableInShop, featured
    }
  `)
}

export default async function BoutiquePage() {
  const artworks = await getShopArtworks()

  return (
    <main className="pt-40 pb-20 bg-background-primary">
      <div className="container-custom">
        {/* Header Harmonisé avec l'Index */}
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
              "L'art ne doit pas seulement être contemplé, il doit être vécu au quotidien dans votre propre espace."
            </p>
          </div>
        </div>

        {/* Info barre boutique */}
        <div className="flex gap-12 eyebrow text-text-muted mb-24 border-b border-white/5 pb-12">
            <div className="flex flex-col">
              <span className="text-white text-xl font-display italic">Livraison</span>
              <span>Internationale</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-xl font-display italic">Certificat</span>
              <span>d'Authenticité</span>
            </div>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {artworks.map((art) => (
            <div key={art._id} className="group flex flex-col">
               <Link href={`/oeuvres/${art.slug.current}`} className="relative aspect-[3/4] overflow-hidden bg-background-secondary mb-8">
                  <Image
                    src={urlFor(art.mainImage).width(1000).url()}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                        <ShoppingBag size={20} />
                     </div>
                     <div className="w-12 h-12 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                        <Eye size={20} />
                     </div>
                  </div>
               </Link>

               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-display italic text-white group-hover:text-accent transition-colors mb-2">{art.title}</h3>
                    <p className="eyebrow text-[10px]">{art.type === 'photo' ? 'Tirage Limité' : 'Œuvre Originale'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display italic text-white">À partir de 450€</p>
                    <p className="text-[10px] eyebrow text-success">Disponible</p>
                  </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                  <span className="px-3 py-1 bg-white/5 text-[9px] eyebrow rounded-full">Format Multiple</span>
                  <span className="px-3 py-1 bg-white/5 text-[9px] eyebrow rounded-full">Encadrement Optionnel</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
