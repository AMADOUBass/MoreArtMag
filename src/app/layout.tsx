import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import SmoothScroll from '@/components/providers/smooth-scroll'
import Navbar from '@/components/marketing/navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0604',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'MoreArt Mag | Bazan Togola',
    template: '%s | MoreArt Mag',
  },
  description: 'Exploration poétique de Bazan Togola, artiste né au Québec et baigné dans la culture malienne. Une quête de racines à travers l\'image et la matière, entre ses origines et sa terre de naissance.',
  metadataBase: new URL('https://moreartmag.art'),
  openGraph: {
    title: 'MoreArt Mag | Bazan Togola',
    description: 'Portfolio et boutique de Bazan Togola, photographe et peintre basé au Québec.',
    url: 'https://moreartmag.art',
    siteName: 'MoreArt Mag',
    locale: 'fr_CA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { Toaster } from 'sonner'
import CookieBanner from '@/components/marketing/cookie-banner'
import Footer from '@/components/marketing/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-black" suppressHydrationWarning={true}>
        <Navbar />
        <Toaster position="bottom-right" richColors theme="dark" />
        <CookieBanner />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
