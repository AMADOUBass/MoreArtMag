import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import GalleryView from '@/components/marketing/gallery-view'

export const revalidate = 60 // Revalidate chaque minute

async function getArtworks(): Promise<Artwork[]> {
  return client.fetch(`
    *[_type == "artwork" && archived != true] | order(year desc) {
      _id,
      title,
      slug,
      type,
      mainImage,
      year,
      location,
      continent,
      availableInShop,
      featured
    }
  `)
}

import { Suspense } from 'react'

export default async function MoreArtPage() {
  const artworks = await getArtworks()

  return (
    <main className="pt-40 pb-20 bg-background-primary">
      <div className="container-custom">
        <header className="max-w-4xl relative">
          <div className="absolute -left-12 -top-12 text-[160px] font-display italic text-white/[0.02] select-none pointer-events-none leading-none">
            Gallery
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent/50" />
            Archive Visuelle
          </p>
          <h1 className="text-7xl md:text-9xl mb-12 leading-[0.85] font-display tracking-tighter">
            L'œuvre au-delà <br/> 
            <span className="italic text-accent ml-12 md:ml-32">du temps.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center mt-16 max-w-2xl ml-auto">
             <div className="w-px h-24 bg-white/10 hidden md:block" />
             <p className="text-text-secondary text-xl md:text-2xl leading-relaxed italic">
              Explorez une collection de fragments capturés entre la matière et l'esprit, classés par médium et origine.
            </p>
          </div>
        </header>
      </div>

      <Suspense fallback={
        <div className="py-40 flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="eyebrow text-text-muted">Chargement de la galerie...</p>
        </div>
      }>
        <GalleryView artworks={artworks} />
      </Suspense>
    </main>
  )
}
