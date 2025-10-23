# 🎮 Find Me — Quiz Game

**Find Me** est un jeu de type Trivial Pursuit, développé en **React + Vite** (frontend) et **NestJS** (backend).

---

### Frontend

- **React + TypeScript**
- **TailwindCSS**
- **Vite**
- **Zustand** (store global — à venir)

### Backend

- **NestJS**
- **TypeScript**
- **MongoDB** (prévu pour la sauvegarde des scores)

### APIs externes

- [Open Trivia DB](https://opentdb.com/)
- [The Trivia API](https://the-trivia-api.com/) (non utilisé pour le moment)

---

## Objectif du projet

Créer un jeu de quiz éducatif et ludique avec plusieurs modes :
 **Mode Rapide** — questions aléatoires chronométrées avec points
 **Mode Histoire** — progression par pays  
 **Mode Équipe** — parties multijoueurs locales  
 **Options** — personnalisation du thème et de la langue  
 **Boutique** — achat d’indices et points bonus (à venir)

---

## Architecture du projet

find-me/
├── frontend/ # Interface du jeu (React + Vite)
│ ├── src/app/
│ │ ├── pages/ # Pages principales (Menu, Rapide, etc.)
│ │ ├── components/# Composants réutilisables
│ │ ├── services/ # Logique API et utilitaires
│ │ └── types/ # Typages globaux
│ └── vite.config.ts # Configuration Vite
│
└── backend/ # API NestJS (questions, scores)

---

## Installation

Installer les dépendances:

cd frontend && npm install

cd ../backend && npm install

npm run dev

---

## À venir

- Provider pour traduire en 'fr'
- Carte du monde progressive
- Système d’indices et boutique de points
- Sauvegarde de la progression (score + mode histoire)
- Version mobile

---

👨‍💻 Auteur

Projet développé par [GERARD Jordan / Jordybou]