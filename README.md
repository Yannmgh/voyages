# Voyages

Projet pédagogique (Cloud Campus) : un site de découverte de destinations de voyage, réalisé avec **React 19 + Vite**, **React Router**, **React Bootstrap**, **React Hook Form** et **Yup**.

## Fonctionnalités

- Liste et détail des destinations, avec recherche par mot-clé et filtre par région
- Formulaire de contact validé (React Hook Form + Yup)
- Authentification :
  - Connexion via l'API publique [DummyJSON](https://dummyjson.com/docs/auth) (compte de test : `emilys` / `emilyspass`)
  - Inscription locale (démo pédagogique, stockage dans le navigateur)
  - Page profil alimentée par `GET /auth/me`
- Favoris : un utilisateur connecté peut ajouter/retirer des destinations de ses favoris (stockés dans le `localStorage`, par compte)
- Thème clair / sombre (accessibilité), mémorisé d'une visite à l'autre

## Démarrer le projet en local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement sur GitHub Pages

Le dépôt contient un workflow GitHub Actions (`.github/workflows/deploy.yml`) qui build et déploie automatiquement le site à chaque push sur `main`.

Pour l'activer sur GitHub : **Settings → Pages → Source → "GitHub Actions"**.

Le site est ensuite accessible sur `https://<compte>.github.io/voyages/`.
