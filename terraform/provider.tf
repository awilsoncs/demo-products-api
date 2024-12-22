terraform {
  backend "s3" {
    bucket         = "acwilson-core-terraform"
    key            = "${var.app_name}.tfstate"
    region         = var.region
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}