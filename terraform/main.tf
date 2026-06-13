locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

data "aws_availability_zones" "available" {
  state = "available"
}

# ==========================================================
# REGISTRES ECR
# ==========================================================
resource "aws_ecr_repository" "backend" {
  name                 = var.backend_repository_name
  image_tag_mutability = "MUTABLE"
  tags = {
    Project = "gestionmotpasse"
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = var.frontend_repository_name
  image_tag_mutability = "MUTABLE"
  tags = {
    Project = "gestionmotpasse"
  }
}

# ==========================================================
# RÉSEAU : VPC
# ==========================================================
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 4.0"

  name               = "${var.cluster_name}-vpc"
  cidr               = var.vpc_cidr
  azs                = local.azs
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Project = "gestionmotpasse"
  }
}

# ==========================================================
# CLUSTER : EKS (VERSION v19.x ALIGNÉE)
# ==========================================================
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets # Corrigé: subnets -> subnet_ids

  enable_irsa                    = true # Corrigé: create_oidc_provider -> enable_irsa
  cluster_endpoint_public_access = true

  # Corrigé: node_groups -> eks_managed_node_groups avec arguments v19+
  eks_managed_node_groups = {
    default = {
      desired_size   = var.node_group_desired_capacity
      max_size       = var.node_group_max_capacity
      min_size       = var.node_group_min_capacity
      instance_types = [var.node_group_instance_type]

      iam_role_additional_policies = {
        AmazonEC2ContainerRegistryReadOnly = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
      }
    }
  }

  tags = {
    Project = "gestionmotpasse"
  }
}

# ==========================================================
# ACCÈS CLUSTER & PROVIDERS
# ==========================================================
data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_name # Corrigé: cluster_id -> cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name # Corrigé: cluster_id -> cluster_name
}

# Rôle IAM de substitution pour le AWS Load Balancer Controller (IRSA)
data "aws_iam_policy_document" "lb_controller_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
    }

    principals {
      identifiers = [module.eks.oidc_provider_arn]
      type        = "Federated"
    }
  }
}

resource "aws_iam_role" "aws_load_balancer_controller" {
  name               = "${var.cluster_name}-lb-controller"
  assume_role_policy = data.aws_iam_policy_document.lb_controller_assume_role.json
}

# Note: Pensez à attacher la politique AWSLoadBalancerControllerIAMPolicy à ce rôle si nécessaire

# ==========================================================
# DEPLOYMENT HELM : AWS LOAD BALANCER CONTROLLER
# ==========================================================
resource "helm_release" "aws_load_balancer_controller" {
  name             = "aws-load-balancer-controller"
  repository       = "https://aws.github.io/eks-charts"
  chart            = "aws-load-balancer-controller"
  namespace        = "kube-system"
  create_namespace = false
  version          = var.lb_controller_chart_version
  depends_on       = [module.eks]

  set {
    name  = "clusterName"
    value = module.eks.cluster_name # Corrigé: cluster_id -> cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "true" # Modifié à true pour qu'Helm l'associe proprement au rôle annoté ci-dessous
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.aws_load_balancer_controller.arn
  }

  set {
    name  = "region"
    value = var.aws_region
  }

  set {
    name  = "vpcId"
    value = module.vpc.vpc_id
  }
}