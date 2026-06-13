terraform {
  backend "s3" {
    # On laisse les accolades pour que GitHub Actions injecte le reste (bucket, key, etc.),
    # mais on verrouille ces paramètres pour empêcher Terraform de chercher l'endpoint global S3.
    region                      = "eu-north-1"
    sts_region                  = "eu-north-1"
    skip_region_validation      = true
    skip_metadata_api_check     = true
  }
}