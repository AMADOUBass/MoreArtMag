# Design System

Source de vérité visuelle. Tout composant doit utiliser ces tokens.

## Principes directeurs

1. **L'œuvre d'abord.** L'UI s'efface devant les images.
2. **Lent et large.** Espacement généreux, animations posées (300-600ms ease-out).
3. **Chaud et tactile.** Couleurs terre, textures discrètes, jamais de néon.
4. **Muséal, pas commercial.** Pas de soldes criards, pas d'urgence artificielle, pas de pop-up.
5. **Mobile-first.** Tout doit être beau et fonctionnel à 375px.

## Couleurs

### Backgrounds

- Primaire : `#0a0604` (noir chaud profond, fond du site)
- Secondaire : `#14100c` (presque noir, légèrement plus clair)
- Tertiaire : `#1f1813` (cards, modals)
- Elevated : `#2a221b` (états hover, panels)

### Texte

- Primaire : `#f5efe6` (blanc chaud)
- Secondaire : `#c9bfb0` (gris chaud)
- Muted : `#7a6a5a` (taupe poussiéreux)
- Inverse (texte sur fond clair, rare) : `#0a0604`

### Accent (couleur signature)

- Accent : `#c08855` (cuivre ambre)
- Accent hover : `#d49a65`
- Accent muted : `#8a5d38`

### Status

- Success : `#6b8e5a`
- Warning : `#c89052`
- Error : `#a04030`
- Info : `#5a7a8e`

### Borders et overlays

- Border subtle : blanc chaud à 8% d'opacité
- Border default : blanc chaud à 14%
- Border strong : blanc chaud à 24%
- Overlay light : noir à 40%
- Overlay medium : noir à 70%
- Overlay heavy : noir à 90%

## Typographie

### Polices

- **Display** (titres, citations) : Cormorant Garamond, italique pour les taglines
- **Sans** (corps, UI) : Inter variable
- **Mono** (rare, légales/techniques) : JetBrains Mono

Charger via Google Fonts ou en self-hosting dans `public/fonts/`. Toujours `font-display: swap`.

### Échelle responsive (mobile / desktop)

| Token | Mobile | Desktop | Usage |
|---|---|---|---|
| 2xs | 10px | 11px | légales, métadonnées |
| xs | 12px | 12px | labels, captions |
| sm | 13px | 14px | corps secondaire |
| base | 15px | 16px | corps principal |
| lg | 17px | 18px | intros, lead |
| xl | 20px | 22px | sous-titres |
| 2xl | 24px | 28px | titres section |
| 3xl | 30px | 36px | titres page |
| 4xl | 38px | 48px | titres hero |
| 5xl | 48px | 64px | display |
| 6xl | 60px | 96px | hero massif |

### Hiérarchie

- `h1` et `h2` : police display, weight 400, letter-spacing serré (-0.015 à -0.02em)
- `h3` : police sans, weight 500
- Tagline : police display italique, couleur secondaire
- Eyebrow : taille xs, letter-spacing 0.18em, uppercase, couleur muted

## Espacement (échelle 4px)

Échelle : 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160 px.

Règle : entre sections majeures, au moins 96px desktop / 64px mobile. Le site doit respirer.

## Border radius

- none : 0
- sm : 2px (œuvres, cartes d'art — l'art ne doit pas paraître arrondi consumériste)
- md : 4px (boutons, inputs)
- lg : 8px (containers, modals)
- xl : 16px (rare)
- full : 9999px (avatars, badges)

## Ombres

- subtle : très légère, pour profondeur discrète
- soft : soft shadow standard
- medium : pour cards en hover
- strong : pour modals et drawers
- glow : halo cuivre subtil pour focus accent

## Animation

### Durées

- fast : 150ms (micro-interactions, hover)
- base : 300ms (transitions standard)
- slow : 600ms (entrées de section)
- slower : 1000ms
- cinematic : 1800ms (réservé aux moments forts du hero)

### Easings

- ease-out par défaut : `cubic-bezier(0.16, 1, 0.3, 1)`
- ease-in-out : `cubic-bezier(0.65, 0, 0.35, 1)`
- spring (rebond doux) : `cubic-bezier(0.34, 1.56, 0.64, 1)`
- cinematic (hero) : `cubic-bezier(0.77, 0, 0.175, 1)`

### Règle d'or sur l'accessibilité

Toute animation doit respecter `prefers-reduced-motion`. Mettre une règle CSS globale qui réduit toutes les durées à 0.01ms quand cette préférence est active. Les animations custom (GSAP, R3F) doivent aussi vérifier cette préférence via le hook `useReducedMotion`.

## Composants clés (comportement)

### Bouton primaire

Fond accent, texte sombre, padding généreux, radius medium, transition 300ms ease-out, scale 1.02 au hover, scale 0.98 à l'active, focus visible avec outline accent décalé de 2px.

### Bouton fantôme

Fond transparent, border default, texte primaire, hover : border accent + texte accent.

### Carte d'œuvre

Conteneur cliquable avec image en aspect 4:5, radius sm, fond secondaire pour le placeholder. Au hover : scale 1.05 sur l'image avec transition cinematic ease-out. Titre en police display sous l'image, lieu et année en muted, prix en sm.

### Eyebrow + titre de section

Triplet : eyebrow uppercase tracked + titre 4xl + intro 1.125rem max-width 2xl en couleur secondaire.

## Layout

### Container

Largeur max 1440px, centré, padding horizontal 24px mobile / 48px desktop.

### Grid galerie

- 1 colonne mobile (gap 24px)
- 2 colonnes à partir de 640px (gap 32px)
- 3 colonnes à partir de 1024px (gap 48px)

## Iconographie

- Set unique : lucide-react
- Taille par défaut : 20px (24px pour CTAs)
- Stroke 1.5px (plus fin que le défaut, plus muséal)

## États interactifs

| État | Traitement |
|---|---|
| Default | Couleur token de base |
| Hover | Scale 1.02 ou opacity 0.85, transition 300ms |
| Active | Scale 0.98 |
| Focus visible | Outline 2px accent, offset 2px |
| Disabled | Opacity 0.4, cursor not-allowed |
| Loading | Skeleton ou spinner subtil cuivre |

## SEO et Open Graph

Format OG par défaut : 1200×630, fond noir chaud, titre en Cormorant blanc, accent cuivre en surlignage, logo MoreArt Mag en bas.

Générer une OG dynamique par œuvre via la route `/api/og?slug=...`. Inclure : titre, type (photo/peinture), continent, dimensions.
