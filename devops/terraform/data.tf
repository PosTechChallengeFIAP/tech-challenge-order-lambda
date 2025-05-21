data "terraform_remote_state" "order" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "order-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "inventory" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "inventory-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "payment" {
  backend = "s3"
  config = {
    bucket = var.aws_bucket_name
    key    = "payment-service/terraform.tfstate"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "queue" {
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