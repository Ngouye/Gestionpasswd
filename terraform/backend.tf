terraform {
  backend "s3" {
    region                  = "eu-north-1"
    sts_region              = "eu-north-1"
    skip_region_validation  = true
    skip_metadata_api_check = true

    endpoints = {
      s3 = "https://s3.eu-north-1.amazonaws.com"
    }
  }
}