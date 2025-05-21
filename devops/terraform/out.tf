output "order_queue_url" {
  value = aws_sqs_queue.order_queue.id
}