locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

data "aws_availability_zones" "available" {
  state = "available"
}

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

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.private_subnets

  create_oidc_provider = true
  cluster_endpoint_public_access = true
  manage_aws_auth                = true

  iam_service_accounts = {
    aws_load_balancer_controller = {
      name                 = "aws-load-balancer-controller"
      namespace            = "kube-system"
      attach_policy_arns   = ["arn:aws:iam::aws:policy/AWSLoadBalancerControllerIAMPolicy"]
      role_name            = "aws-load-balancer-controller"
    }
  }

  node_groups = {
    default = {
      desired_capacity                 = var.node_group_desired_capacity
      max_capacity                     = var.node_group_max_capacity
      min_capacity                     = var.node_group_min_capacity
      instance_types                   = [var.node_group_instance_type]
      additional_iam_managed_policies = ["arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"]
    }
  }

  tags = {
    Project = "gestionmotpasse"
  }
}

# Data sources for cluster access used by the Kubernetes and Helm providers

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  create_namespace = false
  version    = var.lb_controller_chart_version
  depends_on = [module.eks]

  set {
    name  = "clusterName"
    value = module.eks.cluster_id
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
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
