'use client'

import { useIrisStore } from '@/stores/iris-store'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ShoppingBag, ArrowRight, X } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { name: 'Photographies', href: '/photographies' },
  { name: 'Peintures', href: '/peintures' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'L\'Artiste', href: '/a-propos' },
]

export default function Navbar() {
    const { traversed, irisActive } = useIrisStore()
    const hydrate = useIrisStore((s) => s.hydrate)
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    
    const cartCount = useCart((s) => s.totalItems())
 
    useEffect(() => {
      setMounted(true)
      hydrate()
    }, [hydrate])
 
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    }, [isMenuOpen])
 
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
 
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 100)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
 
    const isHome = pathname === '/'
    // On cache la nav si on est sur Home et que l'iris est actif
    const showNav = !isHome || (!irisActive && (traversed || scrolled))
 
    if (!mounted) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none p-4 md:p-6 lg:p-8">
      <header 
        className={`
          pointer-events-auto relative flex items-center justify-between
          w-full max-w-7xl px-4 py-3 md:px-8 md:py-4
          rounded-2xl md:rounded-[2rem] border transition-all duration-700 ease-cinematic
          ${scrolled 
            ? "bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl py-3" 
            : "bg-black/20 backdrop-blur-sm border-white/5 shadow-none"
          }
          ${showNav 
            ? "translate-y-0 opacity-100 scale-100" 
            : "-translate-y-8 opacity-0 scale-95"
          }
        `}
      >
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-2 z-10">
          <div className="relative overflow-hidden">
            <span className="font-display text-xl md:text-2xl italic text-text-primary tracking-tight block transition-transform duration-500 group-hover:-translate-y-full">
              MoreArt<span className="text-accent">Mag</span>
            </span>
            <span className="font-display text-xl md:text-2xl italic text-accent tracking-tight absolute top-0 left-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0">
              MoreArt<span className="text-text-primary">Mag</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav with Liquid Indicator */}
        <nav 
          className="hidden md:flex items-center gap-1 relative px-1 py-1 bg-white/5 rounded-full border border-white/5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {LINKS.map((link, idx) => (
            <Link 
              key={link.href}
              href={link.href} 
              onMouseEnter={() => setHoveredIndex(idx)}
              className={`
                relative px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 z-10
                ${hoveredIndex === idx || pathname === link.href ? "text-text-primary" : "text-text-secondary"}
              `}
            >
              {link.name}
              
              {/* Active Indicator Dot */}
              {pathname === link.href && (
                <motion.span 
                  layoutId="activeDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" 
                />
              )}

              {/* Smooth Hover Pill Background */}
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="hoverPill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-0"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions Section */}
         <div className="flex items-center gap-3 md:gap-5 z-10">
          <Link 
            href="/panier" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-text-secondary hover:text-accent border border-white/5 transition-all duration-300 hover:scale-110 relative"
            aria-label="Panier"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link 
            href="/contact" 
            className="group hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-accent text-white px-6 py-3 rounded-full hover:bg-accent-hover transition-all duration-300 shadow-lg shadow-accent/20"
          >
            Contact
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button 
            onClick={toggleMenu}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-text-secondary border border-white/5"
          >
            {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-background-primary flex flex-col p-8 md:hidden"
          >
            <div className="flex-1 flex flex-col justify-center gap-12">
              {LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-5xl font-display italic text-white hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-12 border-t border-white/5"
              >
                <Link 
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-accent eyebrow"
                >
                  Démarrer un projet <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="py-8 border-t border-white/5 flex justify-between items-center text-[9px] eyebrow text-text-muted">
               <p>© 2026 MOREART MAG</p>
               <div className="flex gap-4">
                  <Link href="/mentions-legales" onClick={() => setIsMenuOpen(false)}>LÉGAL</Link>
                  <Link href="/politique-confidentialite" onClick={() => setIsMenuOpen(false)}>PRIVACY</Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
