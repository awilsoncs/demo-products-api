resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.app_name}-user_pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                                 = "${var.app_name}-user_pool_client"
  user_pool_id                         = aws_cognito_user_pool.user_pool.id
  callback_urls                        = ["https://example.com"]
  allowed_oauth_flows_user_pool_client = true
  generate_secret = false
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile", "aws.cognito.signin.user.admin"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool" "pool" {
  name = "pool"
}

resource "aws_cognito_identity_pool" "identity_pool" {
  identity_pool_name               = "${var.app_name}-identity_pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id    = aws_cognito_user_pool_client.user_pool_client.id
    provider_name = aws_cognito_user_pool.user_pool.endpoint
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "identity_pool_roles" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool.id

  depends_on = [
    aws_iam_role.visitor_role,
    aws_iam_role.user_role,
    aws_iam_role.admin_role,
  ]

  roles = {
    authenticated   = aws_iam_role.user_role.arn
    unauthenticated = aws_iam_role.visitor_role.arn
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "identity_pool_role_attachment" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool.id
  roles = {
    "authenticated"   = aws_iam_role.user_role.arn
    "unauthenticated" = aws_iam_role.visitor_role.arn
  }

  role_mapping {
    identity_provider = "cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.user_pool.id}:${aws_cognito_user_pool_client.user_pool_client.id}"
    type              = "Rules"
    ambiguous_role_resolution = "AuthenticatedRole"
    mapping_rule {
      claim      = "cognito:groups"
      match_type = "Equals"
      value      = "Admins"
      role_arn   = aws_iam_role.admin_role.arn
    }
    mapping_rule {
      claim      = "cognito:groups"
      match_type = "Equals"
      value      = "Users"
      role_arn   = aws_iam_role.user_role.arn
    }
  }
}
