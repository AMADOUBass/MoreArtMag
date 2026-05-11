import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0604',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: 'MoreArt Mag | Bazan Togola',
    template: '%s | MoreArt Mag',
  },
  description: 'Exploration poétique de Bazan Togola, artiste né au Québec et baigné dans la culture malienne. Une quête de racines à travers l\'image et la matière.',
  metadataBase: new URL('https://moreartmag.art'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MoreArt Mag',
  },
  openGraph: {
    title: 'MoreArt Mag | Bazan Togola',
    description: 'Portfolio et boutique de Bazan Togola, photographe et peintre basé au Québec.',
    url: 'https://moreartmag.art',
    siteName: 'MoreArt Mag',
    locale: 'fr_CA',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MoreArt Mag Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoreArt Mag | Bazan Togola',
    description: 'Portfolio et boutique de Bazan Togola.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/icons/icon-192x192.png',
  },
}

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased bg-black" suppressHydrationWarning={true}>
        <Toaster position="bottom-right" richColors theme="dark" />
        {children}
      </body>
    </html>
  )
}
