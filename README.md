# Gestionnaire de mot de passe

Application de gestionnaire de mots de passe avec Spring Boot (backend) et React + Vite (frontend).

## Structure

- `backend/`: application Spring Boot
- `frontend/`: application React avec Vite

## Lancer le backend

1. Ouvrir un terminal dans `backend`
2. Exécuter :

```bash
mvn clean package
mvn spring-boot:run
```

Le backend écoute sur `http://localhost:8080`.

## Lancer le frontend

1. Ouvrir un terminal dans `frontend`
2. Installer les dépendances :

```bash
npm install
```

3. Démarrer l'application :

```bash
npm run dev
```

Le frontend écoute sur `http://localhost:3000` et utilise un proxy vers le backend.

## Docker

Un guide Docker existe dans `docker/README.md` pour expliquer l’architecture, la construction des images et l’utilisation de `docker compose`.

## Déploiement AWS EC2

Un workflow GitHub Actions est disponible dans `.github/workflows/deploy-ec2.yml`.

Il synchronise le code vers votre instance EC2 et lance `docker compose up --build -d`.

Un guide AWS plus complet est disponible dans `aws/README.md`.

### Secrets requis

- `EC2_USER` : utilisateur SSH de l’instance EC2
- `EC2_HOST` : adresse IP ou nom DNS de l’instance
- `EC2_PRIVATE_KEY` : clé privée SSH pour se connecter à l’instance
- `EC2_SSH_PORT` : port SSH (optionnel, par défaut `22`)

### Prérequis côté EC2

Sur l’instance EC2, il faut installer :

- `Docker Engine`
- `Docker Compose` (`docker compose`)
- ouvrir le port SSH

Sur Ubuntu, vous pouvez installer rapidement :

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Ensuite, vérifiez :

```bash
docker version
docker compose version
```

> Aucune installation de Node.js ou Java n’est requise sur l’EC2 pour ce déploiement : les images Docker contiennent déjà toute l’application.

## CI/CD avec GitHub Actions

Le workflow GitHub Actions est défini dans `.github/workflows/deploy.yml`.

Il fait les étapes suivantes :

- build du backend Spring Boot
- build du frontend React
- push des images Docker vers un registre
- déploiement sur Kubernetes via `kubectl`

### Secrets requis

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `KUBE_CONFIG_DATA` (kubeconfig encodé en base64)

### Branche

Le déploiement se déclenche sur `push` vers `main`.

Le workflow exécute désormais :

- tests backend avec Maven
- tests frontend avec Vitest
- build des images Docker
- déploiement Kubernetes

## Fonctionnalités

- Ajouter, modifier et supprimer des entrées de mot de passe
- Stockage en mémoire pour prototype
- Chiffrement AES simple des mots de passe côté backend

## À améliorer

- Persistance sur base de données
- Authentification utilisateur
- Gestion avancée des secrets
