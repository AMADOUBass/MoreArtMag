'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { urlFor } from '@/lib/sanity/image'
import { ArtworkWithStock, ArtworkSize } from '@/types/artwork'

type RoomPreset = Database['public']['Tables']['room_presets']['Row']

interface RoomPreviewProps {
  artwork: ArtworkWithStock
  selectedSize: ArtworkSize | null
  onClose: () => void
  onSizeChange: (size: ArtworkSize) => void
}

export default function RoomPreview({ artwork, selectedSize, onClose, onSizeChange }: RoomPreviewProps) {
  const [rooms, setRooms] = useState<RoomPreset[]>([])
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const wallRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    async function fetchRooms() {
      const { data } = await supabase.from('room_presets').select('*').order('sort_order', { ascending: true })
      if (data && data.length > 0) {
        setRooms(data)
      } else {
        setRooms([
          {
            id: 'fallback-1',
            name: 'Galerie Minimale',
            image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop',
            wall_polygon: { p1: [50, 40] },
            wall_width_cm: 500,
            sort_order: 0,
            created_at: '',
            updated_at: ''
          },
          {
            id: 'fallback-2',
            name: 'Salon Haussmannien',
            image_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2000&auto=format&fit=crop',
            wall_polygon: { p1: [50, 38] },
            wall_width_cm: 600,
            sort_order: 1,
            created_at: '',
            updated_at: ''
          },
          {
            id: 'fallback-3',
            name: 'Loft Industriel',
            image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop',
            wall_polygon: { p1: [45, 35] },
            wall_width_cm: 550,
            sort_order: 2,
            created_at: '',
            updated_at: ''
          },
          {
            id: 'fallback-4',
            name: 'Chambre Design',
            image_url: 'https://images.unsplash.com/photo-1617331140180-e8262094733a?q=80&w=2000&auto=format&fit=crop',
            wall_polygon: { p1: [50, 35] },
            wall_width_cm: 450,
            sort_order: 3,
            created_at: '',
            updated_at: ''
          }
        ] as any)
      }
      setLoading(false)
    }
    fetchRooms()
  }, [])

  // Fallback sizes if Sanity data is empty
  const availableSizes = artwork.sizes && artwork.sizes.length > 0 
    ? artwork.sizes 
    : [
        { sizeId: 's', label: '40 x 60 cm', widthCm: 40, heightCm: 60 },
        { sizeId: 'm', label: '60 x 80 cm', widthCm: 60, heightCm: 80 },
        { sizeId: 'default', label: '80 x 100 cm', widthCm: 80, heightCm: 100 },
        { sizeId: 'xl', label: '100 x 120 cm', widthCm: 100, heightCm: 120 }
      ]

  const activeRoom = rooms[activeRoomIndex]

  const artworkStyle = useMemo(() => {
    if (!mounted || !activeRoom || !selectedSize || !wallRef.current) return { display: 'none' }

    const wallWidthPx = wallRef.current.offsetWidth
    const poly = activeRoom.wall_polygon as any
    if (!poly || !poly.p1) return { display: 'none' }

    const pixelsPerCm = wallWidthPx / (activeRoom.wall_width_cm || 500)
    
    const widthPx = (selectedSize.widthCm || 80) * pixelsPerCm
    const heightPx = (selectedSize.heightCm || 100) * pixelsPerCm

    return {
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      left: `${poly.p1[0]}%`,
      top: `${poly.p1[1]}%`,
      transform: 'translate(-50%, -50%) perspective(1000px) rotateY(-1deg)',
      boxShadow: '20px 40px 80px rgba(0,0,0,0.4), 0 0 15px rgba(0,0,0,0.1)',
      transition: 'width 0.5s ease-out, height 0.5s ease-out'
    }
  }, [activeRoom, selectedSize, mounted, rooms])

  if (!mounted) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#f5f5f5]/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 overflow-hidden"
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-[110] w-12 h-12 rounded-full border border-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-500 text-black"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-6xl aspect-video rounded-sm overflow-hidden shadow-2xl bg-white border border-black/5">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeRoom?.id || 'loading'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
              ref={wallRef}
            >
              {activeRoom && (
                <Image 
                  src={activeRoom.image_url} 
                  alt={activeRoom.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              
              {/* The Artwork Projection */}
              {activeRoom && (
                <motion.div 
                  layoutId="artwork-preview"
                  drag
                  dragConstraints={wallRef}
                  dragElastic={0.4}
                  dragMomentum={true}
                  style={artworkStyle}
                  className="absolute z-10 border-[1px] border-black/20 ring-1 ring-white/10 overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
                >
                  {artwork.mainImage ? (
                    <Image 
                      src={urlFor(artwork.mainImage).width(1200).url()} 
                      alt="Preview" 
                      fill 
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  ) : (
                    <Image 
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop" 
                      alt="Fallback Preview" 
                      fill 
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  )}
                  {/* High-end lighting effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] pointer-events-none" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD / Controls */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
          <div className="flex flex-col gap-4 items-start">
            <div className="px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <p className="text-[10px] eyebrow text-white flex items-center gap-3">
                <span className="text-accent font-bold uppercase">{activeRoom?.name || 'Chargement...'}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-white/70">MUR DE {activeRoom?.wall_width_cm || 400} CM</span>
              </p>
            </div>
            
            {/* Size Selector */}
            <div className="flex gap-2 p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 overflow-hidden">
              {availableSizes.map((size) => (
                <button
                  key={size.sizeId}
                  onClick={() => onSizeChange(size)}
                  className={`px-4 py-2 text-[10px] eyebrow rounded-full transition-all ${selectedSize?.sizeId === size.sizeId ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {!loading && rooms.length > 1 && (
            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10">
              <button 
                onClick={() => setActiveRoomIndex(prev => (prev > 0 ? prev - 1 : rooms.length - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:text-accent transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {rooms.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === activeRoomIndex ? 'bg-accent w-4' : 'bg-white/20'}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setActiveRoomIndex(prev => (prev < rooms.length - 1 ? prev + 1 : 0))}
                className="w-10 h-10 flex items-center justify-center text-white hover:text-accent transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] eyebrow text-white/40 text-center hidden md:block">
        NOTE : CETTE VISUALISATION EST UNE SIMULATION À TITRE INDICATIF. LES PROPORTIONS SONT ESTIMÉES.
      </div>
    </motion.div>
  )
}
