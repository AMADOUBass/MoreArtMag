'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIrisStore } from '@/stores/iris-store'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const UNIVERSES = [
  {
    title: 'Photographies',
    tagline: "L'art de l'instant",
    href: '/photographies',
    image: '/images/beyond-grid/photo.png',
    className: 'col-span-12 md:col-span-7 aspect-[16/10] md:aspect-[16/9] z-10',
    speed: 15,
  },
  {
    title: 'Peintures',
    tagline: 'Matière et lumière',
    href: '/peintures',
    image: '/images/beyond-grid/peinture.png',
    className: 'col-span-12 md:col-span-5 aspect-[4/5] md:mt-24 lg:mt-32 z-20',
    speed: -20,
  },
  {
    title: 'Boutique',
    tagline: 'Art en mouvement',
    href: '/boutique',
    image: '/images/beyond-grid/boutique.png',
    className: 'col-span-12 md:col-span-4 aspect-square md:-mt-16 lg:-mt-24 z-30',
    speed: 25,
  },
  {
    title: 'Le Poète',
    tagline: "L'âme de MoreArt",
    href: '/a-propos',
    image: '/images/beyond-grid/poete.png',
    className: 'col-span-12 md:col-span-8 aspect-[16/8] md:mt-8 lg:mt-16 z-10',
    speed: 10,
  },
]

export default function BeyondGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const traversed = useIrisStore((s) => s.traversed)

  useLayoutEffect(() => {
    if (!traversed || !containerRef.current) return

    const items = itemsRef.current.filter(Boolean)
    
    // Animation d'entrée simple et robuste
    gsap.fromTo(items, 
      { y: 60, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    )

    // Effet Parallaxe
    items.forEach((item, idx) => {
      const img = item?.querySelector('img')
      if (img) {
        gsap.to(img, {
          yPercent: UNIVERSES[idx].speed,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [traversed])

  return (
    <section 
      id="universes" 
      ref={containerRef} 
      className="min-h-screen bg-background-primary py-32 md:py-64 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      
      <div className="container-custom">
        {/* Header simple et élégant */}
        <div className="mb-32 md:mb-48 max-w-3xl">
          <p className="eyebrow mb-6 inline-block border-b border-accent/30 pb-1 text-accent">Exploration</p>
          <h2 className="text-4xl md:text-8xl lg:text-9xl mb-10 leading-[0.9] font-display tracking-tighter">
            L'immersion <br/> 
            <span className="italic text-accent">dans l'invisible.</span>
          </h2>
          <p className="text-text-secondary text-xl md:text-2xl max-w-xl leading-relaxed italic">
            "Chaque fragment raconte une histoire que seul l'œil attentif peut murmurer au cœur."
          </p>
        </div>

        {/* Mosaic Grid - Gaps confortables */}
        <div className="grid grid-cols-12 gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-20 items-start">
          {UNIVERSES.map((uni, idx) => (
            <div 
              key={uni.title}
              ref={el => { itemsRef.current[idx] = el }}
              className={`relative group overflow-hidden bg-background-secondary rounded-sm shadow-2xl shadow-black/80 ${uni.className}`}
            >
              <Link href={uni.href} className="block w-full h-full">
                <div className="relative w-full h-full overflow-hidden aspect-video md:aspect-auto">
                  <Image
                    src={uni.image}
                    alt={uni.title}
                    fill
                    priority={idx < 2}
                    className="object-cover scale-[1.15] transition-transform duration-1000 ease-out group-hover:scale-[1.2]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                </div>

                <div className="absolute inset-0 p-6 md:p-10 lg:p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-accent mb-2 md:mb-4 font-sans font-semibold">
                      {uni.tagline}
                    </p>
                    <h3 className="text-3xl md:text-5xl lg:text-7xl text-white font-display italic leading-[0.8] [text-shadow:0_4px_30px_rgba(0,0,0,0.5)]">
                      {uni.title}
                    </h3>
                  </div>
                  
                  <div className="mt-6 w-0 group-hover:w-full h-[1px] bg-white/30 transition-all duration-700 ease-out" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
