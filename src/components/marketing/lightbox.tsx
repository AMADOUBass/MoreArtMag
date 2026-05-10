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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background-primary/98 backdrop-blur-3xl p-4 md:p-12"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-500"
      >
        <X size={24} className="text-white" />
      </button>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Image Display */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 relative aspect-[4/5] lg:aspect-auto lg:h-[85vh] bg-black/40 rounded-sm overflow-hidden ring-1 ring-white/5 shadow-2xl"
        >
          <Image
            src={imgSrc}
            alt={artwork.title}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Metadata */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 flex flex-col justify-center"
        >
          <p className="eyebrow text-accent mb-4">{artwork.type === 'photo' ? 'Photographie' : 'Peinture'}</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight">{artwork.title}</h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4 text-text-secondary">
              <MapPin size={20} className="text-accent" />
              <p className="text-lg italic font-display">{artwork.location || 'Studio'}</p>
            </div>
            <div className="flex items-center gap-4 text-text-secondary">
              <Calendar size={20} className="text-accent" />
              <p className="text-lg italic font-display">{artwork.year}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href={`/oeuvres/${artwork.slug.current}`}
              className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Info size={18} />
                </div>
                <span className="eyebrow text-white">Voir les détails</span>
              </div>
              <ChevronRight size={20} className="text-text-muted group-hover:text-white transition-colors" />
            </Link>
            
            <button className="px-10 py-5 bg-accent hover:bg-accent-hover text-white rounded-sm font-sans font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-accent/20">
              {artwork.availableInShop ? 'Acquérir cette œuvre' : 'Sur devis uniquement'}
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
