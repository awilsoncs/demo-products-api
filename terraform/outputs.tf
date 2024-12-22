output "api_gateway_url" {
  value = aws_api_gateway_deployment.inventory_api_deployment.invoke_url
}