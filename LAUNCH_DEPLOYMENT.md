# Comment lancer le déploiement avec GitHub Actions

## Récapitulatif rapide

**Tu ne dois rien taper en local après la configuration initiale.**

Tout se fait automatiquement via GitHub Actions.

---

## Ce que tu dois faire AVANT (une seule fois)

### 1. Créer les secrets GitHub

Va dans ton dépôt GitHub :
1. `Settings` > `Secrets and variables` > `Actions`
2. Crée chaque secret en cliquant `New repository secret` :
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

### 2. Créer l'infrastructure AWS

Dans la console AWS :
1. Crée un **bucket S3** pour l'état Terraform (exemple : `gestionmotpasse-terraform-state`)
2. Crée une **table DynamoDB** nommée `terraform-locks` avec clé primaire `LockID`

### 3. Créer un utilisateur IAM

1. Va dans AWS > IAM > Users
2. Crée un utilisateur avec accès programmatique
3. Attache ces politiques :
   - `AmazonEKSFullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonDynamoDBFullAccess`
4. Copie l'`Access Key ID` et le `Secret Access Key` dans GitHub Secrets

---

## Comment lancer le déploiement

### Option 1 : Via un push (automatique)

```bash
git push origin main
```

→ Le workflow se déclenche automatiquement.

### Option 2 : Via GitHub (zéro commande locale)

1. Ouvre GitHub
2. Va dans `Actions`
3. Clique sur `CI/CD Deploy AWS EKS via Terraform`
4. Clique sur `Run workflow`
5. Choisis la branche `main`
6. Clique sur `Run workflow`

→ Le workflow s'exécute immédiatement.

---

## Ce que fait le workflow automatiquement

Le workflow exécute ces étapes dans cet ordre :

1. **backend-unit-tests** : exécute les tests Maven du backend
2. **frontend-unit-tests** : exécute les tests du frontend
3. **terraform-apply** : crée l'infrastructure AWS (ECR, VPC, EKS, Load Balancer Controller)
4. **build-and-push** : construit les images Docker et les pousse vers ECR
5. **deploy** : déploie les applications sur EKS

**Tu ne dois rien faire.** Tout est automatisé.

---

## Vérifier l'exécution

1. Va dans `Actions` sur GitHub
2. Clique sur le workflow en cours
3. Regarde le statut de chaque étape :
   - ✅ Vert = succès
   - ❌ Rouge = erreur
   - ⏳ Jaune = en cours

4. Clique sur une étape pour voir les logs détaillés

---

## En cas d'erreur

Si le workflow échoue :

1. Clique sur l'étape qui a échoué
2. Lis le message d'erreur
3. Causes courantes :
   - **Secret manquant** : ajoute-le dans GitHub Settings
   - **Permissions insuffisantes** : ajoute les politiques à l'utilisateur IAM AWS
   - **Bucket/table n'existe pas** : crée-les dans AWS
   - **Erreur Terraform** : valide localement avec `terraform validate`

---

## Après le déploiement

Une fois le workflow terminé avec succès :

### Accéder à l'application

1. Va dans AWS Console > EC2 > Load Balancers
2. Trouve l'ALB créé par Terraform
3. Copie son DNS public
4. Ouvre-le dans un navigateur

### Vérifier le déploiement (optionnel)

```bash
# Récupère la config kubectl
aws eks update-kubeconfig --region <AWS_REGION> --name <cluster_name>

# Vérifie les pods
kubectl get pods -n gestionmotpasse

# Vérifie l'Ingress/ALB
kubectl get ingress -n gestionmotpasse -o wide
```

---

## Résumé final

| Étape | Où ? | Quoi faire ? |
|-------|------|-------------|
| **Configuration** | GitHub Settings | Ajouter les 10 secrets |
| **Configuration AWS** | AWS Console | Créer bucket S3 + table DynamoDB |
| **Créer utilisateur IAM** | AWS Console | Créer user + attacher politiques |
| **Lancer le déploiement** | GitHub Actions | Cliquer "Run workflow" OU faire `git push origin main` |
| **Attendre** | GitHub | Regarder les logs |
| **Accéder à l'app** | Navigateur | Utiliser le DNS public de l'ALB |

---

## Points importants

- ✅ Aucune commande à taper localement après la configuration initiale
- ✅ Le workflow gère tout automatiquement
- ✅ Les secrets sont jamais sauvegardés en local
- ✅ L'infrastructure AWS est créée automatiquement par Terraform
- ✅ Les images Docker sont buildées et poussées automatiquement
- ✅ Le déploiement EKS se fait automatiquement

**Tu ne dois que regarder et attendre !**
