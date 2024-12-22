resource "aws_lambda_function" "auth_lambda" {
  function_name = "${var.app_name}-auth"
  handler       = "auth.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "auth.zip"
}

resource "aws_lambda_function" "products_lambda" {
  function_name = "${var.app_name}-products"
  handler       = "products.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "products.zip"
}

resource "aws_lambda_function" "users_lambda" {
  function_name = "${var.app_name}-users"
  handler       = "users.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "users.zip"
}