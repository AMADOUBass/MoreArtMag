'use client'

import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading,
  icon,
  ...props
}, ref) => {
  
  const variants = {
    primary: 'bg-white text-black hover:bg-accent hover:text-black shadow-xl shadow-black/20',
    secondary: 'bg-accent text-background-primary hover:bg-accent-hover shadow-xl shadow-accent/10',
    outline: 'bg-transparent border border-white/10 text-white hover:border-accent hover:text-accent',
    ghost: 'bg-transparent text-text-muted hover:text-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-[9px]',
    md: 'px-8 py-4 text-[10px]',
    lg: 'px-10 py-5 text-[11px]',
    xl: 'px-12 py-6 text-xs'
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'eyebrow font-bold uppercase tracking-[0.2em] rounded-full transition-colors duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {icon && <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">{icon}</span>}
        </>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
