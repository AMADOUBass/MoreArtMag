'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Connexion réussie')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
           <h1 className="text-5xl font-display italic text-white mb-4 tracking-tighter">
             MoreArt <span className="text-accent">Admin</span>
           </h1>
           <p className="eyebrow text-text-muted text-[10px]">Accès réservé au personnel autorisé</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="eyebrow text-[9px] ml-4">Email Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/30"
                  placeholder="admin@moreartmag.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="eyebrow text-[9px] ml-4">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-5 rounded-2xl"
              icon={<ArrowRight size={18} />}
            >
              Se Connecter
            </Button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-[9px] eyebrow text-text-muted">
                Retour au <a href="/" className="text-accent hover:underline">site public</a>
             </p>
          </div>
        </div>

        <div className="mt-12 text-center text-[9px] eyebrow text-white/10">
           SÉCURISÉ PAR SUPABASE & MOREART MAG ARCHITECTURE
        </div>
      </div>
    </div>
  )
}
