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

## Déploiement AWS avec Terraform

Le projet inclut désormais un dossier `terraform/` pour créer l’infrastructure AWS via Terraform :

- ECR pour les images backend et frontend
- VPC et sous-réseaux
- EKS pour le cluster Kubernetes

Le workflow GitHub Actions `cicd1.yml` exécute :

1. tests backend et frontend
2. création de l’infrastructure Terraform
3. build et push d’images Docker vers ECR
4. déploiement sur EKS

Le cluster EKS attend un contrôleur Ingress AWS (AWS Load Balancer Controller) pour exposer l’application via un ALB.

Si vous n’avez pas de domaine, l’application peut être exposée en HTTP via le DNS public généré par l’ALB. Il n’est pas nécessaire d’avoir un certificat ACM tant que vous restez en HTTP.

Configuration requise :

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `TF_STATE_BUCKET`
- `TF_STATE_KEY`
- `TF_STATE_DYNAMODB_TABLE`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

> `terraform/backend.tf` utilise un backend S3. Le workflow fournit les valeurs de bucket et DynamoDB depuis les secrets GitHub.

Un guide dédié se trouve dans `terraform/README.md`.

### Utilisation locale

1. Copier `terraform/terraform.tfvars.example` vers `terraform/terraform.tfvars`
2. Ajuster les variables si besoin
3. Exécuter depuis `terraform/` :
   ```bash
   terraform init -backend-config="bucket=<bucket-name>" \
     -backend-config="key=<path>/gestionmotpasse.tfstate" \
     -backend-config="region=<aws-region>" \
     -backend-config="dynamodb_table=<dynamodb-table>"
   terraform apply
   ```

4. Déployer ensuite sur EKS avec le workflow GitHub Actions ou manuellement.

## CI/CD avec GitHub Actions

Le workflow GitHub Actions actuel est défini dans `.github/workflows/cicd1.yml`.

Il fait les étapes suivantes :

- tests backend avec Maven
- tests frontend avec Vitest
- création de l’infrastructure AWS via Terraform
- build et push d’images Docker vers ECR
- déploiement sur EKS via `kubectl`

### Secrets requis

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `TF_STATE_BUCKET`
- `TF_STATE_KEY`
- `TF_STATE_DYNAMODB_TABLE`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Branche

Le déploiement se déclenche sur `push` vers `main`.

## Fonctionnalités

- Ajouter, modifier et supprimer des entrées de mot de passe
- Stockage en mémoire pour prototype
- Chiffrement AES simple des mots de passe côté backend

## À améliorer

- Persistance sur base de données
- Authentification utilisateur
- Gestion avancée des secrets
