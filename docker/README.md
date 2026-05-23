# Docker Deployment

Ce guide explique comment fonctionne Docker pour cette application et comment lancer le backend et le frontend en conteneurs.

## Architecture

L’application est composée de deux conteneurs Docker :

- `backend` : application Spring Boot packagée en jar, exposant l’API sur le port `8080`
- `frontend` : application React construite par Vite, servie par Nginx sur le port `80`

Docker sert à assembler et isoler ces deux services dans des images réutilisables.

## Fichiers importants

- `backend/Dockerfile` : build Maven multi-étapes et exécution du jar Spring Boot
- `frontend/Dockerfile` : build React/Vite puis service statique avec Nginx
- `frontend/nginx.conf` : configuration Nginx pour router la SPA et proxy /api vers le backend
- `docker-compose.yml` : orchestration locale de backend + frontend

## Comment ça fonctionne

1. Docker construit une image pour le backend à partir de `backend/Dockerfile`.
2. Docker construit une image pour le frontend à partir de `frontend/Dockerfile`.
3. `docker-compose.yml` démarre deux services :
   - `backend` exposé sur `8080`
   - `frontend` exposé sur `3000` (mapping vers le port 80 du conteneur)
4. Le frontend React utilise des requêtes vers `/api/...`.
5. Nginx dans le conteneur frontend envoie ces requêtes vers `http://backend:8080/api/...`.

## Commandes

Construire les images :

```bash
docker compose build
```

Démarrer les services :

```bash
docker compose up
```

Arrêter et supprimer les conteneurs :

```bash
docker compose down
```

## Accéder à l’application

- Frontend : `http://localhost:3000`
- Backend : `http://localhost:8080`

## Pourquoi utiliser Docker ici

- isolation des dépendances backend/frontend
- exécution identique en local et sur un serveur
- orchestration simple via `docker compose`
- support facile pour passer ensuite à Kubernetes
