# Schémas Sanity

Source de vérité pour les schémas du CMS éditorial. Bazan édite le contenu via Sanity Studio (`/studio`). Ces schémas définissent les champs disponibles pour chaque type de document.

> **Rappel architectural** : Sanity gère le contenu éditorial (œuvres, textes, images). Supabase gère les transactions (stock, commandes, panier). Ne jamais mettre de données transactionnelles dans Sanity.

## Schéma : `artwork` (œuvre)

Le type central. Chaque document représente une œuvre de Bazan — photo ou peinture.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `_id` | string (auto) | — | Identifiant Sanity, utilisé comme FK dans Supabase |
| `title` | string | ✓ | Titre de l'œuvre |
| `slug` | slug (from title) | ✓ | URL de la page `/oeuvres/[slug]` |
| `type` | string (enum) | ✓ | `'photo'` ou `'peinture'` |
| `mainImage` | image (hotspot) | ✓ | Image principale, haute résolution |
| `images` | array of image | — | Images supplémentaires (détails, cadre, etc.) |
| `year` | number | ✓ | Année de création |
| `location` | string | — | Lieu de prise de vue / création (ex: « Dakar, 2022 ») |
| `continent` | string (enum) | — | `'afrique'`, `'europe'`, `'amerique'`, `'asie'`, `'oceanie'`, `'autre'` |
| `shortDescription` | text | — | Paragraphe court affiché sur la page détail (voix de Bazan) |
| `longDescription` | array (block content) | — | Texte long, contexte narratif, portable text |
| `collection` | reference → `collection` | — | Collection à laquelle l'œuvre appartient |
| `availableInShop` | boolean | ✓ | Si false, l'œuvre est dans la galerie mais pas en boutique |
| `requiresQuote` | boolean | — | Si true pour toutes les tailles > 120cm : désactiver "Acheter", afficher "Demander un devis" |
| `sizes` | array of object | — | Tailles disponibles : chacune a `sizeId` (string, clé unique), `label` (ex: "40×60 cm"), `widthCm`, `heightCm`. Les prix et stocks sont dans Supabase (`artwork_stock`), pas ici. |
| `featured` | boolean | — | Mise en avant sur la homepage beyond grid ou en tête de galerie |
| `archived` | boolean | — | Si true, n'apparaît pas dans `/boutique` mais reste dans `/moreart` |

### Notes importantes

- `sizes[].sizeId` est l'identifiant qui fait le pont avec `artwork_stock.size_sanity_id` dans Supabase. Doit être unique par œuvre et stable (ne jamais changer après création).
- Les prix ne sont **pas dans Sanity** — ils sont dans `artwork_stock` pour permettre des transactions atomiques.
- `availableInShop: false` est la façon de "retirer de la vente" sans supprimer l'œuvre.

---

## Schéma : `collection`

Un ensemble d'œuvres regroupées par série, thème ou voyage.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `title` | string | ✓ | Nom de la collection (ex: « Sahel — 2023 ») |
| `slug` | slug | ✓ | URL `/collections/[slug]` |
| `coverImage` | image | ✓ | Image hero de la page collection |
| `description` | text | — | Introduction courte (Bazan parle de sa démarche) |
| `longText` | array (block content) | — | Texte long : contexte, voyage, making-of |
| `continent` | string (enum) | — | Même valeurs que `artwork.continent` |
| `year` | number | — | Année principale de la série |
| `featured` | boolean | — | Affichée en premier dans les listes |

---

## Schéma : `about` (singleton)

Un seul document de ce type. Contenu de la page `/a-propos`.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `name` | string | ✓ | « Bazan Togola » (modifiable si pseudonyme) |
| `tagline` | string | ✓ | « Le Poète Oculaire » |
| `portrait` | image (hotspot) | ✓ | Portrait grand format noir et blanc |
| `shortBio` | text | ✓ | 3 paragraphes — version courte |
| `artistStatement` | array (block content) | ✓ | Démarche artistique, 4-5 paragraphes |
| `exhibitions` | array of object | — | Timeline : `{ year, title, location, description }` |
| `distinctions` | array of object | — | Résidences, prix : `{ year, title }` |
| `manifesto` | string | — | Citation forte mise en page comme manifeste |

---

## Schéma : `legalPage` (singleton par page)

Pages légales éditables : CGV, mentions légales, vie privée, livraison.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `title` | string | ✓ | Titre de la page (ex: « Conditions générales de vente ») |
| `slug` | string (fixed) | ✓ | `'conditions-generales-de-vente'`, `'mentions-legales'`, etc. |
| `content` | array (block content) | ✓ | Contenu Markdown-like via Portable Text |
| `lastUpdated` | date | — | Date de dernière mise à jour affichée en bas de page |

Créer quatre instances de ce schéma : CGV, mentions légales, politique de confidentialité, livraison et retours.

---

## Schéma : `magazine`

Représente un numéro de la revue MoreArt Mag.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `title` | string | ✓ | Numéro et thème (ex: « MoreArt #01 — Renaissance ») |
| `slug` | slug | ✓ | URL `/magazine/[slug]` |
| `coverImage` | image | ✓ | Couverture du magazine |
| `pdfFile` | file | ✓ | Le fichier PDF pour téléchargement après achat |
| `description` | text | — | Résumé du contenu |
| `price` | number | ✓ | Prix en CAD (synced via Supabase) |
| `previewImages` | array of image | — | 3-5 images pour le slider d'aperçu |

---

## Schéma : `project`

Pour les expositions, résidences et projets artistiques.

| Champ | Type Sanity | Requis | Notes |
|---|---|---|---|
| `title` | string | ✓ | Nom du projet |
| `slug` | slug | ✓ | URL `/projets/[slug]` |
| `type` | string (enum) | ✓ | `'exposition'`, `'residence'`, `'commission'`, `'autre'` |
| `date` | string | — | Période (ex: « Été 2024 ») |
| `location` | string | — | Galerie ou ville |
| `coverImage` | image | ✓ | Image principale |
| `content` | array (block content) | ✓ | Texte narratif du projet |
| `gallery` | array of image | — | Photos de l'évènement ou des coulisses |

---

## Sync automatique Sanity → Supabase

Quand Bazan publie une nouvelle œuvre dans Sanity Studio, un webhook Sanity envoie un événement à `/api/sanity-artwork-sync`.

### Ce que fait le webhook

1. Reçoit le document `artwork` publié (avec ses `sizes[]`)
2. Pour chaque taille dans `sizes[]`, vérifie si une ligne existe déjà dans `artwork_stock`
3. Si elle n'existe pas → crée la ligne avec `stock = 0`, `price_cents = 0`, `currency = 'CAD'`
4. Si elle existe déjà → ne touche à rien (idempotent)
5. Retourne 200

### Ce que ça donne côté admin

L'œuvre apparaît immédiatement dans `/admin/oeuvres` avec un badge **"À configurer"** (rouge). Bazan clique sur "Modifier le stock / prix" et renseigne le prix et le stock. Le badge disparaît.

### Variables d'environnement requises

```
SANITY_WEBHOOK_SECRET=   # vérifié dans /api/sanity-artwork-sync et /api/revalidate
```

---

## Configuration Sanity Studio

### Emplacement
`sanity/` à la racine du projet Next.js. Fichier principal : `sanity/sanity.config.ts`.

### Structure des fichiers
```
sanity/
├── sanity.config.ts        point d'entrée Studio
├── schemas/
│   ├── index.ts            export de tous les schemas
│   ├── artwork.ts
│   ├── collection.ts
│   ├── about.ts
│   └── legal-page.ts
└── lib/
    └── client.ts           client Sanity (réexporté depuis src/lib/sanity/)
```

### Variables d'environnement nécessaires
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=          # lecture/écriture, jamais exposé côté client
SANITY_WEBHOOK_SECRET=     # vérifié dans /api/revalidate
```

### Accès Studio
Route `/studio` protégée par le middleware Next.js — seuls les emails de `ADMIN_EMAILS` y ont accès. Bazan s'authentifie via son compte Sanity.

---

## Données de seed Sanity

Pour le développement, créer au moins :
- **2 œuvres de type `photo`** avec `availableInShop: true`, 2 tailles chacune
- **1 œuvre de type `peinture`** avec `availableInShop: true`, 1 taille unique
- **1 collection** qui regroupe les 2 photos
- **Le singleton `about`** avec les champs obligatoires remplis (texte factice pour dev)

Ces données sont créées manuellement dans Sanity Studio après initialisation. Le vrai contenu de Bazan remplace les données de dev avant le lancement.
