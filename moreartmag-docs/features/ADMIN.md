# Feature : Panel admin de Bazan

Le panel `/admin/*` est le **point d'entrée unique** de Bazan pour gérer son site. Il ne doit jamais avoir à retenir deux URLs ou deux noms d'outils.

## Décision architecturale (hybride)

On utilise **Sanity Studio pour le contenu** (œuvres, textes, images) et un **panel custom pour le commerce** (commandes, stock, messages). Mais Bazan ne voit qu'un seul endroit : `/admin`.

La page `/admin` est un hub d'accueil avec des boutons en langage non-technique :
- **"Gérer mes œuvres"** → redirige vers `/studio` (Sanity Studio)
- **"Mes commandes"** → `/admin/commandes`
- **"Mes messages"** → `/admin/messages`
- **"Tableau de bord"** → `/admin` (KPIs)

On ne dit jamais "Sanity" à Bazan. On ne dit pas "Studio". On dit "Gérer mes œuvres".

### Deux logins (inévitable)

Bazan a deux comptes :
1. **Supabase Auth** (email + magic link) → accès `/admin/*`
2. **Compte Sanity.io** → accès `/studio`

Solution UX : même adresse email pour les deux. Onboarding vidéo Loom de 3 min qui montre les deux en séquence naturelle.

## Architecture de l'auth (panel custom)

Bazan se connecte via Supabase Auth (email + magic link, pas de mot de passe). Une fois connecté, son profil dans la table `profiles` doit avoir `role = 'admin'`.

La sécurité s'appuie sur trois couches :

1. **Middleware Next.js** (`src/middleware.ts`) qui intercepte toute requête vers `/admin/*` et redirige vers `/login` si la session est absente
2. **Vérification serveur** dans le layout `/admin/layout.tsx` qui re-vérifie le rôle admin (le middleware peut être contourné, le layout non)
3. **Vérification dans chaque Server Action** sensible (modification de stock, changement de statut de commande) qui re-vérifie le rôle admin

C'est volontairement redondant : on ne fait pas confiance à une seule couche.

## Routes admin

> Le langage dans l'UI utilise toujours les termes de Bazan, jamais les termes techniques. Exemples : "Mes œuvres" pas "Artworks", "Mes commandes" pas "Orders", "Modifier" pas "Edit".

### `/admin` — Hub d'accueil et tableau de bord

Première page que Bazan voit après login. Deux zones :

**Zone hub (en haut)** — boutons larges et clairs :
- 📸 **"Gérer mes œuvres"** → lien vers `/studio` (ouvre Sanity Studio)
- 🛒 **"Mes commandes"** → lien vers `/admin/commandes`
- 📩 **"Mes messages"** → lien vers `/admin/messages`

**Zone KPIs (en dessous)** — sur les 30 derniers jours :
- Nombre de commandes
- Chiffre d'affaires
- Œuvres vendues (top 3)
- Messages en attente de réponse
- Stock faible (< 3 unités restantes en édition limitée)

Graphique simple : commandes par jour sur 30 jours.

Liste des 5 dernières commandes et des 5 derniers messages avec lien vers le détail.

### `/admin/oeuvres` — Mes œuvres (stock et prix)

Tableau récapitulatif des œuvres présentes dans Sanity, enrichi des données de stock Supabase. Cette page est dédiée à la **gestion commerciale** (prix, stock, disponibilité en boutique).

Pour chaque œuvre :
- Miniature
- Titre, type, collection
- Tailles disponibles avec stock (ex: "40×60 : 8/30 — 60×90 : pièce unique vendue")
- Prix
- Statut (en boutique, archivée, brouillon)
- Bouton **"Modifier le contenu"** → lien vers la fiche dans Sanity Studio (label non-technique : pas "Ouvrir Sanity")
- Bouton **"Modifier le stock / prix"** → modale pour éditer les valeurs Supabase

Filtres : type, collection, disponibilité, stock faible.

> **Sync automatique** : quand Bazan publie une nouvelle œuvre dans Sanity Studio, un webhook crée automatiquement les lignes `artwork_stock` correspondantes dans Supabase (stock = 0, prix = 0). L'œuvre apparaît immédiatement dans ce tableau avec un badge "À configurer" pour que Bazan renseigne le prix et le stock.

### `/admin/commandes` — Gestion des commandes

Tableau de toutes les commandes avec colonnes :
- Numéro (MAM-2026-0042)
- Date
- Client (nom + email)
- Total
- Statut (avec badge coloré)
- Actions

Filtres : statut, période, recherche par numéro ou nom.

Au clic sur une commande, page de détail `/admin/commandes/[id]` :
- Infos client et adresse de livraison
- Liste des items achetés (avec images)
- Récap financier : sous-total, livraison, taxes, total
- Identifiants Stripe (avec lien vers le dashboard Stripe)
- Sélecteur de statut (paid → shipped → delivered, ou cancelled)
- Champ pour le numéro de suivi (envoyé par email au client quand renseigné)
- Notes admin (privées)
- Historique des changements de statut

Le changement de statut déclenche automatiquement un email au client (via Resend).

### `/admin/messages` — Demandes reçues

Liste des messages reçus via le formulaire `/contact`. Pour chaque message :
- Type (général, commission, presse, galerie)
- Nom et email
- Sujet
- Date
- Statut (nouveau, en cours, répondu, fermé)

Au clic, vue détail :
- Message complet
- Pour les commissions : budget, taille, œuvre de référence
- Bouton "Répondre par email" (mailto pré-rempli)
- Champ notes admin
- Sélecteur de statut

Notification : Bazan reçoit un email à chaque nouveau message via Resend.

### `/admin/rooms` — Gestion des pièces (room preview)

Liste des pièces utilisées pour la room preview. Pour chaque pièce :
- Miniature
- Nom, catégorie
- Bouton "Recalibrer le mur" qui ouvre un éditeur de coins (4 markers draggables sur l'image)
- Bouton "Modifier les dimensions réelles"

Bouton "Ajouter une pièce" :
- Upload d'une photo
- Saisie nom, catégorie
- Calibration des 4 coins du mur (clic sur l'image)
- Saisie largeur et hauteur réelles du mur en cm
- Sauvegarde

### `/admin/parametres` — Configuration

- Profil admin (nom, email, mot de passe)
- Variables d'envoi d'email (signature, template)
- Configuration Stripe (clés en lecture seule, lien vers le dashboard Stripe)
- Liens vers Sanity Studio et le dashboard Vercel
- Logs récents (V1.5)

## Layout admin

Sidebar gauche permanente avec navigation vers les sections. Logo MoreArt Mag en haut. Bouton "Voir le site" pour basculer en preview. Bouton de déconnexion en bas.

Header avec breadcrumb et bouton d'action principal selon la page.

Style : reprend les tokens du design system mais en version "outil" (un peu plus dense, moins poétique). Tableaux soignés, badges colorés selon les statuts, états vides avec illustrations.

## Sécurité critique

- Toute Server Action admin doit vérifier `profile.role === 'admin'` avant toute opération
- Les modifications de stock sont loggées (table `audit_log` à prévoir en V1.5)
- Pas d'accès par défaut : il faut explicitement créer un profil avec role admin via la console Supabase
- Liste blanche d'emails admin dans les variables d'environnement (`ADMIN_EMAILS=bazan@..., abba@...`)

## Tests

- Un utilisateur non connecté qui accède à `/admin` est redirigé vers `/login`
- Un utilisateur connecté avec `role = 'customer'` qui accède à `/admin` reçoit une 403
- Un admin peut modifier le stock d'une œuvre, le changement est immédiatement visible côté client
- Un admin change le statut d'une commande de `paid` à `shipped`, le client reçoit l'email de notification
- Suppression d'une pièce de room preview : confirmation requise, pas de cascade vers les commandes existantes

## Onboarding Bazan

Deux logins à retenir (même email recommandé) :
1. **moreartmag.art/login** → magic link email → accès à tout le panel admin
2. **Sanity Studio** → compte sanity.io → accès via le bouton "Gérer mes œuvres" dans le hub

À prévoir : une vidéo Loom de 3-5 minutes (pas plus, il ne la regardera pas si c'est long), qui montre dans l'ordre :
1. Se connecter sur moreartmag.art/admin
2. Cliquer "Gérer mes œuvres" → se connecter sur Sanity
3. Ajouter une œuvre dans Sanity (photos, titre, description)
4. Retourner sur l'admin → l'œuvre apparaît avec badge "À configurer"
5. Cliquer "Modifier le stock / prix" → renseigner prix et stock
6. Voir une commande → changer son statut
7. Voir un message reçu

C'est ce qui transforme le projet de "site qu'Abba doit maintenir" en "site que Bazan possède".
