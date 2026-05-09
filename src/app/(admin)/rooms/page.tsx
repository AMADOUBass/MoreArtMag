'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImageIcon, Plus, Trash2, Maximize2, Settings2, Info } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('room_presets')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      toast.error('Erreur de chargement des pièces')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const deleteRoom = async (id: string) => {
    if (!confirm('Supprimer cette pièce ?')) return
    try {
      const { error } = await supabase.from('room_presets').delete().eq('id', id)
      if (error) throw error
      setRooms(rooms.filter(r => r.id !== id))
      toast.success('Pièce supprimée')
    } catch (error) {
      toast.error('Erreur suppression')
    }
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-display italic text-white mb-2">Mes pièces</h1>
            <p className="eyebrow text-text-muted">Gérez les décors pour la visualisation (Room Preview).</p>
         </div>
         <button className="flex items-center gap-3 bg-accent text-white px-6 py-3 rounded-xl eyebrow text-[10px] hover:bg-accent-hover transition-all">
            <Plus size={16} /> Ajouter une pièce
         </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-text-muted eyebrow animate-pulse">Chargement des décors...</div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-muted eyebrow border border-white/5 rounded-[2.5rem]">
             <ImageIcon size={40} className="mx-auto mb-4 opacity-20" />
             <p>Aucune pièce configurée pour le moment.</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all">
              <div className="relative aspect-[4/3] bg-white/5">
                 {room.image_url && <Image src={room.image_url} alt={room.name} fill className="object-cover" />}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                       <Settings2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteRoom(room.id)}
                      className="p-3 bg-error text-white rounded-full hover:scale-110 transition-transform"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
              <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-xl font-display italic text-white">{room.name}</h3>
                       <p className="text-[10px] eyebrow text-text-muted uppercase mt-1">{room.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] eyebrow text-text-muted">
                       Ordre: {room.sort_order}
                    </span>
                 </div>
                 <div className="flex gap-4 pt-4 border-t border-white/5">
                    <div className="flex-1">
                       <p className="text-[9px] eyebrow text-text-muted mb-1">Largeur mur</p>
                       <p className="text-white text-xs">{room.wall_width_cm} cm</p>
                    </div>
                    <div className="flex-1">
                       <p className="text-[9px] eyebrow text-text-muted mb-1">Hauteur mur</p>
                       <p className="text-white text-xs">{room.wall_height_cm} cm</p>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6">
         <Info size={24} className="text-accent" />
         <p className="text-sm italic text-text-secondary">
           Pour un rendu réaliste, assurez-vous que les dimensions du mur correspondent exactement à la réalité de la photo. 
           La zone d'affichage de l'œuvre est calculée selon ces proportions.
         </p>
      </div>
    </div>
  )
}
