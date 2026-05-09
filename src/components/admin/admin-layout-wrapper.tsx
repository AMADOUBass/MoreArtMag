'use client'

import React, { useState } from 'react'
import AdminSidebar from './sidebar'
import { Menu, X } from 'lucide-react'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Sidebar - Reçoit l'état et la fonction de fermeture */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header - Visible seulement sur téléphone/tablette */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-40">
          <div className="font-display italic text-xl tracking-tighter">
            MoreArt <span className="text-accent">Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-text-muted hover:text-white bg-white/5 rounded-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Content - Décalé sur desktop pour laisser la place à la sidebar fixed */}
        <main className="flex-1 p-6 md:p-12 md:ml-72 transition-all duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}
