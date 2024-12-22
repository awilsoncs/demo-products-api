# main.tf

provider "aws" {
  region = "us-west-2"
}

resource "aws_dynamodb_table" "products" {
  name           = "products"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "productId"

  attribute {
    name = "productId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "users" {
  name           = "users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }
}

resource "aws_api_gateway_rest_api" "inventory_api" {
  name        = "InventoryManagementAPI"
  description = "API for managing users and products in the inventory management system."
}

resource "aws_api_gateway_resource" "auth" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  parent_id   = aws_api_gateway_rest_api.inventory_api.root_resource_id
  path_part   = "auth"
}

resource "aws_api_gateway_resource" "products" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  parent_id   = aws_api_gateway_rest_api.inventory_api.root_resource_id
  path_part   = "products"
}

resource "aws_api_gateway_resource" "product" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  parent_id   = aws_api_gateway_resource.products.id
  path_part   = "{productId}"
}

resource "aws_api_gateway_resource" "users" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  parent_id   = aws_api_gateway_rest_api.inventory_api.root_resource_id
  path_part   = "users"
}

resource "aws_api_gateway_resource" "user" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  parent_id   = aws_api_gateway_resource.users.id
  path_part   = "{userId}"
}

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

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_exec_attach" {
  name       = "lambda_exec_attach"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_api_gateway_method" "auth_post" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.auth.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "products_get" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.products.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "products_post" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.products.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "product_get" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.product.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "product_put" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.product.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "product_delete" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.product.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "users_get" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "user_delete" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "user_put" {
  rest_api_id   = aws_api_gateway_rest_api.inventory_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "auth_post_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.auth.id
  http_method = aws_api_gateway_method.auth_post.http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST"
  uri         = aws_lambda_function.auth_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "products_get_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.products.id
  http_method = aws_api_gateway_method.products_get.http_method
  type        = "AWS_PROXY"
  integration_http_method = "GET"
  uri         = aws_lambda_function.products_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "products_post_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.products.id
  http_method = aws_api_gateway_method.products_post.http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST"
  uri         = aws_lambda_function.products_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "product_get_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.product.id
  http_method = aws_api_gateway_method.product_get.http_method
  type        = "AWS_PROXY"
  integration_http_method = "GET"
  uri         = aws_lambda_function.products_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "product_put_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.product.id
  http_method = aws_api_gateway_method.product_put.http_method
  type        = "AWS_PROXY"
  integration_http_method = "PUT"
  uri         = aws_lambda_function.products_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "product_delete_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.product.id
  http_method = aws_api_gateway_method.product_delete.http_method
  type        = "AWS_PROXY"
  integration_http_method = "DELETE"
  uri         = aws_lambda_function.products_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "users_get_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_get.http_method
  type        = "AWS_PROXY"
  integration_http_method = "GET"
  uri         = aws_lambda_function.users_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "user_delete_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.user_delete.http_method
  type        = "AWS_PROXY"
  integration_http_method = "DELETE"
  uri         = aws_lambda_function.users_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "user_put_integration" {
  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.user_put.http_method
  type        = "AWS_PROXY"
  integration_http_method = "PUT"
  uri         = aws_lambda_function.users_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "inventory_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.auth_post_integration,
    aws_api_gateway_integration.products_get_integration,
    aws_api_gateway_integration.products_post_integration,
    aws_api_gateway_integration.product_get_integration,
    aws_api_gateway_integration.product_put_integration,
    aws_api_gateway_integration.product_delete_integration,
    aws_api_gateway_integration.users_get_integration,
    aws_api_gateway_integration.user_delete_integration,
    aws_api_gateway_integration.user_put_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.inventory_api.id
  stage_name  = "prod"
}