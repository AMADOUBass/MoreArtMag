'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity/image'
import { Maximize2, ShoppingBag, Ruler, Check, Info } from 'lucide-react'
import RoomPreview from './room-preview'
import { ArtworkWithStock, ArtworkStock, ArtworkSize } from '@/types/artwork'
import { toast } from 'sonner'
import Lightbox from './lightbox'
import Button from '@/components/ui/button'

interface ArtworkViewProps {
  artwork: ArtworkWithStock
}

import { useCart } from '@/store/use-cart'

export default function ArtworkView({ artwork }: ArtworkViewProps) {
  const [selectedSize, setSelectedSize] = useState<ArtworkSize | null>(
    artwork.sizes?.[0] || {
      sizeId: 'default',
      label: '80 x 100 cm',
      widthCm: 80,
      heightCm: 100,
    }
  )
  const [isAdding, setIsAdding] = useState(false)
  const [showRoomPreview, setShowRoomPreview] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [mounted, setMounted] = useState(false)
  const addItem = useCart((state) => state.addItem)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Fallback stock for seed testing
  const stockFromDb = artwork.stock?.find(
    (s: ArtworkStock) => s.size_sanity_id === selectedSize?.sizeId
  )
  const currentStock = stockFromDb || {
    price_cents: 25000,
    currency: 'CAD',
    remaining: 5,
    is_sold: false,
  }
  const price = currentStock
    ? (currentStock.price_cents / 100).toLocaleString('fr-CA', {
        style: 'currency',
        currency: currentStock.currency,
      })
    : '—'
  const isSoldOut = currentStock
    ? currentStock.remaining === 0 || currentStock.is_sold
    : false

  const handleAddToCart = () => {
    if (!selectedSize || !currentStock) return

    setIsAdding(true)

    const imageUrl = artwork.mainImage
      ? urlFor(artwork.mainImage).width(400).url()
      : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop'

    addItem({
      artworkId: artwork._id,
      sizeId: selectedSize.sizeId,
      title: artwork.title,
      image: imageUrl,
      sizeLabel: selectedSize.label,
      priceCents: currentStock.price_cents,
      currency: currentStock.currency,
      stockRemaining: currentStock.remaining,
    })

    toast.success(`${artwork.title} ajouté au panier`, {
      description: `Format: ${selectedSize.label}`,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
      {/* Left Column: Image Display */}
      <div className="space-y-8 lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-background-secondary group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-sm shadow-2xl"
          onClick={() => setShowLightbox(true)}
        >
          {artwork.mainImage ? (
            <Image
              src={urlFor(artwork.mainImage).width(1600).url()}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1600&auto=format&fit=crop"
              alt="Fallback Art"
              fill
              className="object-cover opacity-60"
              priority
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowLightbox(true)
            }}
            className="hover:bg-accent hover:border-accent absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all duration-300"
          >
            <Maximize2 size={20} />
          </button>
        </motion.div>

        {/* Thumbnail gallery if multiple images existed */}
      </div>

      {/* Right Column: Metadata & Purchase */}
      <div className="flex flex-col pt-4 lg:col-span-5">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="eyebrow text-accent mb-6 flex items-center gap-3">
            <span className="bg-accent/40 h-[1px] w-8" />
            {artwork.type === 'photo' ? 'Photographie' : 'Peinture'}
          </p>
          <h1 className="font-display mb-8 text-4xl leading-tight text-white italic md:text-7xl">
            {artwork.title}
          </h1>

          <div className="eyebrow text-text-muted mb-12 flex items-center gap-6 text-[10px] md:gap-8 md:text-sm">
            <div className="flex min-w-fit flex-col">
              <span className="mb-1 text-white">Année</span>
              <span>{artwork.year}</span>
            </div>
            <div className="h-8 w-px shrink-0 bg-white/10" />
            <div className="flex min-w-fit flex-col">
              <span className="mb-1 text-white">Lieu</span>
              <span>{artwork.location || 'Studio'}</span>
            </div>
            {selectedSize && (
              <>
                <div className="h-8 w-px shrink-0 bg-white/10" />
                <div className="flex min-w-fit flex-col">
                  <span className="mb-1 text-white">Dimensions</span>
                  <span>{selectedSize.label}</span>
                </div>
              </>
            )}
          </div>

          <div className="prose prose-invert mb-12 max-w-none">
            <p className="text-text-secondary text-lg leading-relaxed italic">
              {artwork.shortDescription ||
                'Une exploration des formes et des ombres née du mouvement intuitif de la main.'}
            </p>
          </div>

          {/* Size Selector */}
          {artwork.sizes && artwork.sizes.length > 0 && (
            <div className="mb-12">
              <p className="eyebrow mb-6 flex items-center gap-2 text-white">
                <Ruler size={14} className="text-accent" /> Format & Edition
              </p>
              <div className="grid grid-cols-1 gap-4">
                {artwork.sizes.map((size) => (
                  <button
                    key={size.sizeId}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between rounded-sm border p-5 transition-all duration-300 ${
                      selectedSize?.sizeId === size.sizeId
                        ? 'border-accent bg-accent/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-display text-white italic">
                        {size.label}
                      </span>
                      <span className="eyebrow text-text-muted text-[10px]">
                        Édition Limitée
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl text-white">
                        {(() => {
                          const s = artwork.stock?.find(
                            (st) => st.size_sanity_id === size.sizeId
                          )
                          return s
                            ? (s.price_cents / 100).toLocaleString('fr-CA', {
                                style: 'currency',
                                currency: s.currency,
                              })
                            : '—'
                        })()}
                      </span>
                      {selectedSize?.sizeId === size.sizeId && (
                        <Check size={18} className="text-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-6">
            <Button
              onClick={handleAddToCart}
              loading={isAdding}
              disabled={isSoldOut || !currentStock}
              size="xl"
              className="w-full"
              icon={
                isSoldOut || !currentStock ? null : <ShoppingBag size={18} />
              }
            >
              {isSoldOut
                ? 'Indisponible'
                : !currentStock
                  ? 'Prix non configuré'
                  : 'Ajouter à la collection'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowRoomPreview(true)}
              size="xl"
              className="w-full"
              icon={<Maximize2 size={16} />}
            >
              Visualiser dans mon intérieur
            </Button>
          </div>

          {/* Accordions / Extra Info */}
          <div className="mt-16 space-y-8 border-t border-white/5 pt-12">
            <div className="flex items-start gap-4">
              <Info size={18} className="text-accent mt-1" />
              <div>
                <p className="font-display mb-2 text-white italic">
                  Certificat d'Authenticité
                </p>
                <p className="text-text-muted text-sm leading-relaxed">
                  Chaque œuvre est accompagnée d'un certificat signé par Bazan
                  Togola, garantissant son origine et sa valeur.
                </p>
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
            onSizeChange={setSelectedSize}
          />
        )}
        {showLightbox && (
          <Lightbox artwork={artwork} onClose={() => setShowLightbox(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
