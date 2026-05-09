import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

async function getPeintures(): Promise<Artwork[]> {
  return client.fetch(`
    *[_type == "artwork" && type == "peinture" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, continent, availableInShop, featured, shortDescription
    }
  `)
}

export default async function PeinturesPage() {
  const artworks = await getPeintures()

  return (
    <main className="pt-32 bg-[#0d0d0d]">
      <div className="container-custom py-20">
        {/* Header Harmonisé avec l'Index */}
        <div className="mb-32 md:mb-56 max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[140px] font-display italic text-white/[0.03] select-none pointer-events-none leading-none">
            02
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            Atelier & Matière
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] font-display tracking-tighter">
            L'âme sur la <br/> 
            <span className="italic text-accent ml-12 md:ml-24">toile brute.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center ml-auto md:max-w-2xl">
             <div className="w-px h-24 bg-white/10 hidden md:block" />
             <p className="text-text-secondary text-xl md:text-2xl leading-relaxed italic">
              "Chaque coup de pinceau est un souffle, une trace laissée entre le visible et l'imaginaire."
            </p>
          </div>
        </div>

        {/* Layout Différent : Liste Immersive Full Width */}
        <div className="space-y-40 md:space-y-64 pb-40">
          {artworks.map((art, idx) => (
            <section key={art._id} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              
              <div className={`lg:col-span-8 relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm group shadow-2xl ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <Image
                  src={urlFor(art.mainImage).width(1600).url()}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>

              <div className={`lg:col-span-4 flex flex-col ${idx % 2 === 0 ? 'lg:order-2 lg:pl-12' : 'lg:order-1 lg:pr-12 text-right items-end'}`}>
                <span className="text-accent text-sm font-display italic mb-4">#{idx + 1}</span>
                <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-white">{art.title}</h2>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed max-w-sm italic">
                  {art.shortDescription || "Une exploration des formes et des ombres née du mouvement intuitif de la main."}
                </p>
                <div className="flex gap-6 eyebrow text-text-muted mb-12">
                  <span>{art.year}</span>
                  <span>/</span>
                  <span>{art.location}</span>
                </div>
                <Link 
                  href={`/oeuvres/${art.slug.current}`}
                  className="inline-block px-8 py-4 border border-white/10 hover:border-accent hover:text-accent transition-all duration-300 eyebrow"
                >
                  Découvrir la toile
                </Link>
              </div>

            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
