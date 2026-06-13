terraform {
  backend "s3" {
    # On garde les accolades vides pour l'injection dynamique
    # mais on ajoute ces deux options de contournement des redirections AWS
    sts_region                 = "eu-north-1"
    skip_region_validation     = true
  }
}