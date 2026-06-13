# Terraform AWS deployment

Ce dossier contient la configuration Terraform pour déployer l'infrastructure AWS du projet.

## Contenu

- `providers.tf` : configuration du provider AWS
- `variables.tf` : variables utilisées pour personnaliser le déploiement
- `main.tf` : création du VPC, du cluster EKS et des repositories ECR
- `outputs.tf` : valeurs exportées pour le workflow CI/CD
- `backend.tf` : configuration du backend S3 pour le state Terraform
- `terraform.tfvars.example` : exemple de variables locales

## Prérequis

- AWS CLI configuré ou secrets GitHub Actions :
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`

- Bucket S3 pour l'état Terraform
- Table DynamoDB pour le verrouillage d'état

## Initialisation locale

1. Copier l'exemple :

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Modifier `terraform.tfvars` si nécessaire.

3. Initialiser Terraform :

```bash
terraform init \
  -backend-config="bucket=<bucket-name>" \
  -backend-config="key=<path>/gestionmotpasse.tfstate" \
  -backend-config="region=<aws-region>" \
  -backend-config="dynamodb_table=<dynamodb-table>"
```

4. Appliquer la configuration :

```bash
terraform apply
```

## Déploiement CI/CD

Le workflow GitHub Actions `.github/workflows/cicd1.yml` utilise ces mêmes ressources Terraform. Les secrets suivants doivent être définis dans le repository :

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

## Notes

- Le backend `terraform/backend.tf` ne contient pas la configuration S3 en dur. Elle est fournie lors de l'initialisation afin de préserver la sécurité.
- Le cluster EKS créé est destiné à une première utilisation de test/prototype. Ajustez les ressources selon vos besoins de production.
