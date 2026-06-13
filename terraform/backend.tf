terraform {
  backend "s3" {
    # On laisse les accolades pour que la CLI injecte le bucket, la clé et la table DynamoDB,
    # mais on impose l'utilisation stricte de l'endpoint régional moderne.
    region                      = "eu-north-1"
    sts_region                  = "eu-north-1"
    skip_region_validation      = true
    skip_metadata_api_check     = true

    # Nouvelle syntaxe pour court-circuiter définitivement la redirection 301
    endpoints = {
      s3 = "https://s3.eu-north-1.amazonaws.com"
    }
  }
}