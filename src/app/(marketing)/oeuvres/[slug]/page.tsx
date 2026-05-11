import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import { notFound } from 'next/navigation'
import ArtworkView from '@/components/marketing/artwork-view'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { createClient } from '@/lib/supabase/server'
import { ArtworkWithStock } from '@/types/artwork'

import Breadcrumbs from '@/components/marketing/breadcrumbs'

interface PageProps {
  params: { slug: string }
}

async function getArtwork(slug: string): Promise<ArtworkWithStock | null> {
  const artwork = await client.fetch(
    `*[_type == "artwork" && slug.current == $slug][0] {
      ...,
      sizes[] {
        sizeId, label, widthCm, heightCm
      }
    }`,
    { slug }
  )

  if (!artwork) return null

  const supabase = await createClient()
  const { data: stock } = await supabase
    .from('artwork_stock')
    .select('*')
    .eq('artwork_sanity_id', artwork._id)

  return { ...artwork, stock: stock || [] }
}

async function getRelatedWorks(type: string, currentId: string): Promise<Artwork[]> {
  return client.fetch(
    `*[_type == "artwork" && type == $type && _id != $currentId][0...3] {
      _id, title, slug, mainImage, year, location
    }`,
    { type, currentId }
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = await getArtwork(slug)
  if (!artwork) return { title: 'Œuvre non trouvée' }

  return {
    title: `${artwork.title} | MoreArt Mag`,
    description: artwork.shortDescription || `Découvrez ${artwork.title} par Bazan Togola.`,
    openGraph: {
      images: artwork.mainImage ? [urlFor(artwork.mainImage).width(1200).height(630).url()] : [],
    }
  }
}

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params
  const artwork = await getArtwork(slug)
  if (!artwork) notFound()

  const relatedWorks = await getRelatedWorks(artwork.type, artwork._id)

  return (
    <main className="pt-32 pb-20 bg-[#f5f5f5] min-h-screen">
      <div className="container-custom py-20">
        {/* Navigation fil d'Ariane dynamique */}
        <Breadcrumbs items={[
          { label: 'GALERIE', href: '/moreart' },
          { label: artwork.title }
        ]} />

        <ArtworkView artwork={artwork} />

        {/* Structured Data (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": artwork.title,
              "image": artwork.mainImage ? urlFor(artwork.mainImage).width(1200).url() : '',
              "description": artwork.shortDescription,
              "brand": {
                "@type": "Brand",
                "name": "Bazan Togola"
              },
              "offers": artwork.stock?.map(s => ({
                "@type": "Offer",
                "price": s.price_cents / 100,
                "priceCurrency": s.currency,
                "availability": s.remaining && s.remaining > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvres/${artwork.slug.current}`
              }))
            })
          }}
        />

        {/* Section: Related Works */}
        {relatedWorks.length > 0 && (
          <section className="mt-40 pt-40 border-t border-black/5">
            <div className="flex justify-between items-end mb-16">
               <div>
                  <p className="eyebrow text-[#a3a3a3] mb-4">Dans la même série</p>
                  <h2 className="text-4xl md:text-5xl font-display text-[#0a0a0a]">Fragments Complémentaires</h2>
               </div>
               <Link href="/moreart" className="eyebrow text-[#0a0a0a] hover:text-[#a3a3a3] transition-colors hidden md:block">
                  Voir toute la collection →
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {relatedWorks.map((art) => (
                 <Link key={art._id} href={`/oeuvres/${art.slug.current}`} className="group space-y-6">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-white shadow-xl border border-black/5">
                       {art.mainImage ? (
                         <Image
                           src={urlFor(art.mainImage).width(800).url()}
                           alt={art.title}
                           fill
                           className="object-cover transition-transform duration-1000 group-hover:scale-110"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-black/5 italic text-[10px] text-[#737373]">
                           Image non disponible
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-display text-[#0a0a0a] group-hover:text-[#a3a3a3] transition-colors duration-300">{art.title}</h3>
                       <p className="eyebrow text-[#737373] text-[10px] mt-2">{art.location} — {art.year}</p>
                    </div>
                 </Link>
               ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
