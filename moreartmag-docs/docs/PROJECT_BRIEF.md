# Project Brief

## Le client

- Nom : Bazan Togola
- Activité : photographe-peintre
- Identité signature : « Le Poète Oculaire »
- Localisation : Québec, Canada
- Nom du projet : MoreArt Mag
- Domaine : préférer `moreartmag.art` (cohérent avec le positionnement artistique), fallback `moreartmag.ca` puis `moreartmag.com`. Acheter les trois si possible pour protéger la marque, rediriger les autres vers le principal.

Bazan crée à la fois des photographies (Afrique, Europe, autres continents) et des peintures. Le site doit valoriser cette dualité sans hiérarchiser. Sa pratique se positionne entre documentaire et poétique.

## Vision du site

Un site qui est lui-même une œuvre. Le visiteur ne consulte pas un catalogue, il **traverse un seuil** (l'iris du poète) pour entrer dans son univers. Une fois à l'intérieur, il découvre les œuvres dans une mise en scène muséale, peut s'y projeter via la room preview, et acquérir celles qui le touchent.

Position : entre galerie en ligne haut de gamme (Saatchi Art, Artsy) et portfolio d'auteur (sites Awwwards de photographes individuels). Pas un Etsy. Pas un Shopify générique.

## Audience cible

- Collectionneurs débutants à intermédiaires (25-55 ans, urbains, intérêt déco-art)
- Galeries et curateurs qui découvrent le travail
- Décorateurs d'intérieur qui utilisent la room preview pour valider auprès de leurs clients
- Diaspora africaine et amateurs de photographie de voyage

## Pages prévues

| Route | Rôle | Priorité |
|---|---|---|
| `/` | Hero iris + transition vers l'univers | P0 |
| `/moreart` | Galerie principale (toutes œuvres) | P0 |
| `/boutique` | Œuvres en vente | P0 |
| `/oeuvres/[slug]` | Détail œuvre + room preview + achat | P0 |
| `/a-propos` | Bio Bazan, démarche, parcours | P0 |
| `/contact` | Formulaire contact + commission | P0 |
| `/panier` | Récap avant checkout | P0 |
| `/commande/[id]` | Confirmation post-paiement | P0 |
| `/admin` | Panel Bazan | P0 |
| `/collections/[slug]` | Sous-galerie par série/continent | P1 |
| `/expositions` | Évènements, vernissages | P2 |
| `/journal` | Blog / coulisses | P3 |

## Scope V1 (lancement)

Inclus :
- Hero iris animé au scroll
- Galerie filtrée (type, continent, année)
- Détail œuvre avec zoom haute résolution
- Room preview (visualisation tableau dans pièce, avec choix de tailles)
- Boutique (uniques + tirages numérotés + reproductions)
- Panier persistant
- Checkout Stripe avec TPS/TVQ
- Emails de confirmation
- Panel admin complet pour Bazan
- Page À propos
- Formulaire contact + form commission
- SEO de base

Exclu (reporté V2) :
- Multi-langue EN (préparer i18n mais charger seulement FR)
- Système de comptes clients (achat invité au lancement)
- Wishlist et favoris
- Reviews et témoignages
- AR mobile native (room preview web suffit)

## Modèle de vente

Bazan vend les **trois types** de produits :

1. **Originaux uniques** (peintures et tirages photo signés one-of-a-kind) : stock 1, marqués vendus après paiement, gardés en archive sur `/moreart` même après vente
2. **Tirages numérotés** (photos en édition limitée) : stock défini à la création (ex: 30 exemplaires), décrémenté à chaque vente, mention X/N affichée et certificat d'authenticité signé inclus à la livraison
3. **Reproductions ouvertes** (tirages non numérotés, accessibles) : stock illimité, production à la demande possible, prix d'entrée plus bas pour démocratiser l'accès

Chaque œuvre peut avoir plusieurs tailles disponibles avec prix différents. Le sélecteur de taille sur la page d'œuvre doit clairement indiquer le type pour chaque taille (ex: 40×60 — Tirage 12/30 — Reste 8 / 60×90 — Pièce unique).

**Conséquence design** : ne pas hiérarchiser visuellement les trois types dans la boutique. Un visiteur qui découvre Bazan doit voir indifféremment un original à 4000$ et une reproduction à 200$ : c'est l'œuvre qui touche, pas le prix.

## Identité ressentie (mood)

- Chaud, organique, presque tactile (papier, grain argentique, peinture épaisse)
- Lent, contemplatif (pas de pop-ups, pas d'urgence "buy now")
- Mystérieux mais accueillant
- Référence : Saatchi Art × Hello Monday × portfolios photographes Awwwards

## Risques identifiés et mitigation

| Risque | Mitigation |
|---|---|
| Iris hero qui rame sur mobile | Fallback statique + image LCP préchargée |
| Bazan ne peut pas ajouter ses œuvres seul | Sanity CMS dès la V1 + onboarding vidéo |
| Conformité fiscale Québec et international | Stripe Tax activé pour Canada + UE, CGV rédigées par juriste |
| Vol d'images haute résolution | Watermark sur preview, fichier HD délivré seulement après achat |
| Délai de livraison œuvres physiques | Politique d'expédition claire + emails de suivi + numéros de tracking |
| Frais de douane internationaux non anticipés par l'acheteur | Avertissement explicite au checkout pour les commandes hors Canada : « Des frais de douane peuvent s'appliquer à votre charge » |
| Casse à l'expédition d'œuvres originales | Emballage pro (caisse bois pour pièces > 80cm), assurance transport, photo emballage avant envoi |

## Zone de vente et livraison

**Focus principal : Canada** (TPS+TVQ via Stripe Tax automatique).

**International activé dès le départ** sur les marchés prioritaires :
- États-Unis (gros marché art collectionneur, douanes simples sous 800 USD)
- France et Belgique (diaspora francophone, lien culturel fort avec l'Afrique)
- Suisse (collectionneurs)
- Royaume-Uni

Pour les autres pays : option « Demander un devis d'expédition » qui ouvre le formulaire contact.

Stripe Tax gère automatiquement la TVA EU si applicable. Pour les ventes hors UE/Canada/US, considérer comme exports (pas de taxe à la source, mais l'acheteur paye les douanes locales — à mentionner explicitement au checkout).

**Tarifs de livraison indicatifs à confirmer avec Bazan avant lancement** :
- Canada standard : ~25 CAD (Postes Canada Colis, 5-10 jours)
- Canada express : ~50 CAD (Purolator, 2-4 jours)
- USA standard : ~60 CAD (UPS, 5-7 jours)
- USA express : ~100 CAD (?) — à valider avec Bazan
- Europe standard : ~120 CAD (DHL, 5-10 jours)
- Europe express : ~180 CAD (?) — à valider avec Bazan
- Reste du monde : devis sur demande

Pour les œuvres > 120 cm : devis personnalisé obligatoire (caisses sur mesure, transporteurs spécialisés œuvres d'art).
