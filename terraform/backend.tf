terraform {
  backend "s3" {
    # Terraform backend configuration is provided at init time.
    # Example:
    # terraform init \
    #   -backend-config="bucket=<bucket-name>" \
    #   -backend-config="key=<path>/gestionmotpasse.tfstate" \
    #   -backend-config="region=<aws-region>" \
    #   -backend-config="dynamodb_table=<dynamodb-table>"
  }
}
