# Feature : Iris Hero

La signature visuelle de MoreArt Mag. Le visiteur traverse l'iris du poète pour entrer dans son univers.

## Quatre phases au scroll

| Phase            | % scroll | Action                                          | Hauteur scroll virtuelle |
| ---------------- | -------- | ----------------------------------------------- | ------------------------ |
| 1 — Le regard    | 0-30%    | Iris idle, micro-saccades, respiration subtile  | environ 30vh             |
| 2 — Dilatation   | 30-70%   | La pupille s'agrandit progressivement           | environ 80vh             |
| 3 — Traversée    | 70-93%   | La pupille remplit l'écran (portail noir plein) | environ 30vh             |
| 4 — L'autre côté | 93-100%  | Fade vers la grille des univers                 | environ 20vh             |

Au total, la section reste épinglée (`pinned`) pendant environ 160vh de scroll virtuel pour donner ce pacing cinématique.

## Composant et fichiers attendus

- `src/components/three/iris-hero.tsx` : composant principal, client component
- `src/components/three/iris-shader.ts` : fragment shader GLSL pour dessiner l'iris procéduralement
- `src/components/three/scroll-portal.tsx` : composant de la phase 4 (fade vers la suite)
- `src/hooks/use-scroll-progress.ts` : hook qui retourne la progression normalisée 0-1

## Approche technique

L'iris est dessiné via un **fragment shader custom** (pas une image statique). Avantages :

- Animation fluide des fibres sans morph d'image
- Pupille redimensionnable sans pixellisation
- Léger en bande passante

Le shader prend en uniformes : le temps, le rayon de la pupille (driven par GSAP ScrollTrigger), la couleur principale de l'iris, et une texture de bruit pour les fibres.

L'animation au scroll est pilotée par GSAP ScrollTrigger en mode `scrub`, avec la section `pin`-ée. Pas de scroll auto, tout est driven par le scroll de l'utilisateur.

## Animations idle (phase 1)

Pendant la phase 1, l'œil doit avoir l'air vivant, pas figé en attente. Trois mécaniques :

1. **Drift** : déplacement subtil basé sur des sinusoïdes à fréquences différentes (effet "regard qui erre")
2. **Breathing** : variation de scale de ±1.5% à fréquence respiratoire (~12 cycles/minute)
3. **Saccades** : déplacements brefs et aléatoires (durée ~80ms) à fréquence rare (1 toutes les 3-5 secondes)

Toutes ces animations s'atténuent progressivement quand le scroll commence (la phase 2 prend le relais).

## Performance

- LCP : la section ne doit pas être le LCP. Servir une image hero préchargée (`Image priority`) en arrière-plan, le canvas s'active au mount par-dessus
- Mobile : DPR cap à 2, ne pas activer les saccades (économie batterie)
- Bundle : code-split le composant avec `dynamic` et `ssr: false`

## Mobile

Sur viewport < 768px :

- Canvas pleine largeur, hauteur 100vh
- Saccades désactivées
- Phases identiques mais `scrub` plus réactif (`0.5` au lieu de `1`)
- Beyond grid en 2 colonnes au lieu de 4

## Accessibilité

Quand `prefers-reduced-motion` est actif :

- Skip toute la chorégraphie
- Afficher une image statique de l'iris en fond
- Au scroll, fade-in classique vers la beyond grid après 50vh
- `aria-label` descriptif sur la section
- Skip link en haut : "Aller au contenu principal" qui focus directement la beyond grid

## Sound design (V1.5, optionnel)

Trois couches audio activables par toggle (mute par défaut, jamais d'auto-play) :

1. Drone tonal grave en boucle pendant la phase 1
2. Respiration profonde qui s'amplifie en phase 2
3. Whoosh + silence en phase 3
4. Léger souffle de réverb en phase 4

Si activé : utiliser Howler.js, fade selon la progression. Toggle persistant via cookie.

## Navigation et hero

La nav principale (logo + menu + panier) **n'apparaît pas** pendant le hero iris. Elle apparaît en fade-in (600ms ease-out) **au moment où la section hero se termine**, puis devient `sticky` pour le reste du scroll.

Sur les pages internes (toutes sauf `/`), la nav est visible et sticky dès le chargement.

### Première visite vs retour

Utiliser `sessionStorage` pour mémoriser que le visiteur a déjà traversé l'iris.

- **Première visite dans la session** : le hero joue intégralement
- **Retours suivants à `/` dans la même session** : la home affiche directement la beyond grid avec la nav, sans rejouer le hero (juste un fade-in court)
- **Nouvelle session** (nouveau navigateur, navigation privée, ou plus tard) : le hero rejoue

Clé sessionStorage suggérée : `moreartmag.iris_traversed = "true"`

### Comportement pendant le hero

Pendant que le hero joue :

- Aucun élément de nav visible (pas de logo, pas de menu)
- Optionnel : un très discret indicateur de scroll en bas de l'écran (`↓`) qui disparaît au premier scroll
- Pas de skip link visible visuellement, mais accessible au clavier (focus-visible) pour l'accessibilité

### Apparition de la nav

Au moment où le scroll dépasse la fin du hero (~95% de la progression) :

- Fade-in du conteneur nav de 0 à 1 en 600ms ease-out
- Position `sticky top-0` dès l'apparition
- Fond légèrement transparent avec backdrop-blur subtil pour rester muséal

## Tests à passer avant validation

- 60fps stables sur iPhone 13 Safari iOS
- 60fps stables sur Pixel 7 Chrome Android
- LCP < 2.5s sur 4G simulée
- Pas de FOUC au chargement
- Reduced motion fonctionnel et testé
- Resize navigateur (transitions desktop ↔ mobile) sans crash
- Back button après avoir scrollé : retour propre
- Première visite : hero joue, nav absente puis apparaît à la fin
- Retour à `/` dans la même session : pas de rejeu du hero, nav visible directement
- Nouvelle session (vider sessionStorage) : le hero rejoue normalement

## Assets à fournir (par Abba ou Bazan)

- `public/iris-hero.jpg` : image statique fallback (1920×1080, ~150 KB après compression)
- `public/iris-hero-mobile.jpg` : version mobile (750×1334, ~80 KB)
- `public/textures/iris-noise.png` : texture procédurale pour les fibres (512×512, tilable)

Voir `prompts/NANO_BANANA.md` pour les prompts de génération.

## Beyond Grid (phase 4 — l'autre côté)

Après la traversée, le visiteur arrive dans une grille minimaliste 2×2 desktop / 1×4 mobile menant aux 4 univers :

- Photographies
- Peintures
- Boutique
- Le poète

Chaque carte a une image d'aperçu, un titre court, une tagline italique. Hover : léger zoom de l'image et apparition de la flèche d'entrée.

Important : cette grille doit apparaître **en fade** (opacité 0 à 1 en 700ms) après la phase 3, pas en slide ou en bounce. Le contraste avec l'intensité de la traversée doit être un calme retrouvé.
