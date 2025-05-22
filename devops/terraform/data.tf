data "terraform_remote_state" "order-service" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "order-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "inventory-service" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "inventory-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "payment-service" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "payment-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "queue-service" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "queue-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "aws_iam_role" "default" {
  name = "LabRole"
}