'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="fr">
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 px-6">
          <p className="eyebrow text-[10px] tracking-[0.4em] text-white/40 uppercase">Erreur inattendue</p>
          <h1 className="font-display italic text-4xl md:text-6xl">Quelque chose s'est brisé.</h1>
          <p className="text-white/50 text-sm max-w-sm mx-auto">
            Une erreur est survenue. Réessaie ou reviens à l'accueil.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={reset}
              className="px-6 py-3 border border-white/20 text-sm hover:border-white/60 transition-colors"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-white text-black text-sm hover:bg-white/80 transition-colors"
            >
              Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
