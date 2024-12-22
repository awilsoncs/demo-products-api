terraform {
  backend "s3" {
    bucket         = "acwilson-core-terraform"
    key            = "acwilson-inventory-management-demo.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}