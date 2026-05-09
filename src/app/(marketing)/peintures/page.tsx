import { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Peintures | L\'Âme sur la Toile Brute',
  description: 'Découvrez les œuvres picturales de Bazan Togola. Une exploration tactile de la matière et de la mémoire à travers des pigments naturels.',
}

async function getPeintures(): Promise<Artwork[]> {
  const artworks = await client.fetch(`
    *[_type == "artwork" && type == "peinture" && archived != true] | order(year desc) {
      _id, title, slug, type, mainImage, year, location, continent, availableInShop, featured, shortDescription
    }
  `)

  if (artworks.length > 0) return artworks

  return [
    {
      _id: 'pa1',
      title: 'Genèse Tactile I',
      slug: { current: 'genese-tactile-1' },
      type: 'peinture',
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-1' } },
      year: '2026',
      location: 'Atelier, Québec',
      shortDescription: 'Une exploration des couches géologiques et de la mémoire de la terre, où chaque épaisseur raconte un millénaire.'
    } as any,
    {
      _id: 'pa2',
      title: 'Sédimentation Blanche',
      slug: { current: 'sedimentation-blanche' },
      type: 'peinture',
      mainImage: { _type: 'image', asset: { _ref: 'placeholder-2' } },
      year: '2026',
      location: 'Atelier, Québec',
      shortDescription: 'Le vide comme matière, capturé dans l\'épaisseur du blanc et du gris, une méditation sur l\'absence.'
    } as any
  ]
}

export default async function PeinturesPage() {
  const artworks = await getPeintures()

  return (
    <main className="pt-32 bg-[#0d0d0d]">
      <div className="container-custom py-20">
        {/* Header Harmonisé */}
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
              "Chaque coup de pinceau est un souffle, une trace laissée entre le visible et l'imaginaire, une réponse tactile au silence de l'image."
            </p>
          </div>
        </div>

        {/* Layout : Liste Immersive */}
        <div className="space-y-40 md:space-y-64 pb-40">
          {artworks.map((art, idx) => {
            const isPlaceholder = art._id.startsWith('pa');
            const imgSrc = isPlaceholder 
              ? `/images/placeholders/painting_${art._id.replace('pa', '')}.png`
              : urlFor(art.mainImage).width(1600).url();

            return (
              <section key={art._id} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                
                <div className={`lg:col-span-8 relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm group shadow-2xl ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Image
                    src={imgSrc}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className={`lg:col-span-4 flex flex-col ${idx % 2 === 0 ? 'lg:order-2 lg:pl-12' : 'lg:order-1 lg:pr-12 text-right items-end'}`}>
                  <span className="text-accent text-sm font-display italic mb-4">Fragment #{idx + 1}</span>
                  <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-white font-display">{art.title}</h2>
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
                    className="inline-block px-10 py-5 border border-white/10 hover:border-accent hover:text-accent transition-all duration-500 eyebrow uppercase tracking-widest text-[10px]"
                  >
                    Découvrir l'œuvre
                  </Link>
                </div>

              </section>
            );
          })}
        </div>

        {/* Matière Section */}
        <section className="py-40 border-t border-white/5">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1 relative aspect-square bg-white/5 rounded-sm overflow-hidden group">
                 <Image 
                   src="/images/beyond-grid/peinture.png"
                   alt="Détail Matière"
                   fill
                   className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                 />
                 <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
              </div>
              <div className="order-1 lg:order-2">
                 <p className="eyebrow text-accent mb-6">La Matière</p>
                 <h2 className="text-5xl font-display italic text-white mb-10">L'organique en <span className="text-accent">fusion.</span></h2>
                 <p className="text-text-secondary text-lg leading-relaxed mb-8">
                   Bazan utilise des pigments naturels, souvent mélangés à des sables et des terres collectés lors de ses voyages. Cette approche donne à ses peintures une qualité tridimensionnelle, où la toile devient un bas-relief explorant la sédimentation de la mémoire.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-white font-display italic text-xl mb-2">Pigments</p>
                       <p className="text-text-muted text-xs leading-relaxed">Terres d'ocre du Mali et liants naturels.</p>
                    </div>
                    <div>
                       <p className="text-white font-display italic text-xl mb-2">Supports</p>
                       <p className="text-text-muted text-xs leading-relaxed">Toiles de lin brut et bois recyclé.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}
