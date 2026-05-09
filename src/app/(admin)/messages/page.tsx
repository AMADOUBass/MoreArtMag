'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Mail, User, Clock, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      toast.error('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== id))
      toast.success('Message supprimé')
    } catch (error: any) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await (supabase.from('inquiries') as any).update({ status: newStatus }).eq('id', id)
      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m))
      toast.success('Statut mis à jour')
    } catch (error) {
      toast.error('Erreur statut')
    }
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-display italic text-white mb-2">Mes messages</h1>
            <p className="eyebrow text-text-muted">Demandes de contact et projets spéciaux.</p>
         </div>
         <button 
           onClick={fetchMessages}
           className="text-[10px] eyebrow text-accent hover:underline"
         >
           Rafraîchir
         </button>
      </header>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-text-muted eyebrow animate-pulse">Chargement...</div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center text-text-muted eyebrow border border-white/5 rounded-3xl">Aucun message pour le moment.</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <User size={20} strokeWidth={1.5} />
                   </div>
                   <div>
                      <h3 className="text-xl font-display italic text-white">{msg.name}</h3>
                      <div className="flex items-center gap-4 text-[10px] eyebrow text-text-muted mt-1">
                         <span className="flex items-center gap-1 uppercase">{msg.type}</span>
                         <span>• {format(new Date(msg.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <select 
                     value={msg.status}
                     onChange={(e) => updateStatus(msg.id, e.target.value)}
                     className={`text-[9px] eyebrow px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none ${
                       msg.status === 'new' ? 'border-accent/50 text-accent' : ''
                     }`}
                   >
                      <option value="new">Nouveau</option>
                      <option value="in_progress">En cours</option>
                      <option value="replied">Répondu</option>
                      <option value="closed">Fermé</option>
                   </select>

                   <a 
                     href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                     className="p-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all"
                     title="Répondre par email"
                   >
                      <Mail size={16} />
                   </a>

                   <button 
                     onClick={() => deleteMessage(msg.id)}
                     className="p-3 rounded-xl bg-white/5 text-text-muted hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-text-muted eyebrow text-[9px] uppercase tracking-widest">Sujet : {msg.subject}</p>
                 <p className="text-text-secondary leading-relaxed italic text-lg max-w-4xl border-l-2 border-accent/20 pl-6 py-2">
                   "{msg.message}"
                 </p>
                 {msg.type === 'commission' && (
                   <div className="flex gap-8 pt-4">
                      {msg.budget_range && <div><p className="text-[9px] eyebrow text-text-muted">Budget</p><p className="text-white text-sm">{msg.budget_range}</p></div>}
                      {msg.requested_size && <div><p className="text-[9px] eyebrow text-text-muted">Taille</p><p className="text-white text-sm">{msg.requested_size}</p></div>}
                   </div>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
