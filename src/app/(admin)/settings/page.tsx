'use client'

import React from 'react'
import { Settings, User, Bell, Shield, ExternalLink, LogOut } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12">
      <header>
         <h1 className="text-4xl font-display italic text-white mb-2">Configuration</h1>
         <p className="eyebrow text-text-muted">Gérez vos accès et les paramètres de la plateforme.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Profil */}
         <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                  <User size={24} />
               </div>
               <h3 className="text-xl font-display italic text-white">Mon Profil Admin</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[9px] eyebrow text-text-muted uppercase">Nom d'affichage</p>
                  <p className="text-white">Bazan Admin</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[9px] eyebrow text-text-muted uppercase">Email de connexion</p>
                  <p className="text-white">admin@moreartmag.com</p>
               </div>
               <button className="text-[10px] eyebrow text-accent hover:underline">Changer le mot de passe</button>
            </div>
         </div>

         {/* Plateformes Externes */}
         <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-text-muted">
                  <Shield size={24} />
               </div>
               <h3 className="text-xl font-display italic text-white">Services Connectés</h3>
            </div>
            
            <div className="space-y-4">
               <a 
                 href="https://manage.sanity.io" target="_blank"
                 className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
               >
                  <span className="text-sm text-text-secondary">Sanity CMS (Contenu)</span>
                  <ExternalLink size={14} className="text-text-muted group-hover:text-accent" />
               </a>
               <a 
                 href="https://supabase.com" target="_blank"
                 className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
               >
                  <span className="text-sm text-text-secondary">Supabase (Base de données)</span>
                  <ExternalLink size={14} className="text-text-muted group-hover:text-accent" />
               </a>
               <a 
                 href="https://dashboard.stripe.com" target="_blank"
                 className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
               >
                  <span className="text-sm text-text-secondary">Stripe (Paiements)</span>
                  <ExternalLink size={14} className="text-text-muted group-hover:text-accent" />
               </a>
            </div>
         </div>
      </div>

      <div className="flex justify-center pt-12">
         <button className="flex items-center gap-3 text-error eyebrow text-[10px] hover:bg-error/10 px-8 py-4 rounded-xl transition-all">
            <LogOut size={16} /> Déconnexion sécurisée
         </button>
      </div>
    </div>
  )
}
