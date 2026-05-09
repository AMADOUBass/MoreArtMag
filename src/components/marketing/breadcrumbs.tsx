'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-[10px] eyebrow text-text-muted mb-12">
      <Link 
        href="/" 
        className="hover:text-accent transition-colors flex items-center gap-1.5"
      >
        <Home size={12} />
        ACCUEIL
      </Link>
      
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={10} className="text-white/20" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-accent transition-colors uppercase tracking-widest"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-accent tracking-widest uppercase">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
