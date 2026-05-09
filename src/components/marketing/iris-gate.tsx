'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useIrisStore } from '@/stores/iris-store'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(callback: () => void) {
  const m = window.matchMedia(REDUCED_MOTION_QUERY)
  m.addEventListener('change', callback)
  return () => m.removeEventListener('change', callback)
}

export default function IrisGate({ children }: { children: React.ReactNode }) {
  const traversed = useIrisStore((s) => s.traversed)
  const hydrate = useIrisStore((s) => s.hydrate)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const open = traversed || reducedMotion

  // On rend les enfants en permanence (avec visibility:hidden tant que la
  // traversée n'est pas faite) plutôt que return null, sinon le doc serait
  // trop court pour que ScrollTrigger atteigne son end → l'animation
  // resterait bloquée et onLeave ne firerait jamais.
  return (
    <div
      style={{ visibility: open ? 'visible' : 'hidden' }}
      aria-hidden={!open}
    >
      {children}
    </div>
  )
}
