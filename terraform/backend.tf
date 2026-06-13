terraform {
  backend "s3" {
    # Données dynamiques injectées via -backend-config lors du init
    bucket         = ""
    key            = ""
    dynamodb_table = ""

    # Configuration régionale stricte et figée
    region                  = "eu-north-1"
    sts_region              = "eu-north-1"
    skip_region_validation  = true
    skip_metadata_api_check = true

    # Nouvelle syntaxe pour forcer l'endpoint de Stockholm
    use_path_style = false
    endpoints = {
      s3 = "https://s3.eu-north-1.amazonaws.com"
    }
  }
}