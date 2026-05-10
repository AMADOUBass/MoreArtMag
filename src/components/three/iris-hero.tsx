'use client'

import { useRef, useLayoutEffect, useState, useEffect, useSyncExternalStore, Suspense, useCallback, type RefObject } from 'react'
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { IrisMaterial } from './iris-shader'
import { useIrisStore, SESSION_KEY } from '@/stores/iris-store'
import { getLenisInstance } from '@/lib/lenis-instance'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

extend({ IrisMaterial })

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type ScrollData = { progress: number }
type Mode = 'animation' | 'reduced' | 'skipped'

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const m = window.matchMedia(query)
    m.addEventListener('change', callback)
    return () => m.removeEventListener('change', callback)
  }
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeMedia(MOBILE_QUERY),
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}

function useLockedMode(): Mode {
  const [mode, setMode] = useState<Mode>('animation')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        setMode('skipped')
        return
      }
    } catch {
      // sessionStorage indisponible
    }
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      setMode('reduced')
    }
  }, [])

  return mode
}

function IrisMesh({
  scrollDataRef,
  isMobile,
}: {
  scrollDataRef: RefObject<ScrollData>
  isMobile: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const saccadeRef = useRef({ next: 0, x: 0, y: 0, decay: 0 })

  const noiseTex = useLoader(THREE.TextureLoader, '/textures/iris-noise.png')
  const irisTex  = useLoader(THREE.TextureLoader, '/textures/iris-eye.jpg')

  useFrame((state, delta) => {
    const mat = materialRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    // Cap delta pour éviter les sauts si l'onglet revient au premier plan
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    mat.uTime = t
    const p = scrollDataRef.current?.progress ?? 0

    // ── fitScale (dépend du viewport, recalculé chaque frame) ────────────
    const irisDiameter = 0.42 * 1.3 * 2
    const fitScale = isMobile
      ? Math.min((state.viewport.width * 0.92) / irisDiameter, 1.0)
      : 1

    // ── Courbe continue de la pupille ────────────────────────────────────
    // On plafonne à 0.42 (au lieu de 0.50) pour qu'un anneau d'iris reste
    // visible pendant le zoom → on voit les fibres défiler au lieu de juste
    // un disque noir qui grandit.
    const pupilT = Math.max(0, Math.min(1, (p - 0.05) / 0.67))
    const pupilEase = pupilT * pupilT * (3 - 2 * pupilT)
    const restFactor = Math.max(0, 1 - p / 0.30)
    mat.uPupilSize = 0.15 + pupilEase * 0.27 + Math.sin(t * 1.2) * 0.005 * restFactor

    // ── Échelle : courbe continue ────────────────────────────────────────
    let targetScale: number
    if (p < 0.30) {
      const breath = 1 + Math.sin(t * 0.4 * Math.PI) * 0.015 * restFactor
      targetScale = fitScale * breath
    } else if (p < 0.70) {
      const t2 = (p - 0.30) / 0.40
      const ease = t2 * t2 * (3 - 2 * t2)
      targetScale = fitScale + ease * (3.5 - fitScale)
    } else if (p < 0.85) {
      // Cubic ease-in pour l'effet "aspiration" dans la pupille
      const t3 = (p - 0.70) / 0.15
      const ease = t3 * t3 * t3
      targetScale = 3.5 + ease * 26.5
    } else {
      // On continue de zoomer en fondant pour l'effet tunnel
      const t4 = Math.min(1, (p - 0.85) / 0.15)
      targetScale = 30 + t4 * 25
    }

    // Damping frame-rate-indépendant en phase repos pour position + scale
    if (p < 0.30) {
      mesh.scale.x = THREE.MathUtils.damp(mesh.scale.x, targetScale, 7, dt)
      mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 7, dt)
    } else {
      mesh.scale.set(targetScale, targetScale, 1)
    }

    // ── Position : drift + parallax + saccades (uniquement en repos) ─────
    if (p < 0.30) {
      const fade = restFactor
      const driftX = Math.sin(t * 0.31) * 0.025 + Math.sin(t * 0.17) * 0.012
      const driftY = Math.cos(t * 0.27) * 0.020 + Math.cos(t * 0.13) * 0.010
      const mx = state.pointer.x * 0.04
      const my = state.pointer.y * 0.04

      let sx = 0
      let sy = 0
      if (!isMobile) {
        const s = saccadeRef.current
        if (t > s.next) {
          s.x = (Math.random() - 0.5) * 0.06
          s.y = (Math.random() - 0.5) * 0.06
          s.decay = t + 0.08
          s.next = t + 3 + Math.random() * 2
        }
        if (t < s.decay) {
          sx = s.x
          sy = s.y
        }
      }

      const targetX = (driftX + mx + sx) * fade
      const targetY = (driftY + my + sy) * fade

      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 4, dt)
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 4, dt)
    } else if (p < 0.70) {
      // Retour doux au centre pendant la dilatation
      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, 0, 5, dt)
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, 0, 5, dt)
    } else {
      mesh.position.set(0, 0, 0)
    }

    // ── Opacité : fade smooth dans les 15 derniers % ─────────────────────
    if (p < 0.85) {
      mat.uOpacity = 1.0
    } else {
      const t4 = Math.min(1, (p - 0.85) / 0.15)
      // Courbe quadratique pour un fade plus naturel
      mat.uOpacity = 1 - t4 * t4
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.3, 1.3]} />
      <irisMaterial
        ref={materialRef}
        uIrisTex={irisTex}
        uNoiseTex={noiseTex}
        uPupilSize={0.15}
        uOpacity={1.0}
        transparent
      />
    </mesh>
  )
}

export default function IrisHero() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const scrollData = useRef<ScrollData>({ progress: 0 })
  
  const mode = useLockedMode()
  const isMobile = useIsMobile()
  const setIrisActive = useIrisStore((s) => s.setIrisActive)

  const [canvasVisible, setCanvasVisible] = useState(mode === 'animation')
  const showCanvas = useCallback(() => setCanvasVisible(true), [])
  const hideCanvas = useCallback(() => setCanvasVisible(false), [])

  useLayoutEffect(() => {
    if (mode === 'skipped') {
      setIrisActive(false)
      return
    }

    if (!spacerRef.current) return

    // Scrub plus généreux = traversée beaucoup plus fluide, surtout en fin de course
    const scrubVal = isMobile ? 0.6 : 0.8

    const st = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: scrubVal,
      onUpdate: (self) => {
        const p = self.progress
        scrollData.current.progress = p
        if (scrollIndicatorRef.current && p > 0.005) {
          scrollIndicatorRef.current.style.opacity = '0'
        }
        if (titleRef.current) {
          const opacity = p < 0.05 ? 1 : Math.max(0, 1 - (p - 0.05) / 0.35)
          titleRef.current.style.opacity = opacity.toString()
        }
        if (p >= 0.85 && !useIrisStore.getState().traversed) {
          useIrisStore.getState().setTraversed(true)
          setIrisActive(false)
          hideCanvas()
          
          const lenis = getLenisInstance()
          if (lenis) {
            lenis.scrollTo('#universes', { 
              immediate: true,
              force: true 
            })
          }
        }
      },
      onLeave: () => {
        useIrisStore.getState().setTraversed(true)
        setIrisActive(false)
        hideCanvas()
      },
      onEnterBack: () => {
        showCanvas()
        setIrisActive(true)
      },
    })

    return () => {
      st.kill()
    }
  }, [mode, isMobile, hideCanvas, showCanvas, setIrisActive])

  if (mode === 'skipped') return null

  if (mode === 'reduced') {
    return (
      <section className="relative h-[50vh] w-full bg-black overflow-hidden" aria-label="Iris d'entrée">
        <Image src="/iris-hero.png" alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </section>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black"
        style={{ display: canvasVisible ? 'block' : 'none' }}
        aria-hidden={!canvasVisible}
      >
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 1], fov: 60 }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <IrisMesh scrollDataRef={scrollData} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>

        {/* Texte centré dans la pupille */}
        <div
          ref={titleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-opacity duration-200 ease-out"
          style={{ textShadow: '0 0 32px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,1)' }}
        >
          <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-2 font-sans">Bazan Togola</p>
          <h1 className="font-display italic text-white text-xl sm:text-3xl md:text-5xl leading-tight">Le poète oculaire</h1>
        </div>

        {/* Indicateur de scroll */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-700 flex flex-col items-center gap-3"
        >
          <span className="eyebrow text-[8px] tracking-[0.35em] text-white/60 md:hidden">GLISSER</span>
          <span className="eyebrow text-[8px] tracking-[0.35em] text-white/60 hidden md:block">DÉFILER</span>
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="opacity-50 animate-bounce">
            <rect x="7" y="1" width="6" height="12" rx="3" stroke="white" strokeWidth="1.5"/>
            <circle cx="10" cy="6" r="2" fill="white" className="animate-pulse"/>
            <path d="M10 18 L10 30 M6 26 L10 30 L14 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div ref={spacerRef} className="w-full h-[100vh]" aria-hidden="true" />
    </>
  )
}
