'use client'

import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { Artwork } from '@/types/sanity'
import { MapPin, Calendar, Maximize2 } from 'lucide-react'

interface ArtworkCardProps {
  artwork: Artwork
  onClick: (artwork: Artwork) => void
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <div 
      className="group relative bg-white rounded-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer border border-black/5"
      onClick={() => onClick(artwork)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e5e5e5]">
        <Image
          src={artwork.mainImage ? urlFor(artwork.mainImage).width(800).url() : '/images/placeholders/photo_1.png'}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 mb-6">
            <Maximize2 size={24} className="text-white" />
          </div>
          <p className="eyebrow text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Aperçu</p>
          <p className="text-white/60 text-xs italic line-clamp-2">{artwork.location}</p>
        </div>
      </div>
      
      <div className="p-6 bg-white border-t border-black/5">
        <h3 className="font-display text-xl text-[#0a0a0a] mb-4 group-hover:text-[#a3a3a3] transition-colors duration-300">{artwork.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-[#737373] eyebrow">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-black/40" /> {artwork.location?.split(',')[0] || 'Studio'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-black/40" /> {artwork.year}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${artwork.availableInShop ? 'bg-green-500/50 animate-pulse' : 'bg-black/10'}`} title={artwork.availableInShop ? 'Disponible' : 'Vendu'} />
        </div>
      </div>
    </div>
  )
}
