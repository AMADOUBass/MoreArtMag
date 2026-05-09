'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Artwork } from '@/types/sanity'
import FilterBar from '@/components/marketing/filter-bar'
import ArtworkCard from '@/components/marketing/artwork-card'
import Lightbox from '@/components/marketing/lightbox'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

interface GalleryViewProps {
  artworks: Artwork[]
}

export default function GalleryView({ artworks }: GalleryViewProps) {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as 'all' | 'photo' | 'peinture') || 'all'
  
  const [activeType, setActiveType] = useState<'all' | 'photo' | 'peinture'>(initialType)
  const [activeContinent, setActiveContinent] = useState('all')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  // Sync state with URL params
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'photo' || type === 'peinture') {
      setActiveType(type)
    } else {
      setActiveType('all')
    }
  }, [searchParams])

  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const typeMatch = activeType === 'all' || art.type === activeType
      const continentMatch = activeContinent === 'all' || art.continent === activeContinent
      return typeMatch && continentMatch
    })
  }, [artworks, activeType, activeContinent])

  return (
    <div className="py-20 min-h-screen">
      <FilterBar 
        activeType={activeType} 
        setActiveType={setActiveType} 
        activeContinent={activeContinent} 
        setActiveContinent={setActiveContinent} 
      />

      <div className="container-custom mt-16">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork) => (
              <motion.div
                key={artwork._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ArtworkCard artwork={artwork} onClick={setSelectedArtwork} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredArtworks.length === 0 && (
          <div className="py-40 text-center">
            <p className="tagline text-xl">Aucune œuvre ne correspond à votre sélection.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <Lightbox 
            artwork={selectedArtwork} 
            onClose={() => setSelectedArtwork(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
