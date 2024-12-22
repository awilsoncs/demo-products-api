resource "aws_lambda_function" "auth_lambda" {
  function_name = "auth_lambda"
  handler       = "auth.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "auth.zip"
}

resource "aws_lambda_function" "products_lambda" {
  function_name = "products_lambda"
  handler       = "products.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "products.zip"
}

resource "aws_lambda_function" "users_lambda" {
  function_name = "users_lambda"
  handler       = "users.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "users.zip"
}