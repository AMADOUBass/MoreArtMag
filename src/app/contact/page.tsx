'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Globe, MessageCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Le sujet est trop court"),
  message: z.string().min(10, "Le message est trop court"),
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
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' })
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
               <p className="eyebrow text-accent mb-8 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-accent/50" />
                  Contact & Collaboration
               </p>
               <h1 className="text-6xl md:text-8xl font-display italic text-white leading-[0.9] tracking-tighter">
                  Engageons la <br/>
                  <span className="text-accent">conversation.</span>
               </h1>
            </header>

            <div className="space-y-12">
               <div className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent transition-all duration-300">
                     <Mail size={20} />
                  </div>
                  <div>
                     <p className="eyebrow text-[10px] text-text-muted mb-1">Email</p>
                     <p className="text-xl text-white">contact@moreartmag.com</p>
                  </div>
               </div>

               <div className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent transition-all duration-300">
                     <MapPin size={20} />
                  </div>
                  <div>
                     <p className="eyebrow text-[10px] text-text-muted mb-1">Studio</p>
                     <p className="text-xl text-white">Bamako, Mali / Paris, France</p>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-white/5">
               <p className="eyebrow text-text-muted mb-6">Réseaux Sociaux</p>
               <div className="flex gap-6">
                  <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                     <Globe size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                     <MessageCircle size={18} />
                  </a>
               </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
             <motion.form 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden"
               onSubmit={handleSubmit}
             >
                {/* Subtle Gradient Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="eyebrow text-[10px] text-text-muted">Nom Complet</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Votre nom"
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="eyebrow text-[10px] text-text-muted">Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="votre@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="eyebrow text-[10px] text-text-muted">Téléphone (Optionnel)</label>
                   <input 
                     type="tel" 
                     placeholder="+33 6 00 00 00 00"
                     className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <label className="eyebrow text-[10px] text-text-muted">Type de Demande</label>
                   <div className="flex flex-wrap gap-3">
                      {['general', 'commission', 'press', 'gallery'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`px-6 py-3 rounded-full eyebrow text-[10px] border transition-all duration-300 ${
                            formData.type === type 
                            ? 'bg-accent border-accent text-white' 
                            : 'bg-transparent border-white/10 text-text-muted hover:border-white/30'
                          }`}
                          onClick={() => setFormData({...formData, type: type as any})}
                        >
                          {type === 'general' ? 'Général' : type === 'commission' ? 'Commande Art' : type === 'press' ? 'Presse' : 'Galerie'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Conditional Fields for Commission */}
                {formData.type === 'commission' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5"
                  >
                     <div className="space-y-3">
                        <label className="eyebrow text-[10px] text-accent">Budget Estimé</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        >
                           <option value="">Sélectionner</option>
                           <option value="500-1000">500€ - 1 000€</option>
                           <option value="1000-3000">1 000€ - 3 000€</option>
                           <option value="3000+">Plus de 3 000€</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="eyebrow text-[10px] text-accent">Format Souhaité</label>
                        <input 
                          type="text" 
                          placeholder="Ex: 80x100cm"
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                        />
                     </div>
                  </motion.div>
                )}

                <div className="space-y-3">
                   <label className="eyebrow text-[10px] text-text-muted">Sujet</label>
                   <input 
                     type="text" 
                     placeholder="L'objet de votre message"
                     className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors"
                     value={formData.subject}
                     onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   />
                </div>

                <div className="space-y-3">
                   <label className="eyebrow text-[10px] text-text-muted">Message</label>
                   <textarea 
                     rows={6}
                     placeholder="Comment puis-je vous aider ?"
                     className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                     value={formData.message}
                     onChange={(e) => setFormData({...formData, message: e.target.value})}
                   />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-6 eyebrow text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-accent hover:text-white transition-all duration-500 flex items-center justify-center gap-4 group"
                >
                   {loading ? "Envoi en cours..." : (
                     <>
                        Envoyer le message 
                        <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                     </>
                   )}
                </button>
             </motion.form>
          </div>
        </div>
      </div>
    </main>
  )
}
