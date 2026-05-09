# Règles du projet MoreArt Mag

Fichier chargé automatiquement à chaque session. Source de vérité pour les règles, conventions et contraintes.

## Le projet en une phrase

Site portfolio + e-commerce pour Bazan Togola, photographe-peintre. Concept signature : entrée par l'iris d'un œil qui se dilate au scroll.

## Stack imposée (ne pas substituer sans validation)

- Framework : **Next.js 16.2.4** App Router + TypeScript strict (React 19)
- 3D : **@react-three/fiber 9.6.1** + **@react-three/drei 10.7.7** + **three 0.184.0**
- Animation scroll : **GSAP 3.15.0** + ScrollTrigger
- Smooth scroll : **Lenis 1.3.23**
- CSS : **Tailwind 4.2.4** + shadcn/ui + **tailwind-merge 3.5.0** + **clsx** + **class-variance-authority 0.7.1**
- Micro-animations UI : **Motion 12.38.0** (`motion/react` — anciennement `framer-motion`)
- Base de données / Auth / Storage : **@supabase/supabase-js 2.105.3** + **@supabase/ssr 0.10.2**
- CMS éditorial : **@sanity/client 7.22.0** + **next-sanity 12.3.0**
- Paiements : **stripe 22.1.0** (Node) + **@stripe/stripe-js 9.4.0** (browser) + Stripe Tax
- Emails : **resend 6.12.2** + **react-email 6.0.0**
- État panier : **zustand 5.0.13**
- Validation : **zod 4.4.3** (v4 — API différente de v3, voir notes)
- i18n : **next-intl 4.3.4** (FR seulement au lancement)
- Icônes : **lucide-react 1.14.0** (stroke 1.5px)
- Toasts : **sonner 2.0.7**
- Hébergement : Vercel

### Notes de version critiques

> **Motion (ex-Framer Motion)** : importer depuis `motion/react`, PAS depuis `framer-motion`. Le package `framer-motion` reste installable mais l'API canonique est `import { motion } from "motion/react"`.

> **Zod v4** : changements breaking depuis v3. Vérifier la doc officielle avant d'écrire des schémas. Les schemas `.email()`, `.url()` et `z.record()` ont des comportements modifiés. Import : `import { z } from "zod"` (inchangé).

> **@react-three/fiber v9** : cible React 19. Incompatible avec React 18. S'assurer que `package.json` pointe bien sur `react@19`.

> **Next.js 16** : App Router toujours la méthode recommandée. Vérifier les breaking changes depuis la v15 dans le changelog officiel avant `npm install`.

## Règles strictes (non-négociables)

1. Jamais commiter `.env.local`, clés API, secrets Stripe ou service_role Supabase
2. Row Level Security (RLS) Supabase activée sur toutes les tables, sans exception
3. Webhook Stripe : vérification de signature obligatoire
4. Toutes les images via `next/image`, formats AVIF/WebP, attribut `sizes` correct
5. Performance budget : LCP < 2.5s, CLS < 0.1, INP < 200ms
6. `prefers-reduced-motion` respecté partout
7. Mobile-first : tester chaque feature à 375px avant de valider
8. Pas de `any` en TypeScript, utiliser `unknown` puis narrow
9. Auth admin : double vérification (middleware Next.js + check serveur dans chaque action sensible)

## Conventions

- Composants en PascalCase, fichiers en kebab-case
- Server Components par défaut, `"use client"` seulement si nécessaire
- Data fetching : Server Components ou Server Actions, jamais `useEffect` pour le fetch initial
- Erreurs : try/catch côté serveur, retour structuré `{ data, error }`
- Branches Git : `feat/...`, `fix/...`, `chore/...`
- Commits : Conventional Commits
- Avant push : lint + typecheck + build doivent passer

## Avant chaque action de code, tu dois pouvoir répondre à

1. Quelle spec dans `docs/` ou `features/` couvre cette tâche ?
2. Si la tâche touche Sanity : ai-je vérifié `docs/SANITY_SCHEMAS.md` pour les champs exacts ?
3. La base de données Supabase est-elle impactée ? Schéma à jour ?
4. Quels tokens du design system s’appliquent ?
5. Comment tester sur mobile 375px ?
6. Qu’est-ce qui peut casser en production que je ne verrai pas en dev ?

Si tu ne peux pas répondre, demande au chef de projet avant d'écrire du code.

## Quand demander confirmation explicite

- Avant de modifier le schéma de base de données
- Avant d'ajouter une dépendance hors stack canonique
- Avant de toucher aux variables d'environnement
- Avant de pousser en production
- Avant de simplifier ou raccourcir une feature signature (iris hero, room preview)

## Localisation

- Langue principale : français (fr-CA)
- Préparer i18n via next-intl, mais ne charger que FR au lancement
- Devise affichée par défaut : **CAD** (le client est canadien)
- Multi-devise via Stripe : USD, EUR, GBP, CHF (conversion automatique côté Stripe)
- Taxes : Stripe Tax activé pour Canada (TPS+TVQ), UE (TVA), US (sales tax si applicable)
- Pays autorisés au checkout V1 : CA, US, FR, BE, CH, GB. Autres pays → devis sur demande via `/contact`
- Domaine principal : `moreartmag.art` recommandé (cohérent positionnement artistique). Acheter aussi `.ca` et `.com` en redirection

## Identité visuelle (à respecter strictement)

- Background principal : noir chaud profond
- Texte : blanc chaud
- Accent : cuivre ambre
- Police display : Cormorant Garamond ou Fraunces (italique pour citations)
- Police corps : Inter ou Manrope
- Voir `docs/DESIGN_SYSTEM.md` pour les valeurs exactes

## Communication avec le chef de projet

- Tu réponds en français
- Tu es direct, pas de flatterie inutile
- Tu signales les risques que tu vois (perf, sécurité, UX, scope creep)
- Tu refuses poliment de coder ce qui contredit cette doc — tu pointes le conflit et demandes arbitrage
- Tu proposes un plan en 3 à 7 étapes avant d'attaquer une feature non triviale
