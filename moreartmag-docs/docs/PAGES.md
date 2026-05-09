# Spécification des pages

Pour chaque page : route, but, sections, comportement, données nécessaires.

## `/` — Hero d'entrée

But : créer le coup de cœur, faire entrer le visiteur dans l'univers de Bazan.

Section unique mais riche :

- Hero plein écran : iris du poète qui se dilate au scroll (voir `features/IRIS_HERO.md`)
- Une fois traversé : grille minimaliste 2×2 menant aux 4 univers
  1. Photographies → `/moreart?type=photo`
  2. Peintures → `/moreart?type=peinture`
  3. Boutique → `/boutique`
  4. Le poète → `/a-propos`
- Footer minimal avec contact + Instagram

**Navigation** : la nav principale n'est pas affichée pendant le hero. Elle apparaît en fade-in au moment où le hero se termine, puis devient sticky. Voir `features/IRIS_HERO.md` section "Navigation et hero" pour le détail (sessionStorage, première visite vs retour).

Données : aucune (statique sauf compteur d'œuvres optionnel via Sanity).

Performance critique : LCP sous 2.5s. Servir une image iris hero en `Image priority` avant que React Three Fiber prenne le relais.

## `/moreart` — Galerie principale

But : présenter toutes les œuvres dans une expérience contemplative.

Sections :

- Header avec eyebrow MOREART, titre "L'œuvre du poète", intro 2 phrases
- Barre de filtres sticky :
  - Type : Tout / Photo / Peinture
  - Continent : Tout / Afrique / Europe / Autre
  - Année : dropdown
  - Tri : récent / ancien / populaire
- Grille responsive (1, 2 ou 3 colonnes)
- Lazy load au scroll via Intersection Observer
- Lightbox au clic sans changer de route, avec swipe mobile
- Bouton "Voir le détail" dans la lightbox vers la page de détail

Données : fetch Sanity avec filtres et pagination.

## `/boutique` — Œuvres en vente

But : sous-ensemble de `/moreart`, uniquement les œuvres avec stock disponible.

Différences avec `/moreart` :

- Carte affiche le prix (à partir de X $ si plusieurs tailles)
- Badge "Édition limitée X/Y restants" pour les tirages
- Badge "Pièce unique" pour les peintures originales
- Filtre supplémentaire : "Disponible uniquement"
- Tri par défaut : nouveautés en boutique

Données : Sanity (œuvres avec `availableInShop = true`) jointes au stock Supabase.

## `/oeuvres/[slug]` — Détail d'une œuvre

But : la page qui convertit. Contemplation puis projection puis achat.

Layout desktop : split 60/40

- Gauche (60%) : image principale, swipe entre images de l'œuvre, zoom au clic
- Droite (40%) :
  - Eyebrow type + collection
  - Titre
  - Année, lieu, dimensions originales
  - Description (paragraphe court de Bazan)
  - Sélecteur de taille (si applicable) qui change le prix en live
  - Prix dynamique
  - Indication stock : "Édition de 30, 12 restants" ou "Pièce unique"
  - Bouton "Visualiser dans une pièce" qui ouvre la modale Room Preview
  - Bouton "Ajouter au panier" (primaire)
  - Bouton fantôme : "Demander une commission similaire"
  - Accordéons : Détails techniques / Livraison / Authenticité

Layout mobile : stack vertical, image en premier.

Sections additionnelles plus bas :

- "À propos de cette œuvre" : texte plus long de Bazan, contexte
- Œuvres liées (même collection ou même continent) : 3 ou 4 cartes
- CTA contact : "Encore intéressé ? Demander à Bazan une œuvre sur mesure"

Données : Sanity (œuvre + œuvres liées) + Supabase (stock par taille).

SEO : structured data Product schema, OG dynamique par œuvre.

## `/collections/[slug]` — Sous-galerie

But : présenter une série spécifique (ex: "Sahel — 2023").

Sections :

- Hero : image bannière + titre collection + texte d'introduction de Bazan
- Grille des œuvres de cette collection
- Section "Le contexte" : texte long de Bazan, peut inclure photos, citations
- "Découvrir une autre série" : carrousel des autres collections

Données : Sanity (collection + œuvres référencées).

## `/a-propos` — Bazan Togola

But : raconter l'humain derrière l'œuvre. Crédibilité plus connexion émotionnelle.

Sections (scroll narratif) :

1. Portrait grand format en noir et blanc + nom + tagline "Le Poète Oculaire"
2. Bio courte (3 paragraphes)
3. Démarche artistique (4 ou 5 paragraphes)
4. Parcours / expositions / publications (timeline ou liste)
5. Distinctions / résidences (si applicable)
6. Citation forte mise en page comme un manifeste
7. **Section "Vision"** : Galerie narrative avec carrousel photo varié (mix de formats, textures, noir et blanc) illustrant la philosophie du Poète Oculaire.
8. CTA : "Lui écrire" vers `/contact`

Données : Sanity (singleton `about` avec champs structurés).

## `/contact` — Contact + commission

But : faciliter la prise de contact en filtrant le type de demande.

Layout 50/50 desktop, stack mobile.

Gauche :

- Eyebrow + titre + intro
- Adresse email (mailto)
- Réseaux sociaux
- Adresse atelier (optionnel)
- Délai de réponse moyen

Droite : formulaire avec :

- Type de demande (radio) : Question générale / Commission sur mesure / Presse / Galerie
- Nom, email, téléphone (optionnel)
- Sujet
- Message
- Si commission : champs supplémentaires (budget approximatif, taille souhaitée, référence d'œuvre)
- **Type de projet** (dropdown) : Mariage / Portrait / Commercial / Projet Artistique

Données : POST vers `/api/inquiries` qui insert dans Supabase et envoie un email à Bazan via Resend.

Validation : Zod côté client et serveur. Honeypot et rate limit (5 requêtes/heure par IP).

## `/panier` — Récapitulatif

But : revue avant checkout, ajustement des quantités.

Sections :

- Liste des items avec image, titre, taille, édition, prix unitaire, quantité modifiable, total ligne
- Récap totaux : sous-total, livraison estimée, taxes (calculées au checkout Stripe), total
- Champ "Code promo" (V2)
- Bouton "Passer commande" qui POST vers `/api/checkout`
- Lien "Continuer à explorer" vers `/moreart`

Données : Server Component qui lit `cart_items` Supabase si user connecté, sinon store Zustand + localStorage côté client.

## `/checkout` (route handler, pas une page)

But : créer la session Stripe et rediriger.

C'est une route handler dans `app/(shop)/checkout/route.ts` qui valide le panier (stock dispo, prix corrects), crée une Stripe Checkout Session avec line items et taxes, et retourne l'URL de redirection.

## `/commande/[id]` — Confirmation

But : rassurer après paiement, donner les prochaines étapes.

Sections :

- Icône succès + "Merci pour votre acquisition"
- Numéro de commande (MAM-2026-0042)
- Récap des œuvres achetées (avec images)
- Adresse de livraison
- Délais : "Préparation 3-5 jours, livraison 5-10 jours"
- Email de confirmation envoyé à X
- CTA : retour `/moreart` ou "Suivre ma commande"

Données : lit `orders` Supabase via `id`. Vérifier que `user_id` matche ou que le param contient un token signé pour les invités.

## `/magazine` — Kiosque numérique

But : vendre des versions numériques (PDF) du MoreArt Mag.

Sections :
- Grille des numéros parus (Couverture, Titre, Thème)
- Prix unique ou par numéro
- Aperçu de quelques pages (flipbook ou slider)
- Bouton "Acheter le PDF" (intégration Stripe sans shipping)

## `/projets` — Archives et Expositions

But : documenter les projets d'art et les évènements passés.

Sections :
- Grille de projets (Expositions, Résidences, Séries documentaires)
- Page détail par projet : Galerie d'images, texte de démarche, partenaires.

## `/admin/*` — Panel Bazan

Voir `features/ADMIN.md` pour la spec complète.

Routes principales :

- `/admin` : dashboard avec KPIs
- `/admin/oeuvres` : liste des œuvres + édition stock
- `/admin/commandes` : liste des commandes + statuts
- `/admin/messages` : demandes reçues via le formulaire de contact
- `/admin/parametres` : compte + intégrations

## Pages utilitaires

À prévoir dès la V1 :

- `/mentions-legales`
- `/conditions-generales-de-vente`
- `/politique-de-confidentialite`
- `/livraison-et-retours`
- `/404` (custom : iris triste qui se ferme, lien retour accueil)
- `/500`

Toutes ces pages utilisent un layout simple en prose avec contenu Markdown depuis Sanity (un singleton par page légale, éditable par Bazan).
