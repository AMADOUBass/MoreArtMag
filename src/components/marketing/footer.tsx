'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Mail, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useIrisStore } from '@/stores/iris-store'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { name: 'Photographies', href: '/photographies' },
  { name: 'Peintures', href: '/peintures' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'L\'Artiste', href: '/a-propos' },
]

const SOCIAL_LINKS = [
  { 
    name: 'Instagram', 
    href: '#', 
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ) 
  },
  { name: 'Behance', href: '#', icon: <Globe size={14} /> },
  { name: 'Email', href: 'mailto:contact@moreartmag.art', icon: <Mail size={14} /> },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const traversed = useIrisStore((s) => s.traversed)
  const hydrate = useIrisStore((s) => s.hydrate)
  const pathname = usePathname()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const isHome = pathname === '/'
  const showFooter = !isHome || traversed

  return (
    <footer 
      className={`w-full bg-background-primary pt-32 pb-12 overflow-hidden relative transition-opacity duration-1000 ${
        showFooter ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Top Section: The Big CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-48">
          <div className="max-w-3xl">
            <p className="eyebrow text-accent mb-8">Collaboration</p>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.85] tracking-tighter">
              Porter un <br/>
              <span className="text-white">nouveau regard.</span>
            </h2>
          </div>
          
          <Link 
            href="/contact" 
            className="group relative flex items-center gap-6 text-2xl md:text-3xl font-display italic text-text-primary hover:text-accent transition-colors duration-500"
          >
            <span className="relative">
              Démarrer un projet
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-700" />
            </span>
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all duration-700">
              <ArrowUpRight size={24} className="transition-transform duration-500 group-hover:rotate-45" />
            </div>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-24">
          {/* Brand Info */}
          <div className="md:col-span-5 pt-2">
            <p className="text-text-secondary text-lg max-w-sm leading-relaxed mb-10">
              Une immersion poétique dans l'art visuel et la matière, 
              portée par la vision de Bazan Togola.
            </p>
            <div className="flex items-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <motion.a 
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-text-muted hover:text-white hover:border-white/20 transition-all duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-6">
            <span className="eyebrow text-text-muted text-[10px]">Navigation</span>
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-accent transition-colors w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location / Status */}
          <div className="md:col-span-3 md:col-start-10 flex flex-col gap-6">
            <span className="eyebrow text-text-muted text-[10px]">Studio</span>
            <div className="text-sm text-text-secondary leading-loose">
              <p>Basé au Québec, Canada</p>
              <p>Disponible pour mandats</p>
              <p className="text-accent mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Ouvert aux commandes
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-text-muted eyebrow border-t border-white/5">
          <p>© {currentYear} MOREART MAG — TOUS DROITS RÉSERVÉS.</p>
          <div className="flex gap-10">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">MENTIONS LÉGALES</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">CONFIDENTIALITÉ</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
