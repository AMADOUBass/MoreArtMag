# Questionnaire de Finalisation — MoreArt Mag

Ce document contient les points à valider avec **Bazan Togola** pour le passage en production du site `moreartmag.art`.

---

## 📧 1. Communications & Emails
- [ ] **Email de notification** : Confirmer que `bazan@moreartmag.com` est bien l'adresse souhaitée pour recevoir les alertes de ventes et les messages de contact.
- [ ] **Configuration Resend** : Bazan a-t-il accès au compte Resend pour valider le domaine et les enregistrements DNS (SPF/DKIM) ?

## 💳 2. Boutique & Paiements (Stripe)
- [ ] **Mode Live** : Une fois les tests terminés, Bazan doit fournir les clés "Live" de Stripe (Publishable key & Secret key).
- [ ] **Frais de livraison** : Quelles sont les règles de livraison définitives ? 
    - Ex: Gratuit au Canada ? Forfait fixe pour l'Europe ?
- [ ] **Statut Fiscal** : Bazan doit-il collecter les taxes (TPS/TVQ) sur les œuvres d'art ? (À configurer dans le dashboard Stripe).

## 👤 3. Comptes Clients & Connexion
- [ ] **Choix stratégique** : Pour la V1, nous avons privilégié le paiement en "invité" (sans compte) pour plus de fluidité. Bazan souhaite-t-il :
    - Garder cette simplicité (recommandé pour une galerie d'art) ?
    - Ou prévoir l'ajout de comptes clients (Espace Membre) dans une version future ? (Note : Cela n'est pas nécessaire pour le lancement actuel).

## 🖼️ 4. Contenu (Sanity)
- [ ] **Audit des prix** : Tous les prix dans Sanity sont-ils exacts (ne pas oublier que les prix sont saisis en centimes dans Supabase si vous gérez le stock manuellement) ?
- [ ] **Dimensions** : Les dimensions (Largeur x Hauteur) sont-elles bien renseignées pour chaque format ? (Crucial pour la "Room Preview").
- [ ] **Descriptions** : Les textes "A propos" et les descriptions d'œuvres sont-ils définitifs ?

## ⚖️ 5. Juridique (Loi 25)
- [ ] **CGV (Conditions Générales de Vente)** : Bazan a-t-il un texte pour les CGV (retours, remboursements, délais de livraison) ?
- [ ] **Politique de confidentialité** : Le texte actuel est-il validé ?

## 🌐 6. Domaine & Lancement
- [ ] **Domaine principal** : Confirmation de l'achat de `moreartmag.art`.
- [ ] **Redirections** : Faut-il configurer `moreartmag.ca` et `moreartmag.com` pour qu'ils pointent vers le `.art` ?

---
**Note :** Une fois ces points validés, le basculement en mode production prendra moins de 30 minutes.
