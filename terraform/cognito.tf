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
  name            = "${var.app_name}-user_pool_client"
  user_pool_id    = aws_cognito_user_pool.user_pool.id
  generate_secret = false
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

  roles = {
    authenticated   = aws_iam_role.user_role.arn
    unauthenticated = aws_iam_role.visitor_role.arn
  }
}

resource "aws_cognito_identity_pool_role_attachment" "identity_pool_role_attachment" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool.id
  role_arn         = aws_iam_role.admin_role.arn

  role_mapping {
    identity_provider = "cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.user_pool.id}:${aws_cognito_user_pool_client.user_pool_client.id}"
    type              = "Token"
    ambiguous_role_resolution = "AuthenticatedRole"
    rules_configuration {
      rules = [
        {
          claim      = "cognito:groups"
          match_type = "Equals"
          value      = "Admins"
          role_arn   = aws_iam_role.admin_role.arn
        },
        {
          claim      = "cognito:groups"
          match_type = "Equals"
          value      = "Users"
          role_arn   = aws_iam_role.user_role.arn
        }
      ]
    }
  }
}

resource "aws_iam_role" "visitor_role" {
  name = "${var.app_name}-Cognito_Visitor_Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          "StringEquals" = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "visitor_role_policy" {
  role       = aws_iam_role.visitor_role.name
  policy_arn = "arn:aws:iam::aws:policy/CognitoGuestUser"
}

resource "aws_iam_role" "user_role" {
  name = "${var.app_name}-Cognito_User_Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          "StringEquals" = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "user_role_policy" {
  role       = aws_iam_role.user_role.name
  policy_arn = "arn:aws:iam::aws:policy/CognitoPowerUser"
}

resource "aws_iam_role" "admin_role" {
  name = "${var.app_name}-Cognito_Admin_Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          "StringEquals" = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "admin_role_policy" {
  role       = aws_iam_role.admin_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}