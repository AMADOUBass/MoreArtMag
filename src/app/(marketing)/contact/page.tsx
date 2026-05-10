'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Globe, MessageCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import Breadcrumbs from '@/components/marketing/breadcrumbs'

import Button from '@/components/ui/button'

const contactSchema = z.object({
  name: z.string().min(1, "Veuillez renseigner votre nom complet"),
  email: z.string().min(1, "L'adresse email est obligatoire").email("Le format de l'email n'est pas valide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "L'objet de votre message est requis").min(3, "Le sujet est trop court"),
  message: z.string().min(1, "Le contenu de votre message est vide").min(10, "Votre message doit contenir au moins 10 caractères"),
  type: z.enum(['general', 'commission', 'press', 'gallery']),
  budget: z.string().optional(),
  size: z.string().optional(),
})

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    budget: '',
    size: '',
  })
  const [showBudgetSelect, setShowBudgetSelect] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation with Zod
      contactSchema.parse(formData)

      // API Call
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Erreur d'envoi")

      toast.success("Message envoyé avec succès !")
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', type: 'general', budget: '', size: '' })
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message)
      } else {
        toast.error("Une erreur est survenue.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-background-primary pt-32 pb-20">
      <div className="container-custom py-20 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-16">
            <header>
               <Breadcrumbs items={[{ label: 'CONTACT' }]} />
               <p className="eyebrow text-accent mb-8 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-accent/50" />
                  Contact & Collaboration
               </p>
               <h1 className="text-4xl sm:text-6xl md:text-8xl font-display italic text-white leading-[0.9] tracking-tighter">
                  Engageons la <br/>
                  <span className="text-accent">conversation.</span>
               </h1>
            </header>

            <div className="space-y-10">
                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg shadow-black/20">
                      <Mail size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Email</p>
                      <p className="text-white text-xl font-display italic leading-tight">
                         contact@moreartmag.com
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg shadow-black/20">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Studio</p>
                      <p className="text-white text-xl font-display italic leading-tight">
                         430 Rue Faraday #102<br/>
                         Québec, QC G1N 4E5
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg shadow-black/20">
                      <Phone size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Téléphone</p>
                      <p className="text-white text-xl font-display italic leading-tight">
                         (418) 670-4391
                      </p>
                   </div>
                </div>
            </div>

             <div className="pt-12 border-t border-white/5">
                <p className="eyebrow text-text-muted mb-8 text-[9px]">Suivre l'aventure</p>
                <div className="space-y-4">
                   <a 
                     href="https://www.instagram.com/moreart.mag/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="group flex items-center gap-4 text-white hover:text-accent transition-colors duration-300"
                   >
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all duration-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <span className="eyebrow text-[10px] tracking-widest uppercase">MoreArt Mag</span>
                   </a>

                   <a 
                     href="https://www.instagram.com/triplevisiontv/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="group flex items-center gap-4 text-white hover:text-accent transition-colors duration-300"
                   >
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all duration-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <span className="eyebrow text-[10px] tracking-widest uppercase">TripleVision TV</span>
                   </a>
                </div>
             </div>
          </div>

          <div className="lg:col-span-7">
              <motion.form 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white/[0.02] backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.5)] space-y-8 group/form w-full"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Subtle Artistic Glow */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-[120px] pointer-events-none group-hover/form:bg-accent/15 transition-colors duration-1000" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                   <div className="relative space-y-2">
                      <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Identité</label>
                      <input 
                        type="text" 
                        placeholder="Nom complet"
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg font-display italic focus:outline-none focus:border-accent transition-all duration-700 placeholder:text-white/30 placeholder:font-sans placeholder:not-italic"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="relative space-y-2">
                      <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Correspondance</label>
                      <input 
                        type="email" 
                        placeholder="votre@email.com"
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg font-display italic focus:outline-none focus:border-accent transition-all duration-700 placeholder:text-white/30 placeholder:font-sans placeholder:not-italic"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                   
                   <div className="relative space-y-2 md:col-span-2">
                      <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Sujet de Réflexion</label>
                      <input 
                        type="text" 
                        placeholder="De quoi souhaitez-vous discuter ?"
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg font-display italic focus:outline-none focus:border-accent transition-all duration-700 placeholder:text-white/30 placeholder:font-sans placeholder:not-italic"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                   </div>

                   <div className="space-y-4 md:col-span-2">
                      <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Nature de la démarche</label>
                      <div className="flex flex-wrap gap-2">
                         {['general', 'commission', 'press', 'gallery'].map((type) => (
                           <button
                             key={type}
                             type="button"
                             onClick={() => setFormData({...formData, type: type as any})}
                             className={`py-2 px-5 rounded-full border text-[8px] eyebrow transition-all duration-700 ${
                               formData.type === type 
                                 ? 'border-accent bg-accent text-white shadow-md shadow-accent/20' 
                                 : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
                             }`}
                           >
                             {type === 'general' ? 'Général' : 
                              type === 'commission' ? 'Commande' : 
                              type === 'press' ? 'Presse' : 'Galerie'}
                           </button>
                         ))}
                      </div>
                   </div>

                   {formData.type === 'commission' && (
                     <div className="md:col-span-2 grid grid-cols-2 gap-12 pt-2">
                        <div className="relative space-y-2">
                           <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Budget</label>
                           <div className="relative">
                              <button 
                                type="button"
                                onClick={() => setShowBudgetSelect(!showBudgetSelect)}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg font-display italic focus:outline-none focus:border-accent transition-all duration-700 flex justify-between items-center"
                              >
                                 <span className={!formData.budget ? 'text-white/30 font-sans not-italic' : ''}>
                                    {formData.budget === '500-1000' ? '500 $ - 1 000 $' : 
                                     formData.budget === '1000-3000' ? '1 000 $ - 3 000 $' : 
                                     formData.budget === '3000+' ? 'Plus de 3 000 $' : 'Sélectionner'}
                                 </span>
                                 <svg 
                                   width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                   className={`transition-transform duration-500 ${showBudgetSelect ? 'rotate-180' : ''}`}
                                 >
                                    <path d="m6 9 6 6 6-6"/>
                                 </svg>
                              </button>
                              
                              <AnimatePresence>
                                 {showBudgetSelect && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute left-0 right-0 top-full mt-2 z-50 bg-background-secondary/95 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl"
                                    >
                                       {['', '500-1000', '1000-3000', '3000+'].map((opt) => (
                                          <button
                                            key={opt}
                                            type="button"
                                            className="w-full text-left px-6 py-4 text-sm text-white hover:bg-accent/10 hover:text-accent transition-colors border-b border-white/10 last:border-0 font-display italic"
                                            onClick={() => {
                                               setFormData({...formData, budget: opt})
                                               setShowBudgetSelect(false)
                                            }}
                                          >
                                             {opt === '' ? 'Sélectionner' : 
                                              opt === '500-1000' ? '500 $ - 1 000 $' : 
                                              opt === '1000-3000' ? '1 000 $ - 3 000 $' : 'Plus de 3 000 $'}
                                          </button>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>
                        <div className="relative space-y-2">
                           <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Dimensions</label>
                           <input 
                             type="text" 
                             placeholder="Ex: 80x100cm"
                             className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg font-display italic focus:outline-none focus:border-accent transition-all duration-700 placeholder:text-white/30 placeholder:font-sans placeholder:not-italic"
                             value={formData.size}
                             onChange={(e) => setFormData({...formData, size: e.target.value})}
                           />
                        </div>
                     </div>
                   )}

                   <div className="relative space-y-4 md:col-span-2">
                      <label className="text-[10px] eyebrow text-accent tracking-[0.3em] uppercase ml-1">Votre Message</label>
                      <textarea 
                        rows={3}
                        placeholder="Exprimez votre pensée..."
                        className="w-full bg-white/[0.02] border border-white/20 rounded-2xl p-5 text-white text-lg font-display italic focus:outline-none focus:border-accent focus:bg-white/[0.04] transition-all duration-700 resize-none placeholder:text-white/30 placeholder:font-sans placeholder:not-italic"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                   </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit"
                    loading={loading}
                    variant="secondary"
                    size="xl"
                    className="w-full rounded-2xl py-6 text-xs tracking-[0.3em]"
                    icon={<ArrowRight size={16} />}
                  >
                     Soumettre la demande
                  </Button>
                </div>
              </motion.form>
          </div>
        </div>
      </div>
    </main>
  )
}
