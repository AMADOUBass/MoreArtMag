'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageSquare, ShoppingCart, Eye, TrendingUp, Image as ImageIcon, ExternalLink, AlertTriangle, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    messages: 0,
    lowStock: 0
  })
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      // Pour l'instant on simule une partie mais on prépare les requêtes
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
      const { count: msgCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')
      const { count: lowStockCount } = await supabase.from('artwork_stock').select('*', { count: 'exact', head: true }).lt('remaining', 3)
      
      setStats({
        orders: orderCount || 12,
        revenue: 4580,
        messages: msgCount || 3,
        lowStock: lowStockCount || 1
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-16">
      <header>
         <h1 className="text-5xl font-display italic text-white mb-4 tracking-tighter">Bonjour, Bazan.</h1>
         <p className="eyebrow text-text-muted text-xs">Voici l'état de votre galerie sur les 30 derniers jours.</p>
      </header>

      {/* Zone HUB - Gros boutons prioritaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <a 
           href="/studio" 
           target="_blank"
           className="group relative bg-accent p-8 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
         >
            <div className="relative z-10">
               <ImageIcon size={32} className="text-white mb-6" />
               <h3 className="text-2xl font-display italic text-white mb-2">Gérer mes œuvres</h3>
               <p className="text-white/70 text-[10px] eyebrow uppercase tracking-widest flex items-center gap-2">
                 Ouvrir le Studio <ExternalLink size={12} />
               </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <ImageIcon size={160} />
            </div>
         </a>

         <Link 
           href="/admin/commandes" 
           className="group relative bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/20 hover:scale-[1.02]"
         >
            <div className="relative z-10">
               <ShoppingCart size={32} className="text-accent mb-6" />
               <h3 className="text-2xl font-display italic text-white mb-2">Mes commandes</h3>
               <p className="text-text-muted text-[10px] eyebrow uppercase tracking-widest">Voir les ventes</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <ShoppingCart size={160} />
            </div>
         </Link>

         <Link 
           href="/admin/messages" 
           className="group relative bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/20 hover:scale-[1.02]"
         >
            <div className="relative z-10">
               <MessageSquare size={32} className="text-accent mb-6" />
               <h3 className="text-2xl font-display italic text-white mb-2">Mes messages</h3>
               <p className="text-text-muted text-[10px] eyebrow uppercase tracking-widest">Répondre aux demandes</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <MessageSquare size={160} />
            </div>
         </Link>
      </div>

      {/* Zone KPIs - Performances */}
      <div className="space-y-8">
         <h4 className="eyebrow text-[10px] text-text-muted">Performances de la galerie</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] eyebrow text-text-muted mb-2">Commandes</p>
              <div className="flex items-end justify-between">
                 <p className="text-3xl font-display italic text-white">{stats.orders}</p>
                 <span className="text-success text-[9px] eyebrow">+2 ce mois</span>
              </div>
           </div>
           
           <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] eyebrow text-text-muted mb-2">Chiffre d'Affaires</p>
              <div className="flex items-end justify-between">
                 <p className="text-3xl font-display italic text-white">{stats.revenue.toLocaleString()} $</p>
                 <DollarSign size={16} className="text-accent mb-2" />
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] eyebrow text-text-muted mb-2">Messages en attente</p>
              <div className="flex items-end justify-between">
                 <p className="text-3xl font-display italic text-white">{stats.messages}</p>
                 <span className={`${stats.messages > 0 ? 'text-accent' : 'text-text-muted'} text-[9px] eyebrow`}>
                   {stats.messages > 0 ? 'Nouveaux' : 'Tout lu'}
                 </span>
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl border-warning/20">
              <p className="text-[10px] eyebrow text-text-muted mb-2">Stocks Faibles</p>
              <div className="flex items-end justify-between">
                 <p className="text-3xl font-display italic text-white">{stats.lowStock}</p>
                 <AlertTriangle size={16} className="text-warning mb-2" />
              </div>
           </div>
         </div>
      </div>
    </div>
  )
}
