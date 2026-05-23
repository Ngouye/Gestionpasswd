# Kubernetes Deployment

Ce fichier explique comment fonctionne Kubernetes pour cette application, et comment les différents composants communiquent ensemble.

## Architecture

L’application est constituée de deux services distincts :

- `backend` : Spring Boot exposant l’API REST sur le port `8080`
- `frontend` : React compilé servi par Nginx sur le port `80`

Kubernetes orchestre ces services en créant des pods, des services réseau et un namespace dédié.

## Ce que fait chaque manifest

### `namespace.yaml`

Crée un namespace `gestionmotpasse` pour isoler les objets Kubernetes du projet.

### `backend.yaml`

- crée un `Deployment` `backend` qui lance un pod avec l’image `gestionmotpasse/backend:latest`
- expose le port `8080`
- définit un `Service` `ClusterIP` nommé `backend`

Le service `backend` est accessible depuis l’intérieur du cluster sous le nom `http://backend:8080`.

### `frontend.yaml`

- crée un `Deployment` `frontend` qui lance un pod avec l’image `gestionmotpasse/frontend:latest`
- expose le port `80`
- définit un `Service` `NodePort` nommé `frontend`

Le service `frontend` est exposé à l’extérieur sur le port `30080`.

## Comment ça fonctionne ensemble

1. Kubernetes démarre un pod pour le backend et un pod pour le frontend.
2. Le service `backend` fournit un nom DNS interne `backend`.
3. Nginx dans le pod frontend proxy les requêtes vers `http://backend:8080/api/...`.
4. Le frontend est accessible depuis l’extérieur via le service `frontend`.

### Pourquoi c’est important

- Kubernetes gère le redémarrage automatique si un conteneur tombe.
- Kubernetes assure la découverte de service entre frontend et backend.
- Docker se charge de créer les images, Kubernetes se charge de les exécuter et de les mettre en réseau.

## Pré-requis

- un cluster Kubernetes local (`minikube`, `kind`, `Docker Desktop`, etc.)
- `kubectl` configuré sur le cluster
- avoir construit les images Docker localement :

```bash
docker build -t gestionmotpasse/backend:latest ./backend
docker build -t gestionmotpasse/frontend:latest ./frontend
```

Si vous utilisez `minikube`, exécutez avant :

```bash
minikube docker-env
```

## Déploiement

Appliquer tous les manifests :

```bash
kubectl apply -k k8s
```

## Accéder à l’application

- Frontend : `http://localhost:30080`

Si vous préférez utiliser `localhost:3000` :

```bash
kubectl port-forward -n gestionmotpasse service/frontend 3000:80
```

### Note

Le backend n’est pas exposé en dehors du cluster par défaut. Il est accessible en interne via `http://backend:8080` pour le frontend.

## Remarques

- le frontend Nginx proxy les appels `/api/...` vers le service backend nommé `backend`
- le backend utilise actuellement le profil `h2` pour fonctionner sans base PostgreSQL externe
