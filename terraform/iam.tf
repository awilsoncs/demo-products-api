resource "aws_iam_role" "lambda_exec" {
  name = "${var.app_name}-lambda_exec_role"

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
  name       = "${var.app_name}-lambda_exec_attach"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
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
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"

  depends_on = [
    aws_iam_role.visitor_role,
    aws_iam_role.user_role,
    aws_iam_role.admin_role,
  ]
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
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"

  depends_on = [
    aws_iam_role.visitor_role,
    aws_iam_role.user_role,
    aws_iam_role.admin_role,
  ]
}

resource "aws_iam_role" "admin_role" {
  name = "Cognito_Admin_Role"

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
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"

  depends_on = [
    aws_iam_role.visitor_role,
    aws_iam_role.user_role,
    aws_iam_role.admin_role,
  ]
}
