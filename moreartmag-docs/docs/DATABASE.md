# Schéma de base de données

Ce document décrit les tables Supabase nécessaires. L'agent qui implémentera créera les migrations SQL avec les types, contraintes, index et policies RLS appropriés.

## Principe directeur

Deux mondes parallèles :

- Le **contenu éditorial** (œuvres, collections, bio, images) vit dans **Sanity** — pas en SQL.
- Les **transactions et l'état utilisateur** (panier, commandes, messages, stock) vivent dans **Supabase**.

Les références aux œuvres se font via un identifiant Sanity stocké en string dans Supabase. Pas de FK cross-services.

## Sécurité

Toutes les tables doivent avoir Row Level Security activée. Les policies doivent être écrites dans la même migration que la création de la table. L'admin est identifié par un champ `role = 'admin'` sur la table `profiles`.

## Tables Supabase à créer

### profiles

Profil étendu lié à `auth.users`. Contient au minimum l'email, le nom complet, et le rôle (`customer` ou `admin`). Un trigger doit créer automatiquement un profil à chaque inscription via `auth.users`.

Policies :
- Un utilisateur peut lire et modifier son propre profil
- Les admins peuvent lire tous les profils

### cart_items

Panier persistant pour utilisateurs connectés. Pour les invités, le panier reste en localStorage côté client.

Champs : utilisateur (nullable), identifiant de session (pour invités), identifiant de l'œuvre Sanity, identifiant de la taille Sanity, quantité, prix unitaire, devise, timestamps.

Contrainte : soit `user_id` soit `session_id` doit être renseigné.

Policies :
- Un utilisateur peut tout faire sur son propre panier

### orders

Une commande validée. Statuts possibles : `pending`, `paid`, `shipped`, `delivered`, `cancelled`, `refunded`.

Champs principaux : numéro de commande lisible (format `MAM-2026-0042`), utilisateur (nullable pour invités), email et nom du client, statut, adresses de livraison et facturation au format JSON, montants en cents (sous-total, livraison, taxes, total), devise, identifiants Stripe (session, payment intent), notes admin, numéro de suivi, dates d'expédition et livraison, timestamps.

Le numéro de commande est généré automatiquement par un trigger basé sur l'année et un compteur.

Policies :
- Un utilisateur peut lire ses propres commandes
- Les admins peuvent tout faire sur toutes les commandes

### order_items

Ligne de commande. Snapshot des données de l'œuvre au moment de l'achat (titre, image, taille, numéro d'édition) pour figer la commande même si l'œuvre est modifiée plus tard dans Sanity.

Champs : commande, identifiant de l'œuvre Sanity, titre, URL de l'image, label de taille, numéro d'édition (ex: `12/30`), quantité, prix unitaire, total ligne.

Policies : héritées via la commande parente.

### inquiries

Messages reçus via le formulaire de contact ou la demande de commission.

Types : `general`, `commission`, `press`, `gallery`.
Statuts : `new`, `in_progress`, `replied`, `closed`.

Champs : type, statut, nom, email, téléphone (optionnel), sujet, message, et pour les commissions : tranche budgétaire, taille souhaitée, référence d'œuvre. Métadonnées techniques : adresse IP, user agent. Champs admin : notes internes, date de réponse.

Policies :
- N'importe qui peut créer une demande
- Seuls les admins peuvent lire et modifier

### artwork_stock

Le stock vit ici (pas dans Sanity) pour permettre des transactions atomiques pendant le checkout.

Champs : identifiant de l'œuvre Sanity, identifiant de la taille Sanity, total de l'édition (nullable, null = ouvert), nombre restant, booléen pièce unique, booléen vendu (pour les uniques), prix en cents, devise, timestamps.

Contrainte d'unicité sur le couple (œuvre, taille).

Policies :
- N'importe qui peut lire le stock
- Seuls les admins peuvent modifier

### room_presets

Bibliothèque de pièces pour la room preview.

Champs : slug unique, nom, description, URL image haute résolution, URL miniature, quadrilatère du mur en coordonnées normalisées (4 points en JSON), largeur et hauteur réelles du mur en cm, hauteur du sol normalisée (pour les œuvres au sol), catégorie (salon, chambre, bureau, couloir), booléen featured, ordre de tri.

Policies :
- N'importe qui peut lire
- Seuls les admins peuvent modifier

### newsletter_subscribers

Liste d'abonnés à la newsletter (V2 mais table à prévoir dès V1).

Champs : email unique, booléen confirmé, token de confirmation, token de désabonnement.

Policies :
- N'importe qui peut s'inscrire
- Seuls les admins peuvent gérer la liste

## Triggers attendus

- Création automatique du profil à l'inscription d'un utilisateur
- Mise à jour automatique du champ `updated_at` sur les tables qui en ont
- Génération automatique du numéro de commande au format `MAM-YYYY-NNNN`

## Migrations

Le schéma initial doit être dans une seule migration `supabase/migrations/YYYYMMDDHHMMSS_init.sql` puis les types TypeScript régénérés via la CLI Supabase et placés dans `src/lib/supabase/types.ts`.

## Données de seed

Pour pouvoir développer la room preview dès le début, prévoir un fichier `supabase/seed.sql` avec au moins deux pièces : un salon et une chambre, avec leurs coordonnées de mur calibrées.
