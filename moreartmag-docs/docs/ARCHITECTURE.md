# Architecture technique

## Vue d'ensemble

Le projet repose sur quatre services principaux qui communiquent entre eux :

- **Next.js** : le frontend et les routes API (déployé sur Vercel)
- **Supabase** : la base de données transactionnelle (commandes, panier, messages, sessions, stock)
- **Sanity** : le CMS où Bazan édite son contenu (œuvres, collections, bio, images)
- **Stripe** : les paiements et la fiscalité automatique

À cela s'ajoutent **Resend** pour les emails transactionnels et **Vercel** pour l'hébergement.

## Pourquoi cette répartition

Sanity gère le **contenu éditorial** que Bazan modifie souvent (œuvres, textes). Supabase gère les **transactions** (commandes, panier) parce que les types relationnels et les triggers SQL y sont natifs. Cette séparation évite que Bazan casse ses commandes en éditant son contenu.

Les références aux œuvres se font via un identifiant Sanity (string) côté Supabase. Pas de clé étrangère cross-services, juste un pont logique.

## Structure de dossiers attendue

```
moreartmag/
├── README.md
├── CLAUDE.md
├── AGENTS.md
├── .env.local                    secrets (jamais commité)
├── .env.example                  template à commiter
├── public/
│   ├── fonts/
│   ├── og/                       images Open Graph par défaut
│   └── favicon/
├── src/
│   ├── app/
│   │   ├── (marketing)/          site public
│   │   │   ├── layout.tsx        nav + footer
│   │   │   ├── page.tsx          racine, hero iris
│   │   │   ├── moreart/
│   │   │   ├── boutique/
│   │   │   ├── oeuvres/[slug]/
│   │   │   ├── collections/[slug]/
│   │   │   ├── a-propos/
│   │   │   └── contact/
│   │   ├── (shop)/
│   │   │   ├── panier/
│   │   │   ├── checkout/         route handler Stripe
│   │   │   └── commande/[id]/
│   │   ├── admin/                protégé par middleware
│   │   ├── api/
│   │   │   ├── stripe/webhook/
│   │   │   ├── checkout/
│   │   │   ├── inquiries/
│   │   │   └── revalidate/       webhook Sanity
│   │   ├── layout.tsx            racine
│   │   └── globals.css
│   ├── components/
│   │   ├── three/                iris hero, scroll portal
│   │   ├── gallery/              grid, card, filters, lightbox
│   │   ├── shop/                 cart, size selector, room preview
│   │   ├── admin/                forms, tables, stats
│   │   ├── ui/                   shadcn/ui
│   │   └── shared/               nav, footer, seo
│   ├── lib/
│   │   ├── supabase/             clients (browser, server), types
│   │   ├── sanity/               client, queries, types
│   │   ├── stripe/               clients
│   │   ├── email/                resend + templates
│   │   └── utils/                cart, format-price, perspective
│   ├── hooks/                    use-cart, use-scroll-progress, use-reduced-motion
│   ├── store/                    zustand cart store
│   ├── types/
│   └── middleware.ts             auth admin
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── sanity/
    ├── schemas/
    └── sanity.config.ts
```

## Variables d'environnement (à créer dans `.env.local`)

Publiques (préfixe `NEXT_PUBLIC_`) :
- URL du site
- URL et clé anonyme Supabase
- ID projet et dataset Sanity
- Clé publishable Stripe

Privées (jamais préfixées `NEXT_PUBLIC_`) :
- Service role Supabase (admin)
- API token Sanity (lecture/écriture)
- Clé secrète Stripe
- Secret de vérification webhook Stripe
- API key Resend
- Secret de validation pour le webhook Sanity → Next.js
- Liste des emails admin autorisés (séparés par virgule)

Un fichier `.env.example` doit être commité, avec les noms des variables mais des valeurs vides ou factices.

## Dépendances principales attendues

Frontend et 3D :
- next@16, react@19, react-dom@19, typescript
- @react-three/fiber@9 (cible React 19), @react-three/drei@10, three
- gsap, lenis
- motion (`motion/react` — anciennement `framer-motion`)
- tailwindcss@4, class-variance-authority, clsx, tailwind-merge
- lucide-react (icônes)
- sonner (toasts)

Données et services :
- @supabase/supabase-js, @supabase/ssr
- @sanity/client, next-sanity
- stripe@22 (Node), @stripe/stripe-js (browser)
- resend, react-email@6

État et validation :
- zustand@5
- zod@4 (API breaking vs v3 — voir CLAUDE.md)

Internationalisation :
- next-intl@4

Dev :
- eslint, eslint-config-next
- prettier, prettier-plugin-tailwindcss
- supabase (CLI)

### Notes de version critiques

> **motion** (ex-Framer Motion) : importer depuis `motion/react`, PAS depuis `framer-motion`. Le package s'appelle maintenant `motion`.

> **Zod v4** : changements breaking depuis v3 (`.email()`, `.url()`, `z.record()` modifiés). Voir CLAUDE.md.

> **@react-three/fiber v9** : cible React 19, incompatible avec React 18.

> **stripe@22** (Node) : vérifier les breaking changes vs v16 dans le changelog Stripe avant installation.

## Flux critiques à comprendre

### Achat client de bout en bout

1. Client clique « Acheter » sur la page d'une œuvre
2. Server Action vérifie le stock et insère dans `cart_items` (ou store local si invité)
3. Client va sur `/panier`, voit son récap
4. Client clique « Passer commande », appel à la route `/api/checkout`
5. Le serveur crée une session Stripe Checkout avec les line items, taxes et frais de port
6. Client est redirigé vers Stripe (URL hosted par Stripe)
7. Client paie sur Stripe
8. Stripe envoie un webhook `checkout.session.completed` à `/api/stripe/webhook`
9. Le serveur vérifie la signature, crée la commande dans Supabase, décrémente le stock, marque l'œuvre comme vendue si unique, envoie l'email de confirmation via Resend
10. Stripe redirige le client vers `/commande/[session_id]` qui affiche la confirmation

### Édition de contenu par Bazan

1. Bazan se connecte sur Sanity Studio (interface séparée)
2. Il modifie une œuvre, ajoute des images
3. Sanity envoie un webhook à `/api/revalidate`
4. Le serveur vérifie le secret, appelle `revalidateTag` sur les bonnes clés
5. La prochaine requête utilisateur déclenche un re-fetch et la page est régénérée

## Hébergement

- Production : Vercel (intégration Next.js native, déploiements automatiques sur push)
- Sanity Studio : **intégré sous `/studio`** dans l’app Next.js (décision V1 : une seule URL pour Bazan, plus simple). Utiliser le package `next-sanity` avec le composant `<NextStudio>`. Si les besoins de séparation se font sentir en V2, migrer vers `studio.moreartmag.art`.
- Domaine principal recommandé : **`moreartmag.art`** (cohérent avec le positionnement artistique). Acheter aussi `moreartmag.ca` et `moreartmag.com` en redirection vers le principal pour protéger la marque
- Certificats SSL : automatiques via Vercel
## Décisions architecturales tranchées

### next-intl

Architecture adoptée : **sans préfixe de locale dans l’URL** (`/boutique` et non `/fr/boutique`). En V1 on ne charge que le français. next-intl est installé et configuré correctement pour permettre l’ajout de `en` en V2 sans migration structurelle. Utiliser le middleware next-intl avec `localeDetection: false` et `defaultLocale: 'fr'`.

### Sanity Studio

Intégré sous `/studio` (voir section Hébergement ci-dessus). Protégé par le middleware Next.js : accès restreint aux emails admins.

### artwork_stock.currency

**Toujours `CAD` en V1.** Le champ existe en prévision d’une V2 multi-devise, mais en V1 tous les prix sont en CAD. La conversion est gérée par Stripe à la présentation du checkout. Ne pas afficher de prix mixtes dans l’UI : toujours lire `currency` et afficher `${price} CAD`.

### cart_items (panier en base de données)

**Table créée au schéma V1 mais non utilisée activement.** La V1 n’a pas de comptes clients (achat invité uniquement). Le panier vit dans Zustand + localStorage. La table `cart_items` est migrée pour être prête, mais la sync DB n’est implémentée qu’en V2 avec l’arrivée des comptes clients. Cela simplifie le Jour 9.

### Token invité pour /commande/[id]

Le param `id` dans `/commande/[id]` est le `checkout_session_id` Stripe (string opaque, impossible à deviner). Pas de token supplémentaire : la session Stripe est le token. Le serveur vérifie que `payment_status = 'paid'` sur la session. Si la session n’existe pas ou n’est pas payée, 404. Cela suffit pour V1.
