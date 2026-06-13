variable "aws_region" {
  description = "AWS region used to deploy the infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
  default     = "gestionmotpasse-eks"
}

variable "backend_repository_name" {
  description = "ECR repository name for the backend image."
  type        = string
  default     = "gestionmotpasse-backend"
}

variable "frontend_repository_name" {
  description = "ECR repository name for the frontend image."
  type        = string
  default     = "gestionmotpasse-frontend"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "Public subnet CIDRs for the VPC."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "Private subnet CIDRs for the VPC."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "node_group_instance_type" {
  description = "Instance type for EKS worker nodes."
  type        = string
  default     = "t3.medium"
}

variable "node_group_min_capacity" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 1
}

variable "node_group_desired_capacity" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 2
}

variable "node_group_max_capacity" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 2
}

variable "lb_controller_chart_version" {
  description = "AWS Load Balancer Controller Helm chart version."
  type        = string
  default     = "1.11.0"
}
