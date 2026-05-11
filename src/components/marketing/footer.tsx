'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
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
    name: 'Instagram MoreArt', 
    href: 'https://www.instagram.com/moreart.mag/', 
    color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ) 
  },
  { 
    name: 'Instagram TripleVision', 
    href: 'https://www.instagram.com/triplevisiontv/', 
    color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ) 
  },
  { name: 'Email', href: 'mailto:contact@moreartmag.com', color: '#0a0a0a', icon: <Mail size={16} /> },
]

export default function Footer() {
  const [mounted, setMounted] = React.useState(false)
  const [newsletterEmail, setNewsletterEmail] = React.useState('')
  const [newsletterError, setNewsletterError] = React.useState('')
  const traversed = useIrisStore((s) => s.traversed)
  const hydrate = useIrisStore((s) => s.hydrate)
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)
    hydrate()
  }, [hydrate])

  if (!mounted) return null

  const isHome = pathname === '/'
  const isContactPage = pathname === '/contact'
  const showFooter = !isHome || traversed

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!newsletterEmail) {
      setNewsletterError("Email requis")
      toast.error("Veuillez entrer votre adresse email.")
      return
    }
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError("Email invalide")
      toast.error("L'adresse email n'est pas valide.")
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Une erreur est survenue.")

      toast.success("Inscription au Journal réussie !")
      setNewsletterEmail('')
      setNewsletterError('')
    } catch (error: any) {
      console.error(error)
      setNewsletterError(error.message)
      toast.error(error.message || "Impossible de s'inscrire pour le moment.")
    }
  }

  return (
    <footer 
      className={`w-full bg-white pt-32 pb-12 overflow-hidden relative transition-opacity duration-1000 border-t border-black/5 ${
        showFooter ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Glow - Subtle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[2000px] h-[500px] bg-black/[0.01] blur-[150px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Top Section: The Big CTA - Home page only */}
        {isHome && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-48">
            <div className="max-w-3xl">
              <p className="eyebrow text-[#a3a3a3] mb-8">Collaboration</p>
              <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display leading-[0.85] tracking-tighter text-[#0a0a0a]">
                Porter un <br/>
                <span className="text-[#a3a3a3]">nouveau regard.</span>
              </h2>
            </div>
            
            <Link 
              href="/contact" 
              className="group relative flex items-center gap-6 text-2xl md:text-3xl font-display text-[#0a0a0a] hover:text-[#a3a3a3] transition-colors duration-500"
            >
              <span className="relative">
                Démarrer un projet
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-700" />
              </span>
              <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">
                <ArrowUpRight size={24} className="transition-transform duration-500 group-hover:rotate-45" />
              </div>
            </Link>
          </div>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-24">
          {/* Brand Info */}
          <div className="md:col-span-4 pt-2">
            <Link href="/" className="inline-block mb-8">
              <span className="font-display text-2xl text-[#0a0a0a] tracking-tight">
                MoreArt<span className="text-[#a3a3a3]">Mag</span>
              </span>
            </Link>
            <p className="text-[#737373] text-lg max-w-sm leading-relaxed mb-10">
              Une immersion poétique dans l'art visuel et la matière, 
              portée par la vision de Bazan Togola.
            </p>
            <div className="flex items-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <motion.a 
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 overflow-hidden border border-black/5 bg-white"
                  aria-label={link.name}
                >
                  <div className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all text-[#0a0a0a]">
                    {link.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation & Support */}
          <div className="md:col-span-2 md:col-start-6 flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <span className="eyebrow text-[#a3a3a3] text-[10px]">Navigation</span>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors w-fit"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <span className="eyebrow text-[#a3a3a3] text-[10px]">Support</span>
              <div className="flex flex-col gap-4">
                <Link href="/faq" className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors w-fit">FAQ</Link>
                <Link href="/politiques" className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors w-fit">Livraison</Link>
                <Link href="/contact" className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors w-fit">Contact</Link>
              </div>
            </div>
          </div>

          {/* Newsletter / Identity */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="space-y-4">
              <span className="eyebrow text-[#a3a3a3] text-[10px]">Journal d'Art</span>
              <p className="text-sm text-[#737373] max-w-xs leading-relaxed">
                Inscrivez-vous pour recevoir les notes de studio et les avant-premières de collections.
              </p>
              <form className="relative group/news mt-6" onSubmit={handleNewsletterSubmit} noValidate>
                <input 
                  type="email" 
                  placeholder="votre@email.com"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value)
                    if (newsletterError) setNewsletterError('')
                  }}
                  className={`w-full bg-transparent border-b py-3 text-sm text-[#0a0a0a] focus:outline-none transition-all duration-700 placeholder:text-black/20 ${newsletterError ? 'border-red-500' : 'border-black/10 focus:border-black'}`}
                />
                <button 
                  type="submit"
                  className="absolute right-0 bottom-3 text-[#0a0a0a] hover:text-[#a3a3a3] transition-colors duration-500 eyebrow text-[9px] tracking-widest"
                >
                   S&apos;INSCRIRE
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-black group-focus-within/news:w-full transition-all duration-700" />
                {newsletterError && (
                  <p className="text-red-500 text-[8px] eyebrow mt-1 absolute top-full left-0">{newsletterError}</p>
                )}
              </form>
            </div>

            <div className="pt-8 border-t border-black/5 space-y-4">
               <span className="eyebrow text-[#a3a3a3] text-[10px]">Identité</span>
               <div className="text-sm text-[#737373] leading-loose">
                  <p>Baigné dans la culture malienne</p>
                  <p>En quête perpétuelle de ses racines</p>
                  <p className="text-[#0a0a0a] mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    Basé à Québec, Canada
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-[#a3a3a3] eyebrow border-t border-black/5">
          <p>© {currentYear} MOREART MAG — TOUS DROITS RÉSERVÉS.</p>
          <div className="flex gap-10">
            <Link href="/mentions-legales" className="hover:text-black transition-colors uppercase tracking-widest">Mentions Légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-black transition-colors uppercase tracking-widest">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
