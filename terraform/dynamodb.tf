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