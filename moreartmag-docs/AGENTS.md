# Règles du projet MoreArt Mag (pour agents non-Claude)

Pour Antigravity, Cursor, Continue ou tout autre agent IA. Le contenu est volontairement quasi-identique à `CLAUDE.md` — les deux fichiers sont chargés selon l'agent utilisé.

Lis aussi `CLAUDE.md` à la racine. Les règles s'appliquent indépendamment de l'agent utilisé.

## Mission

Construire MoreArt Mag : site portfolio + e-commerce pour Bazan Togola, photographe-peintre. Le site doit être visuellement remarquable, techniquement solide, et facile à maintenir par le client via un panel admin.

## Tu dois respecter

- La stack imposée dans `docs/ARCHITECTURE.md`
- Le schéma de base de données dans `docs/DATABASE.md`
- Les tokens visuels dans `docs/DESIGN_SYSTEM.md`
- Les specs détaillées dans `features/`
- Toutes les règles strictes listées dans `CLAUDE.md`

## Tu dois refuser de

- Substituer la stack technique sans accord du chef de projet
- Désactiver Row Level Security sur Supabase
- Stocker des secrets en variables `NEXT_PUBLIC_*`
- Sauter la vérification de signature des webhooks Stripe
- Simplifier les features signature (iris hero, room preview) sans accord

## Workflow

1. Lis la spec correspondante avant d'écrire du code
2. Propose un plan en 3 à 7 étapes
3. Attends validation du chef de projet
4. Implémente étape par étape
5. Teste : lint, typecheck, mobile, accessibilité
6. Commit conventionnel, push

## Communication

- Réponds en français
- Direct, pas de flatterie
- Signale les risques (perf, sécurité, UX)
- Demande quand tu ne sais pas, ne devine pas
