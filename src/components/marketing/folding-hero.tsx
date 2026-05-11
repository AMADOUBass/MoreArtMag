'use client'

import React, { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { useIrisStore } from '@/stores/iris-store'
import WaveShader from './wave-shader'
import { getLenisInstance } from '@/lib/lenis-instance'

const TEXT = "MORE ART MAGAZINE"
const WORDS = TEXT.split(" ")

export default function FoldingHero() {
  const [isMounted, setIsMounted] = useState(false)
  const setTraversed = useIrisStore((s) => s.setTraversed)
  const setIrisActive = useIrisStore((s) => s.setIrisActive)
  const traversed = useIrisStore((s) => s.traversed)

  const hydrate = useIrisStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
    setIsMounted(true)
  }, [hydrate])

  useEffect(() => {
    const lenis = getLenisInstance()
    if (isMounted && !traversed) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      const lenis = getLenisInstance()
      lenis?.start()
    }
  }, [isMounted, traversed])

  if (!isMounted) return null
  
  // Si déjà traversé (via localStorage), on n'affiche plus du tout le Hero.
  if (traversed) return null

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const wordFade: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80
      }
    }
  }

  const handleDiscover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const lenis = getLenisInstance()

    setTraversed(true)
    setIrisActive(false)
    
    // Utilisation de Lenis pour un scroll beaucoup plus fluide et cinématique
    setTimeout(() => {
      const target = document.getElementById('content')
      if (target && lenis) {
        lenis.scrollTo(target, { 
          duration: 2.2, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // OutExpo easing
        })
      }
    }, 50)
  }

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden" style={{ fontFamily: 'var(--font-ibm-plex-mono), "IBM Plex Mono", "IBM Plex Mono Fallback", monospace' }}>
      <a href="#content" onClick={handleDiscover} className="cursor-pointer z-10 w-full flex flex-col items-center justify-center h-full group px-4">
        
        {/* Background WebGL Shader (Full Screen) */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000">
           <WaveShader />
        </div>

        {/* Eyebrow / Signature */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="relative z-10 mb-6 text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#737373]"
          style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
        >
          Bazan Togola
        </motion.div>

        {/* Centered Massive Text */}
        <motion.div 
          className="relative z-10 flex flex-wrap justify-center items-center max-w-[100vw] text-center pointer-events-none"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {WORDS.map((word, index) => (
            <React.Fragment key={`center-${index}`}>
              <motion.span 
                className="text-3xl sm:text-5xl md:text-[9vw] lg:text-[8vw] font-normal text-[#f5f5f5] uppercase leading-none tracking-tighter"
                style={{ textShadow: '0 0 30px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.8), 0 0 100px rgba(0,0,0,0.5)' }}
                variants={wordFade}
              >
                {word}
              </motion.span>
              {index < WORDS.length - 1 && <span className="w-4 md:w-8" />}
            </React.Fragment>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 z-10 px-14 py-4 border border-white/10 rounded-full text-[#f5f5f5] text-[9px] tracking-[0.6em] uppercase transition-all hover:bg-white hover:text-black hover:border-white cursor-pointer backdrop-blur-sm"
          style={{ textShadow: '0 0 20px rgba(0,0,0,1)' }}
        >
          Découvrir
        </motion.div>
      </a>

      <div id="content" className="absolute bottom-0 w-full h-0" />
    </section>
  )
}
