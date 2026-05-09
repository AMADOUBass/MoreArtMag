# Feature : Room Preview (visualisation in-situ)

Permet au visiteur de voir une œuvre dans une pièce réelle, à la vraie échelle selon la taille choisie. Feature commerciale clé pour convertir.

## Pourquoi cette feature

L'acheteur d'une œuvre d'art en ligne a une grande objection : « est-ce que ça va aller chez moi, à la bonne taille ? ». La room preview répond avant que l'objection ne fasse fuir.

## Approche choisie

Trois approches étaient possibles :

1. AR mobile native (WebXR) — trop lourd pour V1, demande beaucoup de surface vide
2. Scène 3D complète (Three.js avec pièce 3D modélisée) — surinvestissement
3. **Photo de pièce + projection CSS perspective** — léger, instantané, marche partout ✓

On choisit l'approche 3.

## Concept

1. Une bibliothèque de pièces est stockée en base de données (table `room_presets`) : chaque pièce a une photo haute résolution et les coordonnées du quadrilatère du mur (4 points en perspective).
2. Le visiteur choisit une pièce dans un picker.
3. Il choisit une taille de tableau (ex: 60×90 cm) dans le sélecteur de l'œuvre.
4. Le système calcule où placer le tableau sur le mur en respectant :
   - Centre du mur par défaut
   - Échelle réelle : si le mur fait 320 cm de large, un tableau de 90 cm représente environ 28% de la largeur du mur dans l'image
   - Perspective : le tableau suit la déformation du mur via une matrice CSS 3D
5. Le tableau apparaît en surimpression avec une ombre portée pour le réalisme.

## Composants attendus

- `src/components/shop/room-preview.tsx` : modale principale
- `src/components/shop/room-picker.tsx` : sélecteur de pièces (carrousel horizontal de miniatures)
- `src/lib/utils/perspective.ts` : utilitaire de calcul de la matrice de perspective

## Calcul de perspective

Pour calculer la projection, on a besoin d'une **homographie** : une matrice 3×3 qui mappe un rectangle source (le tableau) vers un quadrilatère destination (sa position projetée sur le mur).

L'algorithme prend en entrée :
- Les 4 coins du mur (en coordonnées normalisées 0-1 dans l'image de la pièce)
- Les dimensions réelles du mur en cm
- Les dimensions du tableau en cm
- La position relative du tableau (centré par défaut)

Et calcule :
- Les 4 coins du tableau en coordonnées image (interpolation bilinéaire dans le quadrilatère du mur)
- La matrice de transformation CSS qui projette un rectangle source vers ces 4 coins

Recommandation : utiliser la lib npm `perspective-transform` qui expose exactement cette résolution. Pas besoin d'écrire les maths à la main.

## UX flow

1. Sur la page d'une œuvre, l'utilisateur sélectionne une taille
2. Le bouton "Visualiser dans une pièce" devient actif
3. Au clic, ouverture d'une modale plein écran (mobile) ou large dialog (desktop)
4. Image de la première pièce avec l'œuvre projetée
5. En bas, picker horizontal des autres pièces
6. Légende sous l'image : "Format affiché : 60 × 90 cm dans un salon de 320 cm de large"
7. Boutons : "Ajouter au panier" + "Changer de taille" (referme et revient au sélecteur)

## Bibliothèque de pièces (à fournir par Abba ou Bazan)

Pour le lancement, prévoir 6 pièces couvrant les cas d'usage :
1. Salon contemporain clair
2. Salon scandinave
3. Chambre minimaliste
4. Bureau / espace de travail
5. Couloir / entrée
6. Salle à manger

Spécifications photos :
- 4000×2500 px minimum (downscale ensuite)
- Mur principal bien éclairé, sans tableau pré-existant
- Angle légèrement frontal (10-20°), pas trop oblique
- Format paysage 16:10
- Style neutre : pas de couleurs criardes, mobilier minimaliste

Sources possibles :
- Photos prises par Bazan lui-même (idéal car son style)
- Unsplash ou Pexels (filtrer "interior" et "minimal", choisir CC0)
- Adobe Stock pour qualité pro (~30 $/photo)

## Calibration du mur (étape critique)

Pour chaque photo, il faut identifier les 4 coins du mur dans l'éditeur admin :

1. Affichage de la photo
2. L'admin clique 4 coins dans l'ordre (haut-gauche, haut-droit, bas-droit, bas-gauche)
3. Saisie de la largeur et hauteur réelles du mur en cm
4. Sauvegarde des coordonnées en base de données

Outil recommandé : `react-easy-crop` ou un canvas custom avec 4 markers draggables.

## Tests visuels avant validation

- Tableau 40×60 dans salon 320 cm de large : doit faire ~12.5% de la largeur du mur
- Tableau 90×120 dans même salon : doit faire ~28%, visiblement plus grand
- Changer de pièce : transition fluide, pas de flash blanc
- Mobile : la modale prend tout l'écran, pinch-zoom OK sur l'œuvre
- Œuvres très allongées (panoramique) : ratio respecté, pas de déformation aberrante

## Performance

- Photos pièces servies via `next/image` (formats AVIF/WebP, sizes responsives)
- Calcul de perspective côté client (rapide, JS pur, sous 1ms)
- Modale lazy-loaded : import dynamique seulement à l'ouverture
- Pas d'effet temps réel sur scroll : recalcul uniquement au changement de taille ou de pièce

## Améliorations V2

- Repositionnement libre de l'œuvre (drag) sur le mur
- Plusieurs œuvres simultanément (galerie de famille)
- Upload par l'utilisateur de sa propre photo de mur + calibration assistée
- Mode AR mobile pur (WebXR) pour smartphones compatibles
- Suggestion automatique de taille selon les dimensions du mur
