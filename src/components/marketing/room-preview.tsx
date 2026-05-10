'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { urlFor } from '@/lib/sanity/image'

import { ArtworkWithStock, ArtworkSize } from '@/types/artwork'

type RoomPreset = Database['public']['Tables']['room_presets']['Row']

interface RoomPreviewProps {
  artwork: ArtworkWithStock
  selectedSize: ArtworkSize | null
  onClose: () => void
}

export default function RoomPreview({ artwork, selectedSize, onClose }: RoomPreviewProps) {
  const [rooms, setRooms] = useState<RoomPreset[]>([])
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRooms() {
      const { data } = await supabase.from('room_presets').select('*').order('sort_order', { ascending: true })
      if (data) setRooms(data)
      setLoading(false)
    }
    fetchRooms()
  }, [])

  const activeRoom = rooms[activeRoomIndex]

  // Logic to calculate artwork position and scale on the wall
  const artworkStyle = useMemo(() => {
    if (!activeRoom || !selectedSize) return {}

    // wall_polygon: { p1: {x,y}, p2: {x,y}, p3: {x,y}, p4: {x,y} }
    // For now, we simplify: use the center of the polygon and scale based on cm
    const poly = activeRoom.wall_polygon as any
    if (!poly || !poly.p1) return { display: 'none' }

    // Average points for center
    const centerX = (poly.p1.x + poly.p2.x + poly.p3.x + poly.p4.x) / 4
    const centerY = (poly.p1.y + poly.p2.y + poly.p3.y + poly.p4.y) / 4

    // Scale calculation:
    // Real wall width / Height -> pixels/cm
    const pixelsPerCm = 100 / activeRoom.wall_width_cm // (Assuming normalized 100% width)
    
    // We want the artwork to be X cm wide
    const artworkWidthNormalized = (selectedSize.widthCm * pixelsPerCm)
    const artworkHeightNormalized = (selectedSize.heightCm * pixelsPerCm)

    return {
      left: `${centerX * 100}%`,
      top: `${centerY * 100}%`,
      width: `${artworkWidthNormalized}%`,
      height: 'auto',
      aspectRatio: `${selectedSize.widthCm} / ${selectedSize.heightCm}`,
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    }
  }, [activeRoom, selectedSize])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background-primary/98 backdrop-blur-xl flex flex-col"
    >
      <div className="flex justify-between items-center p-8 border-b border-white/5">
        <div>
           <h3 className="text-2xl font-display italic text-white">Visualisation dans l'espace</h3>
           <p className="eyebrow text-[10px] text-text-muted mt-1">{artwork.title} — {selectedSize?.label}</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
        {loading ? (
          <Loader2 className="animate-spin text-accent" size={48} />
        ) : activeRoom ? (
          <div className="relative w-full max-w-6xl aspect-[16/9] shadow-2xl rounded-sm overflow-hidden bg-black/40">
             <Image 
                src={activeRoom.image_url} 
                alt={activeRoom.name} 
                fill 
                className="object-cover"
                priority
             />
             
             {/* Artwork Overlay */}
             <motion.div 
               layoutId="artwork-preview"
               style={artworkStyle}
               className="absolute z-10 border-[1px] border-black/10 ring-1 ring-white/10"
             >
                <Image 
                  src={artwork.mainImage ? urlFor(artwork.mainImage).width(1200).url() : ''} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
                {/* Subtle Shadow cast by the artwork */}
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] pointer-events-none" />
             </motion.div>

             <div className="absolute bottom-8 left-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-xs eyebrow text-white">
                {activeRoom.name} — Mur de {activeRoom.wall_width_cm}cm
             </div>
          </div>
        ) : (
          <p className="text-white eyebrow">Aucune pièce disponible pour la prévisualisation.</p>
        )}

        {/* Room Navigation */}
        {!loading && rooms.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/20 backdrop-blur-xl p-4 rounded-full border border-white/5">
            <button 
              onClick={() => setActiveRoomIndex(prev => (prev === 0 ? rooms.length - 1 : prev - 1))}
              className="p-2 text-white hover:text-accent transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-3">
              {rooms.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveRoomIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${activeRoomIndex === i ? 'bg-accent w-6' : 'bg-white/20'}`} 
                />
              ))}
            </div>
            <button 
              onClick={() => setActiveRoomIndex(prev => (prev === rooms.length - 1 ? 0 : prev + 1))}
              className="p-2 text-white hover:text-accent transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-8 border-t border-white/5 bg-background-secondary/50 text-center">
         <p className="text-text-muted text-[10px] eyebrow max-w-2xl mx-auto leading-relaxed">
            Note : Cette visualisation est une simulation à titre indicatif. Les proportions sont calculées sur la base des dimensions réelles fournies par l'artiste et de la calibration du mur de l'atelier.
         </p>
      </div>
    </motion.div>
  )
}
