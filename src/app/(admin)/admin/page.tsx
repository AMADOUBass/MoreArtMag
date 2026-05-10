import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/types/supabase'
import Link from 'next/link'

type OrderRow = Database['public']['Tables']['orders']['Row']
import { MessageSquare, ShoppingCart, Image as ImageIcon, ExternalLink, AlertTriangle, DollarSign } from 'lucide-react'

async function fetchDashboardStats() {
  const [ordersRes, revenueRes, messagesRes, lowStockRes] = await Promise.all([
    supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true }),

    supabaseAdmin
      .from('orders')
      .select('*')
      .eq('status', 'paid'),

    supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),

    supabaseAdmin
      .from('artwork_stock')
      .select('*', { count: 'exact', head: true })
      .not('remaining', 'is', null)
      .lt('remaining', 3),
  ])

  const revenueRows = (revenueRes.data ?? []) as OrderRow[]
  const revenue = revenueRows.reduce((sum, o) => sum + (o.total_cents ?? 0), 0)

  return {
    orders: ordersRes.count ?? 0,
    revenue,
    messages: messagesRes.count ?? 0,
    lowStock: lowStockRes.count ?? 0,
  }
}

export default async function AdminDashboard() {
  const stats = await fetchDashboardStats()

  return (
    <div className="space-y-16">
      <header>
        <h1 className="text-5xl font-display italic text-white mb-4 tracking-tighter">
          Bonjour, Bazan.
        </h1>
        <p className="eyebrow text-text-muted text-xs">
          Voici l'état de votre galerie.
        </p>
      </header>

      {/* Zone HUB */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a
          href="/studio"
          target="_blank"
          className="group relative bg-accent p-8 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative z-10">
            <ImageIcon size={32} className="!text-background-primary mb-6" />
            <h3 className="text-2xl font-display italic !text-background-primary mb-2">
              Gérer mes œuvres
            </h3>
            <p className="!text-background-primary/70 text-[10px] eyebrow uppercase tracking-widest flex items-center gap-2">
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
            <h3 className="text-2xl font-display italic text-white mb-2">
              Mes commandes
            </h3>
            <p className="text-text-muted text-[10px] eyebrow uppercase tracking-widest">
              Voir les ventes
            </p>
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
            <h3 className="text-2xl font-display italic text-white mb-2">
              Mes messages
            </h3>
            <p className="text-text-muted text-[10px] eyebrow uppercase tracking-widest">
              Répondre aux demandes
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <MessageSquare size={160} />
          </div>
        </Link>
      </div>

      {/* Zone KPIs */}
      <div className="space-y-8">
        <h4 className="eyebrow text-[10px] text-text-muted">
          Performances de la galerie
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] eyebrow text-text-muted mb-2">Commandes</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-display italic text-white">
                {stats.orders}
              </p>
              <ShoppingCart size={16} className="text-text-muted mb-2" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] eyebrow text-text-muted mb-2">
              Chiffre d'affaires
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-display italic text-white">
                {(stats.revenue / 100).toLocaleString('fr-CA', {
                  style: 'currency',
                  currency: 'CAD',
                  maximumFractionDigits: 0,
                })}
              </p>
              <DollarSign size={16} className="text-accent mb-2" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] eyebrow text-text-muted mb-2">
              Messages en attente
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-display italic text-white">
                {stats.messages}
              </p>
              <span
                className={`${
                  stats.messages > 0 ? 'text-accent' : 'text-text-muted'
                } text-[9px] eyebrow`}
              >
                {stats.messages > 0 ? 'Nouveaux' : 'Tout lu'}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl border-warning/20">
            <p className="text-[10px] eyebrow text-text-muted mb-2">
              Stocks faibles
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-display italic text-white">
                {stats.lowStock}
              </p>
              <AlertTriangle size={16} className="text-warning mb-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
