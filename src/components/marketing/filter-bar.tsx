'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FilterBarProps {
  activeType: string
  setActiveType: (type: any) => void
  activeContinent: string
  setActiveContinent: (continent: string) => void
}

const CONTINENTS = [
  { label: 'Tous les lieux', value: 'all' },
  { label: 'Afrique', value: 'afrique' },
  { label: 'Europe', value: 'europe' },
  { label: 'Amérique', value: 'amerique' },
]

export default function FilterBar({ 
  activeType, 
  setActiveType, 
  activeContinent, 
  setActiveContinent 
}: FilterBarProps) {
  return (
    <div className="container-custom sticky top-24 z-30 pointer-events-none">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-background-tertiary/80 backdrop-blur-xl border border-white/5 p-4 rounded-full pointer-events-auto shadow-2xl">
        
        {/* Type Filter */}
        <div className="flex items-center p-1 bg-black/20 rounded-full border border-white/5">
          {['all', 'photo', 'peinture'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`relative px-6 py-2 text-xs eyebrow transition-colors duration-500 ${
                activeType === type ? 'text-white' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {activeType === type && (
                <motion.div
                  layoutId="type-active"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {type === 'all' ? 'Tout' : type === 'photo' ? 'Photographies' : 'Peintures'}
            </button>
          ))}
        </div>

        {/* Continent Filter */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar max-w-full px-4">
          {CONTINENTS.map((continent) => (
            <button
              key={continent.value}
              onClick={() => setActiveContinent(continent.value)}
              className={`text-[10px] eyebrow whitespace-nowrap transition-all duration-300 ${
                activeContinent === continent.value 
                ? 'text-accent border-b border-accent pb-1' 
                : 'text-text-muted hover:text-text-secondary pb-1 border-b border-transparent'
              }`}
            >
              {continent.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
