# Roadmap d'exécution

Plan pour livrer la V1 de MoreArt Mag en environ deux semaines de travail focus.

## Phase 0 : Avant de coder (1/2 journée)

Seulement ce qui est nécessaire pour démarrer le code :

- Créer les comptes dev : Vercel, Supabase, Sanity, Stripe (mode test), Resend
- Récupérer auprès de Bazan : son portrait, sa bio, 5 à 10 œuvres prêtes à publier (photos haute résolution + métadonnées : titre, lieu, année, dimensions, prix, type — original/tirage numéroté/reproduction), 6 photos de pièces pour la room preview
- Faire valider à Bazan le moodboard et le concept iris
- Générer les premiers assets via Nano Banana (voir `prompts/NANO_BANANA.md`)

> Les domaines, DNS, Stripe live, et tout ce qui est production sont gérés au **Jour 14** seulement. Pas besoin de ça pour coder.

---

## Semaine 1 — Fondations et hero

- [x] Premier commit, premier push, premier déploiement Vercel

### Jour 2 — Base de données et CMS

- [x] Créer le projet Supabase, créer les tables et policies RLS selon `docs/DATABASE.md`
- [x] Générer les types TypeScript Supabase
- [x] Créer le projet Sanity, définir les schémas selon `docs/SANITY_SCHEMAS.md`
- [x] Connecter Sanity à Next.js via `next-sanity`, intégrer Studio sous `/studio`
- [x] Configurer le webhook Sanity → `/api/revalidate` (cache) et `/api/sanity-artwork-sync` (stock)

### Jours 3 et 4 — Hero iris

C'est la pièce maîtresse, prendre le temps.

- [x] Implémenter le composant `IrisHero` selon `features/IRIS_HERO.md`
- [x] Tester sur viewport desktop, tablet, mobile
- [x] Vérifier `prefers-reduced-motion`
- [x] Mesurer LCP, ajuster si > 2.5s

### Jour 5 — Layout et navigation

- [x] Créer `(marketing)/layout.tsx` avec nav + footer
- [x] Implémenter la nav : logo MoreArt Mag, liens vers les sections, panier (icône avec compteur), bouton CTA contact
- [x] Footer : liens utilitaires, réseaux sociaux, copyright, mentions légales

---

## Semaine 2 — Galerie, boutique, admin

### Jour 6 — Galerie principale

- [x] Implémenter `/moreart` avec barre de filtres et grille
- [x] Implémenter la lightbox au clic d'une carte
- [x] Tester la responsivité

### Jour 7 — Page détail œuvre

- [x] Implémenter `/oeuvres/[slug]` avec layout split
- [x] Sélecteur de taille, prix dynamique, indicateur de stock
- [x] Section œuvres liées en bas
- [x] Implement Structured data Product schema (SEO).
- [x] Configure Zustand store for cart.
- [x] Implement `/panier` page.
- [x] Initialize Stripe and create `/api/checkout` endpoint.
- [x] Create `/checkout/success` page.
- [x] Create `/checkout/success` page.
- [x] Refactor `/a-propos` with Vision and Portfolio.
- [x] Implement `/contact` and `/api/inquiries`.
- [x] Implement Law 25 compliance (Privacy, Cookies).
- [x] Create Custom 404 and Global SEO.
- [x] Update Roadmap.

### Jour 8 — Room preview

- [x] Implémenter la modale Room Preview selon `features/ROOM_PREVIEW.md`
- [x] Calibrer les pièces dans la base de données
- [x] Tester avec différentes tailles d'œuvres

### Jour 9 — Boutique et panier

- [x] Implémenter `/boutique` (déjà en place)
- [x] Configurer le store Zustand pour le panier (localStorage)
- [x] Implémenter `/panier` avec récap et modification des quantités

### Jour 10 — Checkout Stripe

- [x] Configurer Stripe en mode test
- [x] Créer l'endpoint API `/api/checkout`
- [x] Gérer la redirection vers Stripe Checkout
- [ ] Implémenter `/api/stripe/webhook` (Post-lancement V1)
- [x] Implémenter `/checkout/success` de confirmation
- Configurer les emails Resend (templates : confirmation client, notification Bazan)

### Jour 11 — Page À propos et contact

- [x] Implémenter `/a-propos` avec scroll narratif et Portfolio
- [x] Implémenter `/contact` avec formulaire et validation Zod
- [x] Implémenter `/api/inquiries` (insert Supabase + email Resend)
- [x] **Polissage & Conformité Loi 25** (Privacy, Cookies, 404, SEO)

### Jours 12 et 13 — Panel admin

- Implémenter le middleware d'auth admin
- Implémenter `/admin` (hub d'accueil + KPIs)
- Implémenter `/admin/oeuvres` (liste + édition stock/prix)
- Implémenter `/admin/commandes` (liste + détail + changement de statut)
- Implémenter `/admin/messages` (inquiries)
- Voir `features/ADMIN.md` pour le détail

---

## Jour 14 — Lancement

Tout ce qui est production se passe ici, pas avant :

### Domaines et DNS
- Acheter les domaines : **`moreartmag.art` (principal)**, plus `moreartmag.ca` et `moreartmag.com` en redirection (Namecheap ou OVH, ~50$ total/an pour les trois)
- Configurer le DNS sur Vercel (pointage domaine → déploiement)
- Configurer les emails de domaine via Resend (enregistrements SPF, DKIM, DMARC)

### Commerce
- Basculer Stripe en mode live (nouvelles clés, nouveau webhook secret)
- Configurer les shipping rates dans le dashboard Stripe
- Consulter un comptable québécois pour valider le statut fiscal des œuvres d'art avant d'activer Stripe Tax
- Demander à Bazan ses tarifs de livraison définitifs par zone (Canada, US, Europe)

### Qualité et légal
- Audit Lighthouse sur toutes les pages clés (objectif 90+ partout)
- Audit accessibilité (contraste, focus visible, lecteur d'écran)
- Test sur appareils réels : iPhone, Android, iPad
- Pages légales publiées (CGV, mentions, vie privée) — à faire rédiger par un juriste

### Go live
- [ ] **IMPORTANT : Changer l'email de notification dans `/api/inquiries` (passer de l'email dev à l'email de Bazan)**
- Mise en production (push → Vercel deploy automatique)
- Bazan se connecte à Sanity et publie ses premières œuvres pour de vrai
- Enregistrer la vidéo Loom d'onboarding de 3-5 min pour Bazan

---

## Après le lancement

À surveiller la première semaine :
- Premières commandes (vérifier que le webhook Stripe tourne bien)
- Retours utilisateurs (formulaire contact)
- Performance réelle (Vercel Analytics)

V1.5 (sous 1-2 mois) :
- Sentry pour le monitoring d'erreurs
- Sound design sur le hero (avec toggle mute)
- Système de comptes clients + sync panier DB
- Wishlist
- Newsletter avec Resend Audiences
- Section **Magazine** (V1.5) : Boutique de produits numériques (PDF) avec paiement Stripe et livraison automatique par email.
- Section **Services** (V1.5) : Présentation des prestations de contrats photo et projets sur mesure.

V2 (3-6 mois) :
- Multi-langue EN
- AR mobile (WebXR) pour la room preview
- Système d'œuvres en pré-commande / sur liste d'attente
- Section **Projets & Expositions** (V2) : Archives complètes des projets d'art et timeline interactive des expositions passées.
- Programme d'affiliation pour décorateurs
