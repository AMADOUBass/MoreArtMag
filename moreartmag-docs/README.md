# MoreArt Mag — Dossier de spécifications

Site portfolio + boutique d'art pour **Bazan Togola**, photographe-peintre.

> *« Ce que le pinceau imagine, l'œil le capte. »*

## Pour Abba

Tu copies tous ces fichiers à la racine du repo de ton projet, puis tu lances Claude Code ou Antigravity dans ce dossier. L'agent les lit automatiquement et comprend le projet entier.

## Pour l'agent IA (Claude Code, Antigravity, etc.)

Tu construis le site MoreArt Mag. Avant d'écrire la moindre ligne de code, tu lis ces documents dans cet ordre :

1. `CLAUDE.md` (ou `AGENTS.md` si tu n'es pas Claude Code) — règles du projet
2. `docs/PROJECT_BRIEF.md` — vision, client, audience
3. `docs/ARCHITECTURE.md` — stack technique imposée + décisions architecturales
4. `docs/DATABASE.md` — schéma Supabase
5. `docs/SANITY_SCHEMAS.md` — schémas Sanity (types de documents, champs)
6. `docs/DESIGN_SYSTEM.md` — couleurs, typo, espacements
7. `docs/PAGES.md` — chaque page du site
8. `features/*` — specs détaillées des features complexes
9. `prompts/NANO_BANANA.md` — prompts pour générer les assets visuels
10. `docs/ROADMAP.md` — ordre d’exécution

Une fois lus, tu confirmes au chef de projet (Abba) que tu as compris la vision et la stack avant d'attaquer.

## Structure

```
.
├── README.md
├── CLAUDE.md               ← règles persistantes pour Claude Code
├── AGENTS.md               ← règles persistantes pour autres agents
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SANITY_SCHEMAS.md
│   ├── DESIGN_SYSTEM.md
│   ├── PAGES.md
│   └── ROADMAP.md
├── features/
│   ├── IRIS_HERO.md
│   ├── ROOM_PREVIEW.md
│   ├── SHOP.md
│   └── ADMIN.md
└── prompts/
    └── NANO_BANANA.md
```
