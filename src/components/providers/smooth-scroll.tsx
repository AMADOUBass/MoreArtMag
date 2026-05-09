'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenisInstance } from '@/lib/lenis-instance'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip si l'utilisateur a demandé reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })
    setLenisInstance(lenis)

    // Synchronise Lenis avec GSAP : ScrollTrigger lit la même horloge
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Force ScrollTrigger à recalculer start/end avec la vraie hauteur du
    // document. BeyondGrid + Footer sont maintenant dans le DOM dès le départ
    // (visibility:hidden via IrisGate), donc on doit rafraîchir après init.
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(refreshId)
      gsap.ticker.remove(tickerCallback)
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
