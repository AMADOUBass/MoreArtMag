import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

async function getPhotos(): Promise<Artwork[]> {
  return client.fetch(`
    *[_type == "artwork" && type == "photo" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, continent, availableInShop, featured
    }
  `)
}

export default async function PhotographiesPage() {
  const artworks = await getPhotos()

  return (
    <main className="pt-40 pb-20 bg-[#080808]">
      <div className="container-custom">
        {/* Header Harmonisé avec l'Index */}
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
              "Saisir la lumière là où elle s'oublie, pour raconter ce que le regard ne voit plus."
            </p>
          </div>
        </div>

        {/* Détails Techniques / Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-t border-white/5 pt-12">
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Lumière</span>
                <p className="text-text-muted text-sm leading-relaxed">Une étude permanente sur la diffraction et le contraste naturel.</p>
             </div>
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Humain</span>
                <p className="text-text-muted text-sm leading-relaxed">Le portrait comme miroir d'une âme collective.</p>
             </div>
             <div className="space-y-4">
                <span className="text-accent font-display italic text-2xl">Texture</span>
                <p className="text-text-muted text-sm leading-relaxed">Le grain de la peau répondant à celui de la terre.</p>
             </div>
        </div>

        {/* Layout Différent : Masonry-like Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12 pb-40">
          {artworks.map((art) => (
            <div key={art._id} className="break-inside-avoid group relative rounded-sm overflow-hidden bg-background-secondary shadow-xl">
               <Link href={`/oeuvres/${art.slug.current}`} className="block relative">
                  <Image
                    src={urlFor(art.mainImage).width(1000).url()}
                    alt={art.title}
                    width={800}
                    height={1000}
                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <p className="eyebrow text-white text-[10px] mb-2">{art.location}</p>
                     <h3 className="text-2xl font-display italic text-white">{art.title}</h3>
                  </div>
               </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
