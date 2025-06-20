resource "aws_lambda_function" "order_lambda" {
  function_name    = "tc-order-lambda"
  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")
  role             = data.aws_iam_role.default.arn
  handler          = "dist/index.handler"
  runtime          = "nodejs18.x"

  environment {
    variables = {
      SQS_URL         = aws_sqs_queue.order_queue.url
      ORDER_URL       = "${data.terraform_remote_state.order-service.outputs.order_service_api_url}/orders-api"
      INVENTORY_URL   = "${data.terraform_remote_state.inventory-service.outputs.inventory_service_api_url}/inventory-api"
      PAYMENT_URL     = "${data.terraform_remote_state.payment-service.outputs.payment_service_api_url}/payment-api"
      QUEUE_URL       = "${data.terraform_remote_state.queue-service.outputs.queue_service_api_url}/queue-api"
    }
  }
}

resource "aws_lambda_permission" "allow_sqs" {
  statement_id  = "AllowSQSToInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.order_lambda.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = aws_sqs_queue.order_queue.arn
}

resource "aws_lambda_event_source_mapping" "sqs_to_lambda" {
  event_source_arn  = aws_sqs_queue.order_queue.arn
  function_name     = aws_lambda_function.order_lambda.function_name
  batch_size        = 5
  enabled           = true
}
