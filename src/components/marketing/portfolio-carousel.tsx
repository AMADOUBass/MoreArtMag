'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const SAMPLE_WORKS = [
  { id: 1, url: '/images/gallery/photo1.png', title: 'Silence du Sahel', category: 'Photographie' },
  { id: 2, url: '/images/gallery/peinture1.png', title: 'Mouvement Interne', category: 'Peinture' },
  { id: 3, url: '/images/gallery/photo2.png', title: 'Ombres Portées', category: 'Photographie' },
  { id: 4, url: '/images/gallery/peinture2.png', title: 'Genèse', category: 'Peinture' },
]

export default function PortfolioCarousel() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({
    container: targetRef,
  })

  return (
    <div className="py-20 overflow-hidden">
      <div className="container-custom mb-12">
         <p className="eyebrow text-accent mb-4">Portfolio</p>
         <h2 className="text-4xl font-display italic text-white">Sélection <span className="text-text-muted">Éditoriale</span></h2>
      </div>

      <div 
        ref={targetRef}
        className="flex gap-8 px-[10vw] overflow-x-auto no-scrollbar pb-20 snap-x"
      >
        {SAMPLE_WORKS.map((work, idx) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex-shrink-0 w-[300px] md:w-[450px] aspect-[3/4] group snap-center"
          >
            <div className="absolute inset-0 bg-background-secondary rounded-sm overflow-hidden">
               <Image 
                  src={work.url} 
                  alt={work.title} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
               <div className="absolute bottom-8 left-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="eyebrow text-[10px] text-accent mb-2">{work.category}</p>
                  <h3 className="text-2xl font-display italic text-white">{work.title}</h3>
               </div>
            </div>
          </motion.div>
        ))}
        
        {/* Placeholder for "Voir Plus" */}
        <div className="flex-shrink-0 w-[300px] md:w-[450px] aspect-[3/4] border border-white/5 flex items-center justify-center rounded-sm group cursor-pointer hover:border-accent transition-colors">
           <p className="eyebrow text-text-muted group-hover:text-accent transition-colors">Découvrir la suite →</p>
        </div>
      </div>
    </div>
  )
}
