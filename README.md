# MoreArt Mag — Galerie d'Art Cinématique

**MoreArt Mag** est une plateforme d'art haut de gamme conçue pour l'artiste **Bazan Togola**. Alliant photographie Fine Art et peinture contemporaine, le site offre une expérience immersive et cinématique unique, transformant la navigation web en une visite de galerie muséale.

![MoreArt Mag Banner](/public/og-image.jpg)

## ✨ Fonctionnalités Clés

### 👁️ Immersion Cinématique
- **Iris Hero** : Une porte d'entrée interactive plongeant l'utilisateur au cœur de l'univers de l'artiste.
- **Navigation Fluide** : Transitions de pages fluides et scroll narratif (GSAP / Framer Motion).
- **Design Minimaliste** : Esthétique épurée respectant les codes du luxe et de l'art contemporain.

### 🎨 Expérience Artistique
- **Mosaïque Dynamique** : Une grille de galerie non-conventionnelle mettant en valeur la profondeur des œuvres.
- **Chambre Virtuelle (Room Preview)** : Visualisez les œuvres à l'échelle réelle dans un intérieur moderne avant l'achat.
- **Lightbox Haute Définition** : Explorez chaque grain de photographie et chaque coup de pinceau.

### 🛒 E-Commerce & Transactionnel
- **Panier Persistant** : Gestion fluide des sélections via Zustand avec persistance locale.
- **Paiement Stripe** : Intégration sécurisée pour les transactions internationales.
- **Suivi des Demandes** : Formulaire de contact intelligent pour les commandes spéciales et commissions.

## 🛠️ Stack Technique

- **Frontend** : [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **Animations** : [GSAP](https://greensock.com/gsap/), [Framer Motion](https://www.framer.com/motion/)
- **CMS** : [Sanity.io](https://www.sanity.io/) (Gestion de contenu temps réel)
- **Base de données** : [Supabase](https://supabase.com/) (Inquiries & Orders)
- **Paiements** : [Stripe](https://stripe.com/)
- **Emails** : [Resend](https://resend.com/)

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/AMADOUBass/MoreArtMag.git
   cd MoreArtMag
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Variables d'environnement**
   Copiez le fichier `.env.example` en `.env.local` et remplissez vos clés :
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`

4. **Lancer le développement**
   ```bash
   npm run dev
   ```

## ⚖️ Conformité & Légal
- Entièrement conforme à la **Loi 25 (Québec)** sur la protection des renseignements personnels.
- Gestion transparente des cookies et politique de confidentialité intégrée.

---

Édité avec passion par **MoreArt Mag Team**.
© 2026 Tous droits réservés.