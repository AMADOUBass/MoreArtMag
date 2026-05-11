'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-8">
      <div className="text-center space-y-8 px-6 max-w-xl">
        <p className="eyebrow text-[10px] tracking-[0.4em] text-[#a3a3a3] uppercase">Erreur Système</p>
        <h1 className="font-display text-4xl md:text-6xl text-[#0a0a0a] tracking-tighter leading-tight">
          Quelque chose <br/> 
          <span className="text-[#a3a3a3]">s'est brisé.</span>
        </h1>
        <p className="text-[#737373] text-lg leading-relaxed">
          "L'art est parfois fragile. Une erreur technique est survenue lors du chargement de cette œuvre numérique."
        </p>
        <div className="flex gap-6 justify-center pt-8">
          <button
            onClick={reset}
            className="px-8 py-4 border border-black/10 text-[#0a0a0a] eyebrow text-[10px] hover:border-black transition-all duration-500 rounded-sm"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-8 py-4 bg-[#0a0a0a] text-white eyebrow text-[10px] hover:bg-[#262626] transition-all duration-500 rounded-sm shadow-xl"
          >
            Retour Accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
