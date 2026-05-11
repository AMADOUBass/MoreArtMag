'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, MapPin, Calendar, Info, ChevronRight } from 'lucide-react'
import { Artwork } from '@/types/sanity'
import { urlFor } from '@/lib/sanity/image'
import Link from 'next/link'

interface LightboxProps {
  artwork: Artwork
  onClose: () => void
}

export default function Lightbox({ artwork, onClose }: LightboxProps) {
  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const isPlaceholder = artwork._id.startsWith('ph') || artwork._id.startsWith('pa') || artwork._id.startsWith('shop');
  const imgSrc = isPlaceholder 
    ? (artwork._id.startsWith('pa') ? `/images/placeholders/painting_${artwork._id.replace('pa', '')}.png` : `/images/placeholders/photo_${artwork._id.replace('ph', '').replace('shop', '')}.png`)
    : (artwork.mainImage ? urlFor(artwork.mainImage).width(1600).url() : '/images/placeholders/photo_1.png');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f5f5]/98 backdrop-blur-3xl p-4 md:p-12"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 text-black"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Image Display */}
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 relative aspect-[4/5] lg:aspect-auto lg:h-[80vh] bg-white rounded-sm overflow-hidden border border-black/5 shadow-2xl"
        >
          <Image
            src={imgSrc}
            alt={artwork.title}
            fill
            className="object-contain p-4 md:p-8"
            priority
          />
        </motion.div>

        {/* Metadata */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 flex flex-col justify-center"
        >
          <p className="eyebrow text-[#a3a3a3] mb-4">{artwork.type === 'photo' ? 'Photographie' : 'Peinture'}</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl mb-8 font-display text-[#0a0a0a] leading-tight">{artwork.title}</h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4 text-[#737373]">
              <MapPin size={20} className="text-black/20" />
              <p className="text-lg font-display">{artwork.location || 'Studio'}</p>
            </div>
            <div className="flex items-center gap-4 text-[#737373]">
              <Calendar size={20} className="text-black/20" />
              <p className="text-lg font-display">{artwork.year}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href={`/oeuvres/${artwork.slug.current}`}
              className="group flex items-center justify-between p-6 bg-white hover:bg-black/5 border border-black/5 rounded-sm transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#a3a3a3]">
                  <Info size={18} />
                </div>
                <span className="eyebrow text-[#0a0a0a]">Voir les détails</span>
              </div>
              <ChevronRight size={20} className="text-[#a3a3a3] group-hover:text-black transition-colors" />
            </Link>
            
            <button className="h-16 bg-black text-white rounded-sm font-display text-xl transition-all duration-300 shadow-xl hover:bg-[#1a1a1a]">
              {artwork.availableInShop ? 'Acquérir cette œuvre' : 'Sur devis uniquement'}
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
