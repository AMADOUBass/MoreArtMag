# Prompts Nano Banana

Tous les prompts pour générer les assets visuels du site avec Nano Banana (ou un équivalent : Midjourney, Imagen, Flux). Adapter la formulation selon l'outil mais l'intention reste la même.

## Conseil général

- Génère toujours plusieurs variantes (5 à 10) et garde la meilleure
- Sors en haute résolution (2048×2048 minimum pour les images centrales, 3840×1620 pour les bannières), tu downscaleras pour le web
- Reste cohérent visuellement : palette chaude terre, lumière cinématique, esthétique organique

## Iris hero principal

Le money shot du site. Génère 5-10 variantes, choisis la plus expressive.

```
Extreme macro close-up of a single human iris, hazel-amber color 
with golden flecks and visible radial brushstroke-like fibers, 
deep velvet-black pupil perfectly centered, single warm catchlight 
at upper-left position simulating window light, ultra sharp detail, 
cinematic studio lighting with subtle warm amber rim, pure black 
background, square 1:1 aspect ratio, photorealistic with painterly 
quality, no skin visible, just the iris filling the frame
```

Variantes de couleur à tester (change juste la teinte) :
- "deep brown iris with copper highlights" — version chaude, terre
- "green-gold iris with emerald depths" — version froide, mystérieuse
- "dark amber iris with red undertones" — version dramatique, intense

Conseil : la version qui "matche le mieux Bazan" est celle qui parle au visiteur dès le premier regard. Si Bazan accepte de prêter son vrai œil, fais une macro photo (50mm + tubes-allonge) — c'est imbattable conceptuellement.

## Texture fibres iris (pour shader animé)

```
Radial fiber pattern of a human iris, isolated on pure black 
background, fine hair-like strands radiating from center outward, 
sepia and amber tones, high contrast, suitable as a tileable 
texture map, seamless edges, 512x512 square format
```

Ce fichier doit être tilable (sans coutures visibles). Si Nano Banana ne le rend pas tilable, le passer dans Photoshop avec le filtre "Offset" + retouches manuelles.

## Lens distortion / portail (transition phase 3)

```
Abstract circular lens flare, radial light streaks emanating from 
a black center, warm amber and gold tones gradually fading to 
pure black at the edges, dreamlike ethereal quality, cinematic, 
on pure black background, square format
```

Sert pour l'effet visuel au moment où la pupille devient un portail plein écran.

## Bannières par continent (pour les pages collections)

Format paysage très large, 3840×1620 px, pour les hero des pages collections.

### Afrique

```
Photography portfolio header banner, West African landscape, 
dusty warm tones, atmospheric haze, golden hour lighting, 
painterly photographic style, evocative not literal — focus on 
mood and color rather than recognizable landmarks, ultra wide 
21:9 cinematic aspect ratio
```

### Europe

```
Photography portfolio header banner, European architecture, 
moody overcast light, muted earth tones, painterly photographic 
style, evocative not literal, ultra wide 21:9 cinematic aspect 
ratio, contemplative atmosphere
```

### Autre continent (à adapter selon les voyages de Bazan)

Adapter le prompt en gardant la même structure : un mood-board visuel, pas une carte postale.

## Bibliothèque de pièces (room preview)

Si Bazan ne photographie pas lui-même les pièces, générer 6 intérieurs neutres :

### Salon scandinave

```
Interior photography of a Scandinavian living room, white walls, 
oak wood floor, minimalist furniture (one sofa, one coffee table), 
large empty wall on the right side ready to display artwork, 
soft natural daylight from a window on the left, warm wood tones, 
no existing artwork on walls, 16:10 aspect ratio, photorealistic
```

### Chambre minimaliste

```
Interior photography of a minimalist bedroom, neutral beige walls, 
single bed with white linen, one wooden nightstand, large empty 
wall behind the bed ready to display artwork, soft morning light, 
calm atmosphere, no existing artwork, 16:10 aspect ratio, 
photorealistic
```

### Bureau / espace de travail

```
Interior photography of a writer's home office, dark wood desk, 
brass lamp, leather chair, large empty wall on the side ready to 
display artwork, warm late afternoon light, intellectual 
atmosphere, no existing artwork, 16:10 aspect ratio, photorealistic
```

### Couloir / entrée

```
Interior photography of a stylish hallway entrance, white walls, 
console table with a vase of dried flowers, large empty wall 
ready to display artwork, soft diffused light, refined 
atmosphere, no existing artwork, 16:10 aspect ratio, photorealistic
```

### Salle à manger

```
Interior photography of a dining room, dark wood table with 
linen runner, simple ceramic plates, large empty wall on the 
side ready to display artwork, evening warm light, intimate 
atmosphere, no existing artwork, 16:10 aspect ratio, photorealistic
```

### Salon contemporain

```
Interior photography of a contemporary urban living room, 
concrete walls, modern leather sofa, large empty wall ready 
to display artwork, soft cool daylight from large windows, 
sophisticated atmosphere, no existing artwork, 16:10 aspect 
ratio, photorealistic
```

**Important** : insister sur "no existing artwork on walls" sinon Nano Banana met systématiquement un tableau pré-existant que tu devras effacer.

## Page 404 — iris triste

```
A single human iris closing slowly, half-closed eyelid covering 
the iris from above, melancholic mood, warm amber tones, deep 
black pupil partially visible, cinematic lighting, pure black 
background, square format
```

À utiliser sur la page 404 avec un texte sobre : « L'œil s'est fermé sur cette page. Retourner à l'accueil. »

## Beyond Grid — les 4 univers (cartes après traversée)

Après la traversée de l’iris, le visiteur arrive sur une grille 2×2 avec 4 cartes. Chaque carte a une image d’aperçu qui doit être forte, reconnaissable, et cohérente avec l’univers de Bazan.

> Format : **1200×1500 px** (ratio 4:5 — même ratio que les cartes de la galerie). Fond sombre, tons chauds.

### Photographies

```
Fine art photography editorial image, moody cinematic still, 
documentary portrait of West African daily life, warm amber 
and sepia tones, shallow depth of field, poetic not literal, 
film grain texture, dark atmospheric background, 4:5 portrait 
aspect ratio
```

### Peintures

```
Detail shot of an expressive oil painting in progress, 
pigment textures visible, warm earth tones (ochre, sienna, 
burnt umber), painterly impasto technique, close-up of 
brushed surface, dark studio background, 4:5 portrait 
aspect ratio, fine art gallery aesthetic
```

### Boutique

```
Minimalist still life, framed fine art print leaning against 
a dark wall, warm ambient light from the side, elegant 
presentation, copper frame details, museum-quality paper 
texture visible, sophisticated gallery atmosphere, 4:5 
portrait aspect ratio
```

### Le poète (page à propos)

```
Artist portrait, Black male photographer in his studio, 
abstract atmospheric, dramatic chiaroscuro lighting with 
warm amber tones, camera visible, contemplative expression, 
cinematic quality, dark background, 4:5 portrait aspect ratio
```

> Si Bazan fournit de vraies photos pour ces cartes, elles remplaceront les images générées. Les prompts ci-dessus servent de placeholder pour le développement.

## OG images dynamiques

Pour les œuvres individuelles, générer dynamiquement l'OG via la route `/api/og?slug=...` (Next.js OG image generation). Pas besoin de Nano Banana pour ça : c'est composé en HTML/CSS côté serveur.

Mais pour les **OG par défaut** (homepage, à propos, contact) :

```
Brand identity image for "MoreArt Mag" by Bazan Togola, photographer 
and painter, dark warm black background, copper amber accent color, 
abstract suggestion of an iris in the center fading to black edges, 
sophisticated minimalist composition, 1200x630 aspect ratio for 
social media share
```

## Logo / signature

Si Bazan n'a pas encore de logo :

```
Minimalist logotype for "MoreArt Mag", elegant serif typography 
in warm white on black background, subtle copper amber accent dot 
or underline, museum gallery aesthetic, sophisticated and 
contemplative, multiple variations
```

Génère plusieurs versions, soumets-en 3 à Bazan pour qu'il choisisse.

## Workflow recommandé

1. Génère tous les assets en haute résolution
2. Trie : garde uniquement les meilleurs (si tu génères 10 iris, tu en gardes 1 ou 2)
3. Édite si besoin : Photoshop pour les retouches fines, Squoosh ou ImageOptim pour la compression
4. Place dans `public/` selon la structure attendue par les composants
5. Pour les images du CMS Sanity (œuvres), Bazan les uploade lui-même via Sanity Studio
