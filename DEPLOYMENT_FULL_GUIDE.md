# Déploiement complet AWS EKS + Terraform pour GestionMotPasse

Ce guide explique pas à pas la configuration, la préparation des secrets, la création de l'infrastructure AWS, le build des images Docker et le déploiement sur EKS.

## 1. Vue d'ensemble du projet

Le projet `GestionMotPasse` contient :
- `backend/` : application Spring Boot (Java 17)
- `frontend/` : application React + Vite
- `terraform/` : infrastructure AWS (ECR, VPC, EKS, Load Balancer Controller)
- `k8s/` : manifests Kubernetes pour backend, frontend, Postgres, Ingress
- `.github/workflows/cicd1.yml` : pipeline GitHub Actions pour tests, Terraform, build/push, déploiement

## 2. Prérequis

### 2.1 Logiciels locaux
- AWS CLI configuré
- Terraform 1.7.7 ou équivalent
- Docker
- Git
- Maven 3.x et JDK 17
- Node.js 20

### 2.2 Prérequis AWS
- Compte AWS actif
- Une région AWS choisie (ex: `us-east-1`, `eu-west-3`)
- Un utilisateur IAM avec accès programmatique
- Bucket S3 pour l'état Terraform
- Table DynamoDB pour le verrouillage Terraform

### 2.3 Secrets GitHub
Ajoute ces secrets dans `Settings > Secrets and variables > Actions` du dépôt GitHub :
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

## 3. Créer l'utilisateur IAM AWS

1. Ouvre AWS Console > IAM > Users.
2. Clique sur `Add user`.
3. Sélectionne `Programmatic access`.
4. Attache des politiques de permissions telles que :
   - `AmazonEKSFullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonDynamoDBFullAccess`
   - `IAMReadOnlyAccess` ou plus si nécessaire
5. Enregistre les valeurs `Access key ID` et `Secret access key`.

## 4. Créer le bucket S3 pour Terraform state

1. Ouvre AWS Console > S3.
2. Crée un bucket, par exemple : `gestionmotpasse-terraform-state`.
3. Active le versioning si possible.
4. Note le nom exact.

## 5. Créer la table DynamoDB pour le verrouillage Terraform

1. Ouvre AWS Console > DynamoDB.
2. Crée une table : `terraform-locks` ou équivalent.
3. Clé primaire : `LockID` (String).
4. Laisse les autres paramètres par défaut.

## 6. Configurer la région AWS

Choisis la région que tu utiliseras partout :
- `AWS_REGION`: `us-east-1` ou `eu-west-3`

## 7. Préparer les identifiants de l’application

Ces valeurs sont utilisées par le backend et stockées dans le secret Kubernetes `postgres-secret` :
- `POSTGRES_USERNAME`: nom d'utilisateur PostgreSQL
- `POSTGRES_PASSWORD`: mot de passe PostgreSQL
- `JWT_SECRET`: secret JWT pour la signature des tokens
- `ENCRYPTION_KEY`: clé AES pour chiffrer les mots de passe

> Exemple de bonnes pratiques :
> - `JWT_SECRET`: chaîne longue et aléatoire
> - `ENCRYPTION_KEY`: au moins 16 caractères

## 8. Mise à jour du dépôt GitHub

1. Ouvre le dépôt sur GitHub.
2. Va dans `Settings > Secrets and variables > Actions`.
3. Crée chaque secret listé précédemment.

## 9. Structure Terraform

Le dossier `terraform/` contient :
- `providers.tf` : providers AWS, kubernetes et helm
- `variables.tf` : variables de configuration
- `main.tf` : infra AWS ECR, VPC, EKS, helm release pour AWS Load Balancer Controller
- `outputs.tf` : outputs exportés
- `backend.tf` : backend S3 pour l’état Terraform
- `terraform.tfvars.example` : exemple de variables locales

## 10. Utilisation du backend Terraform

Avant de lancer Terraform, copie le fichier d'exemple :

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Puis édite `terraform.tfvars` si tu souhaites personnaliser les valeurs.

## 11. Initialiser et appliquer Terraform manuellement

1. Dans `terraform/`, lance :

```bash
terraform init -input=false \
  -backend-config="bucket=<TF_STATE_BUCKET>" \
  -backend-config="key=<TF_STATE_KEY>" \
  -backend-config="region=<AWS_REGION>" \
  -backend-config="dynamodb_table=<TF_STATE_DYNAMODB_TABLE>"
```

2. Vérifie la configuration :

```bash
terraform validate
terraform plan
```

3. Crée l’infrastructure :

```bash
terraform apply -auto-approve
```

## 12. Vérifier les sorties Terraform

Après `terraform apply`, note les sorties affichées :
- `backend_repository_url`
- `frontend_repository_url`
- `cluster_name`

Ces sorties sont utilisées automatiquement dans le workflow GitHub Actions.

## 13. Structure du pipeline GitHub Actions

Le workflow `.github/workflows/cicd1.yml` réalise :

1. `backend-unit-tests` : tests Maven dans `backend`
2. `frontend-unit-tests` : tests frontend dans `frontend`
3. `terraform-apply` : init/validate/apply Terraform
4. `build-and-push` : build Docker et push vers ECR
5. `deploy` : configuration `kubectl`, secrets Kubernetes, `kubectl apply -k ./k8s`

## 14. Dossier Kubernetes

Le dossier `k8s/` contient :
- `namespace.yaml` : namespace `gestionmotpasse`
- `postgres.yaml` : Postgres + PVC + service
- `backend.yaml` : deployment backend + service
- `frontend.yaml` : deployment frontend + service
- `ingress.yaml` : ingress ALB pour le frontend
- `kustomization.yaml` : assemble tous les manifests

## 15. Déploiement manuel sur EKS

Si tu veux déployer manuellement après que l’infra soit créée :

1. Récupérer la config kubectl :

```bash
aws eks update-kubeconfig --region <AWS_REGION> --name <cluster_name>
```

2. Appliquer les secrets et les manifests :

```bash
kubectl create namespace gestionmotpasse --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic postgres-secret \
  --from-literal=postgres-username="<POSTGRES_USERNAME>" \
  --from-literal=postgres-password="<POSTGRES_PASSWORD>" \
  --from-literal=jwt-secret="<JWT_SECRET>" \
  --from-literal=encryption-key="<ENCRYPTION_KEY>" \
  -n gestionmotpasse --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -k ./k8s
kubectl set image deployment/backend backend=<BACKEND_IMAGE_URL>:latest -n gestionmotpasse
kubectl set image deployment/frontend frontend=<FRONTEND_IMAGE_URL>:latest -n gestionmotpasse
kubectl rollout status deployment/backend -n gestionmotpasse
kubectl rollout status deployment/frontend -n gestionmotpasse
```

## 16. Résolution de l’accès sans domaine

L’`Ingress` utilise un ALB HTTP public :
- `alb.ingress.kubernetes.io/scheme: internet-facing`
- `alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'`

Tu peux accéder à l’application via le DNS public de l’ALB généré par AWS.

## 17. Vérifier le déploiement

1. Liste les namespaces :

```bash
kubectl get namespaces
```

2. Vérifie les pods :

```bash
kubectl get pods -n gestionmotpasse
```

3. Vérifie les services :

```bash
kubectl get svc -n gestionmotpasse
```

4. Vérifie l’ingress/ALB :

```bash
kubectl get ingress -n gestionmotpasse
```

## 18. Points de vigilance

- Ne publie jamais tes secrets dans le dépôt.
- Le backend dépend de `JWT_SECRET` et `ENCRYPTION_KEY` pour fonctionner correctement.
- Le cluster EKS crée un contrôleur AWS Load Balancer Controller via Helm.
- Si tu veux TLS plus tard, il faudra ajouter un certificat ACM et modifier l’Ingress.

## 19. Conseils pour la première exécution

1. Assure-toi que chaque secret GitHub est présent.
2. Lance le workflow GitHub Action dans la branche `main` ou via `workflow_dispatch`.
3. Surveille les logs du job `terraform-apply` pour détecter les permissions AWS manquantes.
4. Vérifie ensuite `build-and-push` et `deploy`.

## 20. Commande pour déclencher manuellement le workflow

Sur GitHub, va dans `Actions`, puis choisis le workflow `CI/CD Deploy AWS EKS via Terraform`. Clique sur `Run workflow`.

## 21. Liste des fichiers importants

- `.github/workflows/cicd1.yml`
- `terraform/backend.tf`
- `terraform/variables.tf`
- `terraform/main.tf`
- `terraform/outputs.tf`
- `k8s/kustomization.yaml`
- `k8s/ingress.yaml`
- `k8s/backend.yaml`
- `k8s/frontend.yaml`
- `k8s/postgres.yaml`
- `backend/src/main/resources/application.properties`

## 22. Notes finales

Ce guide couvre le déploiement complet de A à Z. Si tu veux, je peux générer un script `deploy.sh` ou un workflow GitHub plus détaillé pour automatiser encore plus cette procédure.