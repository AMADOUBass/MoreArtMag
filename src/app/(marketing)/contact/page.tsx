'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Globe, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import Breadcrumbs from '@/components/marketing/breadcrumbs'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: "Acquisition d'œuvre",
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const subjects = [
    { label: "Acquisition d'œuvre", value: "acquisition" },
    { label: "Projet Collaboratif", value: "commission" },
    { label: "Demande Presse", value: "press" },
    { label: "Autre", value: "other" },
  ]

  const validateField = (name: string, value: string) => {
    let error = ""
    if (name === 'name' && value.length < 2) {
      error = "Le nom doit contenir au moins 2 caractères."
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) error = "L'adresse email est requise."
      else if (!emailRegex.test(value)) error = "Veuillez entrer une adresse email valide."
    }
    if (name === 'message' && value.length < 10) {
      error = "Votre message est trop court (min. 10 caractères)."
    }
    return error
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation finale avant envoi
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ name: true, email: true, message: true })
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          type: 'general', // Type par défaut pour le formulaire de contact
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Une erreur est survenue.")

      toast.success("Votre message a été transmis avec succès !")
      setFormData({ name: '', email: '', subject: "Acquisition d'œuvre", message: '' })
      setErrors({})
      setTouched({})
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Impossible d'envoyer le message. Réessayez plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-32 md:pt-64 pb-20 bg-[#f5f5f5] min-h-screen">
      <div className="container-custom pb-20 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-16 lg:pr-12">
            <div>
              <Breadcrumbs items={[{ label: 'CONTACT' }]} />
              <p className="eyebrow text-[#737373] mb-6 mt-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-black/20" />
                Collaboration
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-display text-[#0a0a0a] leading-[0.9] tracking-tighter mb-8">
                Engageons la <br/> 
                <span className="text-[#a3a3a3]">conversation.</span>
              </h1>
              <p className="text-[#737373] text-xl leading-relaxed">
                Qu'il s'agisse d'une acquisition, d'une commande spéciale ou d'une demande de presse, nous vous répondrons dans les plus brefs délais.
              </p>
            </div>

            <div className="space-y-8 pt-12 border-t border-black/5">
              <div className="flex gap-6 group items-center">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                   <p className="eyebrow text-[#a3a3a3] text-[9px] mb-1 uppercase tracking-widest">Email Direct</p>
                   <a href="mailto:contact@moreartmag.com" className="text-xl text-[#0a0a0a] hover:text-[#a3a3a3] transition-colors font-display">contact@moreartmag.com</a>
                </div>
              </div>

              <div className="flex gap-6 group items-center">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0 shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-5 h-5 text-black" />
                </div>
                <div>
                   <p className="eyebrow text-[#a3a3a3] text-[9px] mb-1 uppercase tracking-widest">Localisation</p>
                   <p className="text-xl text-[#0a0a0a] font-display">Québec, Canada</p>
                </div>
              </div>

              <div className="flex gap-6 group items-center">
                <a 
                  href="https://www.instagram.com/moreart.mag/" 
                  target="_blank"
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500 bg-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <div>
                   <p className="eyebrow text-[#a3a3a3] text-[9px] mb-1 uppercase tracking-widest">Suivre</p>
                   <a href="https://www.instagram.com/moreart.mag/" target="_blank" className="text-xl text-[#0a0a0a] hover:text-[#a3a3a3] transition-colors font-display">@moreart.mag</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.1)] border border-black/5 relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-black/[0.02] blur-[100px] rounded-full pointer-events-none" />

              <form className="space-y-10 relative z-10" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Champ Nom */}
                  <div className="space-y-3">
                    <label className="eyebrow text-[#0a0a0a] text-[10px] uppercase tracking-[0.2em] ml-2">Nom Complet</label>
                    <input 
                      type="text" name="name" placeholder="Jean Dupont"
                      className={`w-full bg-[#f8f8f8] border-b py-5 px-8 text-[#0a0a0a] focus:outline-none focus:bg-white transition-all placeholder:text-[#a3a3a3] rounded-2xl font-display text-lg shadow-sm ${errors.name ? 'border-red-500' : 'border-black/5 focus:border-black'}`}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[10px] eyebrow ml-2">
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Champ Email */}
                  <div className="space-y-3">
                    <label className="eyebrow text-[#0a0a0a] text-[10px] uppercase tracking-[0.2em] ml-2">Adresse Email</label>
                    <input 
                      type="email" name="email" placeholder="jean@exemple.com"
                      className={`w-full bg-[#f8f8f8] border-b py-5 px-8 text-[#0a0a0a] focus:outline-none focus:bg-white transition-all placeholder:text-[#a3a3a3] rounded-2xl font-display text-lg shadow-sm ${errors.email ? 'border-red-500' : 'border-black/5 focus:border-black'}`}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[10px] eyebrow ml-2">
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sujet (Sélecteur personnalisé) */}
                <div className="space-y-3">
                  <label className="eyebrow text-[#0a0a0a] text-[10px] uppercase tracking-[0.2em] ml-2">Sujet de Réflexion</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[#f8f8f8] border-b border-black/5 py-5 px-8 text-[#0a0a0a] cursor-pointer rounded-2xl font-display text-lg flex justify-between items-center group hover:bg-white transition-all shadow-sm"
                    >
                      <span>{formData.subject}</span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden p-2"
                        >
                          {subjects.map((sub) => (
                            <div 
                              key={sub.value}
                              className="px-6 py-4 hover:bg-[#f8f8f8] cursor-pointer rounded-xl transition-colors font-display text-lg text-[#0a0a0a] hover:text-black"
                              onClick={() => {
                                setFormData({...formData, subject: sub.label})
                                setIsDropdownOpen(false)
                              }}
                            >
                              {sub.label}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <label className="eyebrow text-[#0a0a0a] text-[10px] uppercase tracking-[0.2em] ml-2">Votre Message</label>
                  <textarea 
                    rows={4} name="message" placeholder="Décrivez votre vision ici..."
                    className={`w-full bg-[#f8f8f8] border-b py-6 px-8 text-[#0a0a0a] focus:outline-none focus:bg-white transition-all placeholder:text-[#a3a3a3] resize-none rounded-[2rem] font-display text-lg shadow-sm ${errors.message ? 'border-red-500' : 'border-black/5 focus:border-black'}`}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[10px] eyebrow ml-2">
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button 
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-8 bg-[#0a0a0a] text-white eyebrow text-[13px] font-bold tracking-[0.5em] transition-all duration-500 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <span className="relative z-10">{loading ? "TRANSMISSION..." : "ENVOYER LA DEMANDE"}</span>
                  {!loading && <ArrowUpRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
