# 🎮 Find Me — Quiz Game

**Find Me** est un jeu de quiz inspiré du Trivial Pursuit, développé avec  
**React + Vite** pour le frontend et **NestJS** pour le backend.

Le projet est en cours de développement et a pour objectif de proposer
plusieurs modes de jeu éducatifs et ludiques.

---

## 🧩 Stack technique

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (store global — à venir)

### Backend
- NestJS
- TypeScript
- MongoDB (prévu pour la sauvegarde des scores)

### APIs externes
- Open Trivia DB — https://opentdb.com/
- The Trivia API — https://the-trivia-api.com/ (non utilisé pour le moment)

---

## 🎯 Objectif du projet

Créer un jeu de quiz avec plusieurs modes :

- **Mode Simple** — questions par catégorie et difficulté choisies
- **Mode Rapide** — questions aléatoires chronométrées avec système de points
- **Mode Histoire** — progression par pays *(v2)*
- **Mode Équipe** — parties multijoueurs locales
- **Options** — personnalisation du thème et de la langue
- **Boutique** — indices et bonus *(à venir)*

---

## 🗂 Architecture du projet

find-me/
├── frontend/ # Interface du jeu (React + Vite)
│ ├── src/
│ │ ├── pages/ # Pages principales (Menu, Rapide, etc.)
│ │ ├── components/ # Composants réutilisables
│ │ ├── services/ # Appels API et logique métier
│ │ └── types/ # Typages globaux
│ └── vite.config.ts
│
├── backend/ # API NestJS (questions, scores)
│
└── .gitignore

---

---

## 🚀 Installation

### Prérequis
- Node.js **>= 18**
- npm
- Git

---

### Installation du frontend

bash
cd frontend
npm install
npm run dev

Le frontend sera accessible sur :
👉 http://localhost:5173
 (par défaut avec Vite)

---

### Installation du backend

cd backend
npm install
npm run start:dev


Le backend démarre par défaut sur :
👉 http://localhost:3000

## À venir

- Internationalisation (FR / EN)
- Carte du monde progressive (mode histoire)
- Système d’indices et boutique de points
- Sauvegarde de la progression (score + mode histoire)
- Version mobile

---

👨‍💻 Auteur

Projet développé par [GERARD Jordan / Jordybou]