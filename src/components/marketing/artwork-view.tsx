'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity/image'
import { Maximize2, ShoppingBag, Ruler, Check, Info } from 'lucide-react'
import RoomPreview from './room-preview'
import { ArtworkWithStock, ArtworkStock, ArtworkSize } from '@/types/artwork'
import { toast } from 'sonner'

interface ArtworkViewProps {
  artwork: ArtworkWithStock
}

import { useCart } from '@/store/use-cart'

export default function ArtworkView({ artwork }: ArtworkViewProps) {
  const [selectedSize, setSelectedSize] = useState<ArtworkSize | null>(artwork.sizes?.[0] || null)
  const [isAdding, setIsAdding] = useState(false)
  const [showRoomPreview, setShowRoomPreview] = useState(false)
  const addItem = useCart((state) => state.addItem)

  const currentStock = artwork.stock?.find((s: ArtworkStock) => s.size_sanity_id === selectedSize?.sizeId)
  const price = currentStock ? (currentStock.price_cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: currentStock.currency }) : '—'
  const isSoldOut = currentStock ? currentStock.remaining === 0 || currentStock.is_sold : false

  const handleAddToCart = () => {
    if (!selectedSize || !currentStock) return

    setIsAdding(true)
    
    addItem({
      artworkId: artwork._id,
      sizeId: selectedSize.sizeId,
      title: artwork.title,
      image: urlFor(artwork.mainImage).width(400).url(),
      sizeLabel: selectedSize.label,
      priceCents: currentStock.price_cents,
      currency: currentStock.currency,
      stockRemaining: currentStock.remaining
    })

    toast.success(`${artwork.title} ajouté au panier`, {
      description: `Format: ${selectedSize.label}`,
    })

    setTimeout(() => setIsAdding(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
      {/* Left Column: Image Display */}
      <div className="lg:col-span-7 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] bg-background-secondary rounded-sm overflow-hidden group shadow-2xl"
        >
          <Image
            src={urlFor(artwork.mainImage).width(1600).url()}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all duration-300">
            <Maximize2 size={20} />
          </button>
        </motion.div>

        {/* Thumbnail gallery if multiple images existed */}
      </div>

      {/* Right Column: Metadata & Purchase */}
      <div className="lg:col-span-5 flex flex-col pt-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="eyebrow text-accent mb-6 flex items-center gap-3">
             <span className="w-8 h-[1px] bg-accent/40" />
             {artwork.type === 'photo' ? 'Photographie' : 'Peinture'}
          </p>
          <h1 className="text-4xl md:text-7xl font-display italic text-white mb-8 leading-tight">
            {artwork.title}
          </h1>
          
          <div className="flex gap-8 eyebrow text-text-muted mb-12 text-sm overflow-x-auto no-scrollbar">
             <div className="flex flex-col min-w-fit">
                <span className="text-white mb-1">Année</span>
                <span>{artwork.year}</span>
             </div>
             <div className="w-px h-8 bg-white/10 shrink-0" />
             <div className="flex flex-col min-w-fit">
                <span className="text-white mb-1">Lieu</span>
                <span>{artwork.location || 'Studio'}</span>
             </div>
             {selectedSize && (
               <>
                <div className="w-px h-8 bg-white/10 shrink-0" />
                <div className="flex flex-col min-w-fit">
                    <span className="text-white mb-1">Dimensions</span>
                    <span>{selectedSize.label}</span>
                </div>
               </>
             )}
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-text-secondary text-lg leading-relaxed italic">
               {artwork.shortDescription || "Une exploration des formes et des ombres née du mouvement intuitif de la main."}
            </p>
          </div>

          {/* Size Selector */}
          {artwork.sizes && artwork.sizes.length > 0 && (
            <div className="mb-12">
              <p className="eyebrow text-white mb-6 flex items-center gap-2">
                <Ruler size={14} className="text-accent" /> Format & Edition
              </p>
              <div className="grid grid-cols-1 gap-4">
                {artwork.sizes.map((size) => (
                  <button
                    key={size.sizeId}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between p-5 border transition-all duration-300 rounded-sm ${
                      selectedSize?.sizeId === size.sizeId
                        ? 'border-accent bg-accent/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                       <span className="text-white font-display italic">{size.label}</span>
                       <span className="text-[10px] eyebrow text-text-muted">Édition Limitée</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xl font-display text-white">
                         {artwork.stock?.find((s: ArtworkStock) => s.size_sanity_id === size.sizeId) 
                           ? (artwork.stock.find((s: ArtworkStock) => s.size_sanity_id === size.sizeId)!.price_cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: artwork.stock.find((s: ArtworkStock) => s.size_sanity_id === size.sizeId)!.currency })
                           : '—'}
                       </span>
                       {selectedSize?.sizeId === size.sizeId && <Check size={18} className="text-accent" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-6">
            <button 
               onClick={handleAddToCart}
               disabled={isAdding || isSoldOut}
               className={`w-full py-6 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-sm relative overflow-hidden ${
                isSoldOut ? 'bg-white/5 text-text-muted cursor-not-allowed' :
                isAdding ? 'bg-success text-white' : 'bg-white text-black hover:bg-accent hover:text-white'
               }`}
            >
              <AnimatePresence mode="wait">
                {isSoldOut ? (
                  <motion.div key="sold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Indisponible</motion.div>
                ) : isAdding ? (
                  <motion.div 
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} /> Ajouté au panier
                  </motion.div>
                ) : (
                  <motion.div 
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={18} /> Ajouter à la collection
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button 
               onClick={() => setShowRoomPreview(true)}
               className="w-full py-6 flex items-center justify-center gap-4 border border-white/10 hover:border-accent hover:text-accent transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm eyebrow group"
            >
              <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Maximize2 size={16} />
              </span>
              Visualiser dans mon intérieur
            </button>
          </div>

          {/* Accordions / Extra Info */}
          <div className="mt-16 pt-12 border-t border-white/5 space-y-8">
             <div className="flex items-start gap-4">
                <Info size={18} className="text-accent mt-1" />
                <div>
                   <p className="text-white font-display italic mb-2">Certificat d'Authenticité</p>
                   <p className="text-text-muted text-sm leading-relaxed">Chaque œuvre est accompagnée d'un certificat signé par Bazan Togola, garantissant son origine et sa valeur.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showRoomPreview && (
          <RoomPreview 
            artwork={artwork} 
            selectedSize={selectedSize} 
            onClose={() => setShowRoomPreview(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
