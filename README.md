# inventory-management-demo

AWS serverless inventory management demo leveraging API Gateway, Lambda, DynamoDB, and Cognito.

## Project Overview

This project is a serverless inventory management system that allows users to manage products and users through a RESTful API. The system is built using AWS services including API Gateway, Lambda, DynamoDB, and Cognito for authentication.

## Features

- **User Authentication**: Sign up, log in, and manage user roles using Amazon Cognito.
- **Product Management**: Add, update, delete, and view products.
- **User Management**: View, update roles, and delete users.
- **Cost Estimation**: Detailed cost estimation and projection for the AWS services used.

## AWS Services Used

- **AWS Lambda**: For executing the business logic.
- **Amazon API Gateway**: For exposing RESTful endpoints.
- **Amazon DynamoDB**: For storing product and user data.
- **Amazon Cognito**: For user authentication and authorization.

## Deployment

The project is deployed using Terraform. The Terraform configuration files are located in the `terraform/` directory.

## Viewing the API Documentation

The API documentation is available via Swagger UI. To view the documentation, follow the steps below:

Start the server:

```bash
node backend/swagger.js
```

Then, navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

## Documentation

- [Cost Estimation](docs/cost-estimation.md)
- [Usage Guide](docs/usage.md)
- [Project Specification](docs/project-spec.md)
- [API Specification](docs/spec.yaml)
- [Architecture Diagram](docs/architecture-diagram.png)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
