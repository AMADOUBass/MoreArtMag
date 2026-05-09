'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const SAMPLE_WORKS = [
  { id: 1, url: '/images/placeholders/photo_1.png', title: 'Silence du Sahel', category: 'Photographie' },
  { id: 2, url: '/images/placeholders/painting_1.png', title: 'Mouvement Interne', category: 'Peinture' },
  { id: 3, url: '/images/placeholders/photo_2.png', title: 'Ombres Portées', category: 'Photographie' },
  { id: 4, url: '/images/placeholders/painting_2.png', title: 'Genèse', category: 'Peinture' },
  { id: 5, url: '/images/placeholders/photo_3.png', title: 'Sédimentation Tactile', category: 'Photographie' },
]

export default function PortfolioCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (scrollRef.current) {
      setWidth(scrollRef.current.scrollWidth - scrollRef.current.offsetWidth)
    }
  }, [])

  return (
    <div className="py-20 overflow-hidden bg-background-primary">
      <div className="container-custom mb-12 flex justify-between items-end">
         <div>
            <p className="eyebrow text-accent mb-4">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-display italic text-white">Sélection <span className="text-text-muted">Éditoriale</span></h2>
         </div>
         <p className="hidden md:block eyebrow text-[10px] text-text-muted">Glisser pour explorer →</p>
      </div>

      <motion.div 
        ref={scrollRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <motion.div 
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: 'grabbing' }}
          className="flex gap-8 px-[10vw]"
        >
          {SAMPLE_WORKS.map((work) => (
            <motion.div
              key={work.id}
              className="relative flex-shrink-0 w-[300px] md:w-[500px] aspect-[4/5] group"
            >
              <div className="absolute inset-0 bg-background-secondary rounded-sm overflow-hidden shadow-2xl">
                 <Image 
                    src={work.url} 
                    alt={work.title} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                 <div className="absolute bottom-10 left-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="eyebrow text-[10px] text-accent mb-2">{work.category}</p>
                    <h3 className="text-3xl font-display italic text-white">{work.title}</h3>
                 </div>
              </div>
            </motion.div>
          ))}
          
          {/* Final CTA */}
          <div className="flex-shrink-0 w-[300px] md:w-[500px] aspect-[4/5] border border-white/5 flex flex-col items-center justify-center rounded-sm group cursor-pointer hover:border-accent transition-all duration-500 bg-white/2">
             <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-500 mb-6">
                <span className="text-accent text-2xl">→</span>
             </div>
             <p className="eyebrow text-text-muted group-hover:text-accent transition-colors">Explorer les Galeries</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
