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
      <div className="bg-[#f5f5f5] flex min-h-screen items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-black/5" />
          <div className="absolute inset-0 rounded-full border-2 border-t-black/40 animate-spin" />
        </div>
      </div>
    )

  return (
    <main className="bg-[#f5f5f5] min-h-screen pt-32 md:pt-64 pb-40">
      <div className="container-custom">
        {/* Header Harmonisé */}
        <div className="relative mb-32 max-w-4xl md:mb-56">
          <div className="font-display pointer-events-none absolute -top-12 -left-12 text-[140px] leading-none text-black/[0.03] select-none">
            03
          </div>
          <p className="eyebrow mb-8 flex items-center gap-4 text-[#404040]">
            <span className="bg-black/20 h-[1px] w-12" />
            Acquisition & Collection
          </p>
          <h1 className="font-display mb-12 text-6xl leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl text-[#0a0a0a]">
            Posséder un <br />
            <span className="text-[#a3a3a3] ml-12 md:ml-24">
              fragment d'âme.
            </span>
          </h1>
          <div className="ml-auto flex flex-col items-start gap-12 md:max-w-2xl md:flex-row md:items-center">
            <div className="hidden h-24 w-px bg-black/10 md:block" />
            <p className="text-[#737373] text-xl leading-relaxed md:text-2xl">
              "L'art ne doit pas seulement être contemplé, il doit être vécu au
              quotidien, trouvant sa place dans l'intimité de votre espace."
            </p>
          </div>
        </div>

        {/* Info barre boutique Centrée */}
        <div className="eyebrow text-[#737373] mb-32 flex flex-wrap justify-center gap-12 border-b border-black/5 pb-16 md:gap-24">
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-[#0a0a0a]">
              Livraison
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Monde Entier
            </span>
          </div>
          <div className="hidden h-10 w-px bg-black/10 sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-[#0a0a0a]">
              Certificat
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Authenticité Garantie
            </span>
          </div>
          <div className="hidden h-10 w-px bg-black/10 sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-[#0a0a0a]">
              Support
            </span>
            <span className="mt-1 text-[10px] tracking-widest uppercase">
              Fine Art & Toile
            </span>
          </div>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
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
                <Link href={itemLink} className="relative mb-8 aspect-[3/4] overflow-hidden rounded-sm bg-[#e5e5e5] shadow-[0_20px_60px_rgba(0,0,0,0.05)] cursor-pointer">
                  <Image
                    src={imgSrc}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="hover:bg-white flex h-11 w-11 md:h-14 md:w-14 scale-90 transform items-center justify-center rounded-full bg-black/20 text-white transition-all duration-500 group-hover:scale-100 hover:text-black cursor-pointer backdrop-blur-md border border-white/20">
                      <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex h-11 w-11 md:h-14 md:w-14 scale-90 transform items-center justify-center rounded-full bg-white text-black transition-all duration-500 group-hover:scale-100 hover:bg-black hover:text-white cursor-pointer">
                      <Eye className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col text-left">
                  <div className="mb-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <Link href={itemLink} className="flex-1">
                        <h3 className="font-display group-hover:text-[#a3a3a3] text-2xl text-[#0a0a0a] transition-colors leading-tight">
                          {art.title}
                        </h3>
                      </Link>
                      <div className="text-right">
                        <p className="font-display text-xl text-[#0a0a0a] whitespace-nowrap">
                          {art.type === 'photo' ? '450 $' : 'Sur demande'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start pt-4 border-t border-black/5">
                      <p className="eyebrow text-[#737373] text-[9px] uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                        {art.type === 'photo'
                          ? 'Tirage Limité / Fine Art'
                          : 'Œuvre Originale / Technique Mixte'}
                      </p>
                      <div className="flex flex-col items-end">
                        <p className="eyebrow text-[#4a7c44] text-[8px] tracking-[0.2em] uppercase">
                          Disponible
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <span className="eyebrow rounded-full border border-black/5 bg-black/5 px-3 py-1 text-[8px] text-[#737373]">
                      Formats Variés
                    </span>
                    <span className="eyebrow rounded-full border border-black/5 bg-black/5 px-3 py-1 text-[8px] text-[#737373]">
                      Expédition Monde
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
