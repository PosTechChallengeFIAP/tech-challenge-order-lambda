resource "aws_sqs_queue" "order_queue" {
  name = "order-sqs-queue"
}