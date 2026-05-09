'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Image as ImageIcon, MessageSquare, ShoppingCart, LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Mes œuvres', href: '/admin/oeuvres', icon: ImageIcon },
  { name: 'Mes commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Mes messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Mes pièces (Preview)', href: '/admin/rooms', icon: ImageIcon },
  { name: 'Configuration', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Si on est sur la page login, on n'affiche rien (le layout gérera le cas différemment si besoin, 
  // mais ici le layout serveur redirige déjà)
  if (pathname === '/admin/login') return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col fixed inset-y-0 bg-[#0a0a0a] z-50">
      <div className="p-8">
        <Link href="/" className="font-display italic text-2xl tracking-tighter">
          MoreArt <span className="text-accent">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 eyebrow text-[10px]
                ${isActive 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-text-muted hover:text-white hover:bg-white/5"}
              `}
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-error hover:bg-error/10 w-full rounded-xl transition-all eyebrow text-[10px]"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
