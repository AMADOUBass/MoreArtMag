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
  { name: 'Configuration', href: '/admin/parametres', icon: Settings },
]

export default function AdminSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen?: boolean; 
  onClose?: () => void 
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  if (pathname.includes('/admin/login')) return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50
        transition-transform duration-500 ease-cinematic
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="font-display italic text-2xl tracking-tighter">
            MoreArtMag <span className="text-accent">Admin</span>
          </Link>
          <button onClick={onClose} className="md:hidden text-text-muted hover:text-white">
            <LogOut size={20} className="rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 eyebrow text-[10px]
                  ${isActive 
                    ? "bg-accent !text-background-primary shadow-lg shadow-accent/20" 
                    : "text-text-muted hover:text-white hover:bg-white/5"}
                `}
              >
                <item.icon size={20} strokeWidth={1.5} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-4 px-4 py-4 text-error hover:bg-error/10 w-full rounded-xl transition-all eyebrow text-[10px]"
          >
            <LogOut size={20} strokeWidth={1.5} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
