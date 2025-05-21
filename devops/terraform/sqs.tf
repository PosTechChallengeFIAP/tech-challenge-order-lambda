resource "aws_sqs_queue" "payment_queue" {
  name = "payment-sqs-queue"
}

resource "aws_sqs_queue" "payment_queue_dlq" {
  name = "payment-sqs-queue-dlq"
}
