'use client'

import { useRef, useLayoutEffect, useState, useSyncExternalStore, Suspense, useCallback, type RefObject } from 'react'
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
  const [mode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'animation'
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') return 'skipped'
    } catch {
      // sessionStorage indisponible
    }
    return window.matchMedia(REDUCED_MOTION_QUERY).matches ? 'reduced' : 'animation'
  })

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

  useFrame((state) => {
    const mat = materialRef.current
    const mesh = meshRef.current
    if (!mat || !mesh) return

    const t = state.clock.elapsedTime
    mat.uTime = t
    const p = scrollDataRef.current?.progress ?? 0

    if (p <= 0.30) {
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

      const fade = 1 - p / 0.30
      const targetX = (driftX + mx + sx) * fade
      const targetY = (driftY + my + sy) * fade
      mesh.position.x += (targetX - mesh.position.x) * 0.06
      mesh.position.y += (targetY - mesh.position.y) * 0.06

      const breath = 1 + Math.sin(t * 0.2 * Math.PI * 2) * 0.015 * fade
      mesh.scale.set(breath, breath, 1)

      mat.uPupilSize = 0.15 + Math.sin(t * 1.2) * 0.005 * fade
      mat.uOpacity = 1.0
    } else if (p <= 0.70) {
      const t2 = (p - 0.30) / 0.40
      const ease = t2 * t2 * (3 - 2 * t2)
      mat.uPupilSize = 0.15 + ease * 0.35
      mat.uOpacity = 1.0
      const scale = 1 + ease * 2.5
      mesh.scale.set(scale, scale, 1)
      mesh.position.x *= 0.92
      mesh.position.y *= 0.92
    } else if (p <= 0.85) {
      const t3 = (p - 0.70) / 0.15
      const ease = t3 * t3 * (3 - 2 * t3)
      mat.uPupilSize = 0.5
      const scale = 3.5 + ease * 26.5
      mesh.scale.set(scale, scale, 1)
      mesh.position.set(0, 0, 0)
      mat.uOpacity = 1.0
    } else {
      const t4 = Math.min(1, (p - 0.85) / 0.15)
      mat.uPupilSize = 0.5
      mesh.scale.set(30, 30, 1)
      mesh.position.set(0, 0, 0)
      mat.uOpacity = 1 - t4
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.3, 1.3]} />
      <irisMaterial
        ref={materialRef}
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

    const scrubVal = isMobile ? 0.2 : 0.3

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

        <div
          ref={titleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-opacity duration-200 ease-out [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/80 mb-3 font-sans">Bazan Togola</p>
          <h1 className="font-display italic text-white text-2xl sm:text-3xl md:text-5xl leading-tight">Le poète oculaire</h1>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none transition-opacity duration-700"
        >
          <div className="w-[1px] h-10 bg-white overflow-hidden">
            <div className="w-full h-full bg-white animate-scroll-line" />
          </div>
        </div>
      </div>

      <div ref={spacerRef} className="w-full h-[100vh]" aria-hidden="true" />
    </>
  )
}
