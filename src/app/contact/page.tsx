'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
               <h1 className="text-6xl md:text-8xl font-display italic text-white leading-[0.9] tracking-tighter">
                  Engageons la <br/>
                  <span className="text-accent">conversation.</span>
               </h1>
            </header>

            <div className="space-y-10">
                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <Mail size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Email</p>
                      <p className="text-white text-lg font-display italic leading-tight">
                         contact@moreartmag.com
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Studio</p>
                      <p className="text-white text-lg font-display italic leading-tight">
                         430 Rue Faraday #102<br/>
                         Québec, QC G1N 4E5
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <Phone size={20} />
                   </div>
                   <div>
                      <p className="eyebrow text-[10px] text-text-muted mb-2">Téléphone</p>
                      <p className="text-white text-lg font-display italic leading-tight">
                         (418) 670-4391
                      </p>
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

           <div className="lg:col-span-7">
             <motion.form 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden group/form"
               onSubmit={handleSubmit}
               noValidate
             >
                {/* Subtle Gradient Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="eyebrow text-[10px] text-text-muted">Nom Complet</label>
                      <input 
                        type="text" 
                        placeholder="Votre nom"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="eyebrow text-[10px] text-text-muted">Email</label>
                      <input 
                        type="email" 
                        placeholder="votre@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
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
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>

                <div className="space-y-6">
                   <label className="eyebrow text-[10px] text-text-muted">Type de demande</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {['general', 'commission', 'press', 'gallery'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type: type as any})}
                          className={`py-3 px-4 rounded-xl border text-[9px] eyebrow transition-all duration-500 text-center ${
                            formData.type === type 
                              ? 'border-accent bg-accent/10 text-accent shadow-[0_0_20px_rgba(192,136,85,0.15)]' 
                              : 'border-white/5 bg-white/5 text-text-muted hover:border-white/20'
                          }`}
                        >
                          {type === 'general' ? 'Général' : 
                           type === 'commission' ? 'Commande' : 
                           type === 'press' ? 'Presse' : 'Galerie'}
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                </div>

                <div className="space-y-3">
                   <label className="eyebrow text-[10px] text-text-muted">Message</label>
                   <textarea 
                     rows={5}
                     placeholder="Comment puis-je vous aider ?"
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300 resize-none"
                     value={formData.message}
                     onChange={(e) => setFormData({...formData, message: e.target.value})}
                   />
                </div>

                <Button 
                  type="submit"
                  loading={loading}
                  size="xl"
                  className="w-full"
                  icon={<Send size={16} />}
                >
                   Envoyer le message 
                </Button>
             </motion.form>
          </div>
        </div>
      </div>
    </main>
  )
}
