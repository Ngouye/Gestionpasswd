output "cluster_name" {
  description = "EKS cluster name."
  # CORRECTION : Utilisation de cluster_name à la place de cluster_id
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint."
  value       = module.eks.cluster_endpoint
}

output "cluster_ca_certificate_authority_data" {
  description = "Base64 encoded CA certificate data for the EKS cluster."
  value       = module.eks.cluster_certificate_authority_data
}

output "backend_repository_url" {
  description = "ECR repository URL for the backend image."
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_repository_url" {
  description = "ECR repository URL for the frontend image."
  value       = aws_ecr_repository.frontend.frontend_repository_url
}