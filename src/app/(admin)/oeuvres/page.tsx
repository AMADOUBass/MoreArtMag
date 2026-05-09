'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { client as sanityClient } from '@/lib/sanity/client'
import { Package, Tag, Edit3, Save, X, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminOeuvresPage() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingKey, setEditingKey] = useState<string | null>(null) // artworkId-sizeId
  const [editData, setEditData] = useState<any>({})
  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    try {
      const sanityData = await sanityClient.fetch(`*[_type == "artwork"]{
        _id,
        title,
        type,
        "imageUrl": mainImage.asset->url,
        "slug": slug.current,
        sizes
      }`)

      // 2. Fetch from Supabase
      const { data: supabaseData, error } = await (supabase
        .from('artwork_stock') as any)
        .select('*')

      if (error) throw error

      // 3. Merge
      const merged = sanityData.map((art: any) => {
        const stocks = (art.sizes || []).map((size: any) => {
          const info = (supabaseData as any[]).find(s => s.artwork_sanity_id === art._id && s.size_sanity_id === size.sizeId)
          return {
            ...size,
            price: info ? info.price_cents / 100 : 0,
            remaining: info?.remaining ?? 0,
            is_sold: info?.is_sold ?? false,
          }
        })
        return { ...art, stocks }
      })

      setArtworks(merged)
    } catch (error: any) {
      console.error(error)
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const startEdit = (artId: string, size: any) => {
    setEditingKey(`${artId}-${size.sizeId}`)
    setEditData({ price: size.price, remaining: size.remaining, is_sold: size.is_sold })
  }

  const saveEdit = async (artId: string, sizeId: string) => {
    try {
      const { error } = await (supabase
        .from('artwork_stock') as any)
        .upsert({
          artwork_sanity_id: artId,
          size_sanity_id: sizeId,
          price_cents: Math.round(editData.price * 100),
          remaining: parseInt(editData.remaining),
          is_sold: editData.is_sold,
        }, { onConflict: 'artwork_sanity_id,size_sanity_id' })

      if (error) throw error
      toast.success('Mis à jour')
      setEditingKey(null)
      fetchData()
    } catch (error) {
      toast.error('Erreur de sauvegarde')
    }
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-display italic text-white mb-2">Œuvres & Stocks</h1>
            <p className="eyebrow text-text-muted">Gérez les prix et l'inventaire par format.</p>
         </div>
         <a href="/studio" target="_blank" className="flex items-center gap-2 text-[10px] eyebrow text-accent hover:underline">
           Studio Sanity <ExternalLink size={12} />
         </a>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-text-muted eyebrow animate-pulse">Synchronisation...</div>
        ) : artworks.map((art) => (
          <div key={art._id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden transition-all">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5"
              onClick={() => setExpandedId(expandedId === art._id ? null : art._id)}
            >
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  {art.imageUrl && <Image src={art.imageUrl} alt={art.title} fill className="object-cover" />}
                </div>
                       <h3 className="text-xl font-display italic text-white">{art.title}</h3>
                       <div className="flex items-center gap-3 mt-1">
                          <p className="text-[10px] eyebrow text-text-muted">{art.type} • {art.stocks?.length || 0} formats</p>
                          {art.stocks?.some((s: any) => s.price === 0) && (
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-[8px] eyebrow rounded-full animate-pulse">
                               À configurer
                            </span>
                          )}
                       </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-right hidden md:block">
                    <p className="text-[10px] eyebrow text-text-muted">Prix Min.</p>
                    <p className="text-white font-mono">{Math.min(...(art.stocks?.map((s: any) => s.price) || [0])).toLocaleString()} €</p>
                 </div>
                 {expandedId === art._id ? <ChevronDown size={20} className="text-accent" /> : <ChevronRight size={20} className="text-text-muted" />}
              </div>
            </div>

            {expandedId === art._id && (
              <div className="bg-black/40 border-t border-white/5 p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-5 eyebrow text-[9px] text-text-muted pb-4 border-b border-white/5">
                   <span>Format / Taille</span>
                   <span className="text-center">Prix (€)</span>
                   <span className="text-center">Stock restant</span>
                   <span className="text-center">Statut</span>
                   <span className="text-right">Action</span>
                </div>
                {art.stocks?.length === 0 ? (
                  <p className="text-center py-4 text-text-muted italic text-sm">Aucun format défini dans Sanity pour cette œuvre.</p>
                ) : art.stocks.map((size: any) => {
                  const isEditing = editingKey === `${art._id}-${size.sizeId}`
                  return (
                    <div key={size.sizeId} className="grid grid-cols-5 items-center">
                       <span className="text-white text-sm italic">{size.label} <span className="text-[9px] text-text-muted ml-2">({size.sizeId})</span></span>
                       
                       <div className="flex justify-center">
                         {isEditing ? (
                           <input 
                             type="number" value={editData.price}
                             onChange={(e) => setEditData({...editData, price: e.target.value})}
                             className="bg-white/10 border border-accent/50 rounded-lg px-2 py-1 w-20 text-center text-white"
                           />
                         ) : <span className="text-text-secondary font-mono text-sm">{size.price.toLocaleString()} €</span>}
                       </div>

                       <div className="flex justify-center">
                         {isEditing ? (
                           <input 
                             type="number" value={editData.remaining}
                             onChange={(e) => setEditData({...editData, remaining: e.target.value})}
                             className="bg-white/10 border border-accent/50 rounded-lg px-2 py-1 w-16 text-center text-white"
                           />
                         ) : <span className="text-text-secondary text-sm">{size.remaining} ex.</span>}
                       </div>

                       <div className="flex justify-center">
                          <button 
                            disabled={!isEditing}
                            onClick={() => setEditData({...editData, is_sold: !editData.is_sold})}
                            className={`px-3 py-1 rounded-full text-[8px] eyebrow ${ (isEditing ? editData.is_sold : size.is_sold) ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}
                          >
                             {(isEditing ? editData.is_sold : size.is_sold) ? 'Vendu' : 'En stock'}
                          </button>
                       </div>

                       <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(art._id, size.sizeId)} className="p-2 bg-success/20 text-success rounded-lg"><Save size={14} /></button>
                              <button onClick={() => setEditingKey(null)} className="p-2 bg-white/10 text-text-muted rounded-lg"><X size={14} /></button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(art._id, size)} className="p-2 text-text-muted hover:text-accent transition-colors"><Edit3 size={16} /></button>
                          )}
                       </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
