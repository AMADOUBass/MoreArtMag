# Feature : Boutique et checkout

Vente d'œuvres en ligne. Trois types de produits : pièces uniques (peintures), tirages numérotés (photos), reproductions ouvertes.

## Modèle commercial

| Type | Stock | Marquage affiché | Comportement |
|---|---|---|---|
| Pièce unique | 1 | "Pièce unique" | Disparaît de la boutique après vente, archivée dans `/moreart` |
| Tirage numéroté | N (ex: 30) | "Édition X/30" | Décrémenté à chaque vente, masqué quand 0 restant |
| Reproduction ouverte | illimité | "Tirage ouvert" | Toujours dispo, possibilité de production à la demande |

Une œuvre peut avoir plusieurs tailles disponibles, chaque taille = un SKU distinct dans `artwork_stock`.

## Flux d'achat de bout en bout

### 1. Sélection sur la page d'une œuvre

L'utilisateur choisit une taille via le sélecteur. Le prix s'actualise en live, le badge de stock aussi. Au clic sur "Ajouter au panier" :

- Vérification du stock côté client (cache local)
- Appel d'une Server Action qui vérifie le stock côté serveur (source de vérité = `artwork_stock`)
- Insert ou update dans `cart_items` (utilisateur connecté) ou store Zustand + localStorage (invité)
- Toast de confirmation et ouverture du `CartDrawer`

### 2. Panier persistant

Le panier vit dans un store Zustand avec persistance localStorage côté client. Pour les utilisateurs connectés, on synchronise le store avec la table `cart_items` Supabase via un effet au login.

Le store gère :
- Ajout d'un item (fusion avec un item existant si même œuvre + même taille)
- Modification de la quantité (suppression si quantité atteint 0)
- Suppression d'un item
- Calcul du total et du nombre d'items

### 3. Checkout

La route handler `/api/checkout` :

1. Valide le payload via Zod (items avec artworkId, sizeId, quantity)
2. Vérifie le stock pour chaque ligne (source de vérité = base de données, pas le client)
3. Récupère les infos des œuvres depuis Sanity (titre, image, etc.)
4. Construit les line items Stripe avec `tax_behavior: "exclusive"` pour que Stripe Tax calcule les taxes
5. Crée la session Stripe Checkout avec :
   - `mode: payment` (one-shot, pas d'abonnement)
   - `automatic_tax: { enabled: true }` pour TPS/TVQ et TVA EU
   - `shipping_address_collection` avec les pays autorisés (CA, US, FR, BE, CH, GB)
   - Plusieurs `shipping_options` (standard et express, configurés dans le dashboard Stripe)
   - `success_url` vers `/commande/{CHECKOUT_SESSION_ID}` et `cancel_url` vers `/panier`
   - Metadata avec le détail des items (pour le webhook)
6. Retourne l'URL de la session, le client est redirigé vers Stripe

### 4. Webhook Stripe

La route `/api/stripe/webhook` :

1. Récupère la signature dans le header `stripe-signature`
2. Vérifie la signature via `stripe.webhooks.constructEvent` avec le secret du webhook
3. Si l'événement est `checkout.session.completed` :
   - Récupère la session complète depuis Stripe (avec `expand` sur line items et customer)
   - Crée la commande dans `orders` (statut `paid`, montants, adresses, identifiants Stripe)
   - Crée les `order_items` (snapshot des œuvres : titre, image, taille, édition)
   - Pour chaque item, met à jour `artwork_stock` :
     - Pièce unique : marque comme vendue
     - Tirage numéroté : décrémente le compteur
     - Reproduction ouverte : pas de changement
   - Envoie l'email de confirmation client via Resend
   - Envoie une notification de nouvelle vente à Bazan via Resend
4. Retourne 200 (important : Stripe retry sinon)

Toutes ces opérations doivent idéalement être atomiques. Utiliser une fonction Postgres ou des transactions Supabase pour garantir l'intégrité.

## Livraison internationale (focus Canada + ouverture monde)

Le marché principal est le Canada. L'international est activé dès le lancement sur les pays prioritaires.

**Pays autorisés au checkout (V1)** :
- Canada (CA) — marché principal
- États-Unis (US)
- France (FR)
- Belgique (BE)
- Suisse (CH)
- Royaume-Uni (GB)

**Pour les autres pays** : afficher un message au checkout « Votre pays n'est pas encore disponible. Contactez-nous pour un devis d'expédition. » avec lien vers `/contact?type=shipping`.

**Tarifs indicatifs à configurer dans Stripe Shipping Rates** (à valider avec Bazan) :

> ⚠️ **À valider** : les tarifs ci-dessous sont des estimations. PROJECT_BRIEF.md ne liste pas de tarif express US. Les valeurs marquées `(?)` sont à confirmer avec Bazan avant de configurer Stripe Shipping Rates en production.

| Zone | Standard | Express | Délai |
|---|---|---|---|
| Canada | 25 CAD | 50 CAD | 5-10 / 2-4 jours |
| États-Unis | 60 CAD | 100 CAD (?) | 5-7 / 2-3 jours |
| Europe (FR, BE, CH, GB) | 120 CAD | 180 CAD (?) | 5-10 / 3-5 jours |
| Reste du monde | sur devis | sur devis | variable |

**Pour les œuvres > 120 cm** : marquer `requires_quote = true` dans Sanity, désactiver le bouton "Acheter" et afficher "Demander un devis" qui redirige vers le formulaire contact (caisses bois sur mesure + transporteurs spécialisés œuvres d'art).

**Avertissement douanes pour les commandes hors Canada** : à afficher au moment du choix de livraison sur Stripe Checkout via metadata, et dans l'email de confirmation : « Des frais de douane et taxes locales peuvent s'appliquer à la livraison, à la charge du destinataire selon les règles du pays de destination. »

## Fiscalité

- **Stripe Tax activé** dans le dashboard pour automatiser le calcul
- **Canada** : TPS 5% + TVQ 9.975% appliquées automatiquement aux ventes au Québec, GST/HST selon les autres provinces
- **Union Européenne** : TVA appliquée selon le pays du client (Stripe gère le seuil de 10 000 € de l'OSS automatiquement)
- **États-Unis** : sales tax appliquée selon les États où il y a nexus (probablement aucun au début, vérifier avec un comptable)
- **Hors zones taxées** : exports, pas de taxe à la source, l'acheteur paye à la douane locale
- **Statut fiscal des œuvres d'art originales au Québec** : peut bénéficier d'exemptions ou taux réduits selon les conditions, **consulter un comptable** avant lancement

## CGV à inclure (par juriste)

Page `/conditions-generales-de-vente` à rédiger par un juriste. Doit couvrir :
- Identification du vendeur (nom, adresse, NEQ si entreprise)
- Prix, taxes, modalités de paiement
- Délais de livraison
**Droit de rétractation** : les œuvres de Bazan sont des produits physiques en stock (pas des commandes personnalisées), donc le **droit de rétractation de 14 jours s’applique probablement** en vertu de la LPC (Québec) et de la directive EU. La mention « œuvres souvent non rétractables car personnalisées » ne s’applique PAS ici. À faire valider par un juriste avant lancement. En attendant, prévoir la mécanique de retour dans les CGV.
- Traitement des données personnelles
- Loi applicable (Québec)

## Tests à passer avant lancement

- Achat invité (sans compte) fonctionne de bout en bout
- Achat connecté : la commande est bien liée au `user_id`
- Race condition : si stock épuisé pendant le checkout → erreur 409 et message clair
- Webhook Stripe en mode test (CLI `stripe listen`) → commande créée
- Email de confirmation reçu sous 30 secondes
- Œuvre unique vendue : disparaît de `/boutique` mais reste sur `/moreart`
- Tirage avec 1 restant : achat OK, après le badge passe à "Édition complète"
- Cancel checkout → retour `/panier` avec items intacts
- Mode test puis bascule en mode live : pas de surprise

## Sécurité

- Le client n'envoie jamais le prix au serveur (le serveur le récupère depuis `artwork_stock`)
- Le client n'envoie jamais le total (Stripe le calcule)
- Webhook Stripe : signature vérifiée, sinon réponse 400
- Les Server Actions de panier vérifient toujours le stock côté serveur
- Pas de service_role Supabase exposé au client
