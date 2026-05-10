'use client'

import React, { useState, useEffect } from 'react'
import { client } from '@/lib/sanity/client'
import { Artwork } from '@/types/sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'
import { ShoppingBag, Eye } from 'lucide-react'

async function getShopArtworks(): Promise<Artwork[]> {
  let sanityArtworks: Artwork[] = []
  try {
    sanityArtworks = await client.fetch(`
      *[_type == "artwork" && availableInShop == true && archived != true] | order(year desc) {
        _id, title, slug, type, mainImage, year, location, availableInShop, featured
      }
    `)
  } catch (e) {
    console.error('Sanity fetch error')
  }

  const fallbacks = [
    {
      _id: 'shop-fallback-1',
      title: 'Silence du Sahel',
      slug: { current: 'silence-du-sahel' },
      type: 'photo',
      mainImage: null,
      availableInShop: true,
      featured: true,
    } as any,
    {
      _id: 'shop-fallback-2',
      title: 'Genèse Tactile I',
      slug: { current: 'genese-tactile-1' },
      type: 'peinture',
      mainImage: null,
      availableInShop: true,
      featured: false,
    } as any,
    {
      _id: 'shop-fallback-3',
      title: "L'Ombre Portée",
      slug: { current: 'ombre-portee' },
      type: 'photo',
      mainImage: null,
      availableInShop: true,
      featured: false,
    } as any,
    {
      _id: 'shop-fallback-4',
      title: 'Désert de Cristal',
      slug: { current: 'desert-de-cristal' },
      type: 'photo',
      mainImage: null,
      availableInShop: true,
      featured: true,
    } as any,
    {
      _id: 'shop-fallback-5',
      title: 'Résonance Ocre',
      slug: { current: 'resonance-ocre' },
      type: 'peinture',
      mainImage: null,
      availableInShop: true,
      featured: false,
    } as any,
    {
      _id: 'shop-fallback-6',
      title: 'Symphonie Bleue',
      slug: { current: 'symphonie-bleue' },
      type: 'photo',
      mainImage: null,
      availableInShop: true,
      featured: false,
    } as any,
  ]

  const combined = [...(sanityArtworks || []), ...fallbacks]
  return combined.slice(0, 6)
}

export default function BoutiquePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShopArtworks().then((data) => {
      setArtworks(data)
      setLoading(false)
    })
  }, [])

  if (loading)
    return (
      <div className="bg-background-primary flex min-h-screen items-center justify-center">
        <div className="border-accent h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )

  return (
    <main className="bg-background-primary min-h-screen pt-40 pb-40">
      <div className="container-custom">
        {/* Header Harmonisé */}
        <div className="relative mb-32 max-w-4xl md:mb-56">
          <div className="font-display pointer-events-none absolute -top-12 -left-12 text-[140px] leading-none text-white/[0.03] italic select-none">
            03
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="bg-accent/50 h-[1px] w-12" />
            Acquisition & Collection
          </p>
          <h1 className="font-display mb-12 text-6xl leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl">
            Posséder un <br />
            <span className="text-accent ml-12 italic md:ml-24">
              fragment d'âme.
            </span>
          </h1>
          <div className="ml-auto flex flex-col items-start gap-12 md:max-w-2xl md:flex-row md:items-center">
            <div className="hidden h-24 w-px bg-white/10 md:block" />
            <p className="text-text-secondary text-xl leading-relaxed italic md:text-2xl">
              "L'art ne doit pas seulement être contemplé, il doit être vécu au
              quotidien, trouvant sa place dans l'intimité de votre espace."
            </p>
          </div>
        </div>

        {/* Info barre boutique Centrée */}
        <div className="eyebrow text-text-muted mb-32 flex flex-wrap justify-center gap-12 border-b border-white/5 pb-16 md:gap-24">
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-white italic">
              Livraison
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Monde Entier
            </span>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-white italic">
              Certificat
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Authenticité Garantie
            </span>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-white italic">
              Support
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Fine Art & Toile
            </span>
          </div>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-32 md:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art, index) => {
            let imgSrc = '/images/placeholders/photo_1.png'
            if (art.mainImage) {
              imgSrc = urlFor(art.mainImage).width(1000).url()
            } else {
              const fallbacks = [
                '/images/placeholders/photo_1.png',
                '/images/placeholders/painting_1.png',
                '/images/placeholders/photo_2.png',
                '/images/placeholders/photo_4.png',
                '/images/placeholders/painting_1.png',
                '/images/placeholders/photo_5.png'
              ]
              imgSrc = fallbacks[index % fallbacks.length]
            }

            const itemLink = `/oeuvres/${art.slug?.current || '#'}`

            return (
              <div key={art._id + index} className="group flex h-full flex-col">
                <Link href={itemLink} className="bg-background-secondary relative mb-8 aspect-[3/4] overflow-hidden rounded-sm shadow-2xl cursor-pointer">
                  <Image
                    src={imgSrc}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="hover:bg-accent flex h-11 w-11 md:h-14 md:w-14 scale-90 transform items-center justify-center rounded-full bg-white text-black transition-all duration-500 group-hover:scale-100 hover:text-white cursor-pointer">
                      <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex h-11 w-11 md:h-14 md:w-14 scale-90 transform items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-100 hover:bg-white hover:text-black cursor-pointer">
                      <Eye className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="mb-8 flex min-h-[80px] items-start justify-between">
                    <div className="flex-1 pr-4 text-left">
                      <Link href={itemLink} className="cursor-pointer">
                        <h3 className="font-display group-hover:text-accent mb-2 line-clamp-2 text-2xl text-white italic transition-colors">
                          {art.title}
                        </h3>
                      </Link>
                      <p className="eyebrow text-text-muted text-[10px]">
                        {art.type === 'photo'
                          ? 'Tirage Limité / Fine Art'
                          : 'Œuvre Originale / Technique Mixte'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-display text-xl text-white italic">
                        {art.type === 'photo'
                          ? 'À partir de 450€'
                          : 'Prix sur demande'}
                      </p>
                      <p className="eyebrow text-success mt-1 text-[9px] tracking-[0.2em] uppercase">
                        Disponible
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-4 border-t border-white/5 pt-6">
                    <span className="eyebrow rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[9px]">
                      Plusieurs Formats
                    </span>
                    <span className="eyebrow rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[9px]">
                      Expédition Sécurisée
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
