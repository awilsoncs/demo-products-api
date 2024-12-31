# demo-products-api

AWS serverless inventory management demo leveraging API Gateway, Lambda, DynamoDB, and custom authorizers.

## For Stakeholders

### Features

- **Custom Authentication**: Implemented using a custom Lambda authorizer to validate API keys stored in DynamoDB.
- **Product Management**: Add, update, delete, and view products.
- **Cost Estimation**: Detailed cost estimation and projection for the AWS services used.
- **Automated Deployment**: Continuous deployment using GitHub Actions.

### Legal and Compliance

- **Data Privacy**: The application stores generic data and does not store any personally identifiable information.
- **License**: This project is licensed under the MIT License. You can view the license [here](./LICENSE). Broadly, this license allows you to use, modify, and distribute the code for personal or commercial purposes.

### Cost Estimation

**DISCLAIMER**: The following cost estimation is provided as a reference and may not be accurate. The actual cost may vary based on usage and other factors. You can view the cost estimation for the AWS services used [here](https://calculator.aws/#/estimate?id=43e6789d6afb1176b3850b060de57016fc3923ab). If this link is no longer valid, you can view the the
[exported cost estimation](./docs/cost-estimation.json) in the `docs` directory.

You can view a cost estimation for the AWS services used [here](https://calculator.aws/#/estimate?id=43e6789d6afb1176b3850b060de57016fc3923ab).

**TLDR**: This application can support millions of requests for under $25 per month. The largest variables to this will include provisioned concurrency on Lambda, the size of objects stored in DynamoDB, and the size of logs stored in CloudWatch. By keeping these values low, you can keep costs low.

### Time Estimation

This backend can be customized and deployed in a matter of minutes. The application is designed to be easily extended and modified to meet the needs of your organization. The application is deployed using the Serverless Framework, which simplifies the deployment process.

- **Custom Business Logic**: The application includes logic for a very simple data store. Extending this logic to meet your needs may take a few hours to a few days, depending on the complexity of the requirements.
- **Custom Authentication**: This application has a basic authentication mechanism. It is sufficient for an MVP, but integrating with a third-party authentication provider may take a few hours to a few days, depending on the provider.

**TLDR**: This application can be deployed in minutes and customized in a few hours to a few days, depending on the complexity of the requirements.

## For Developers

### Project Overview

The intent of this project is to provide a repeatable model for building serverless applications on AWS. The project demonstrates how to implement custom authentication, manage data using DynamoDB, and deploy the application using the Serverless Framework.

The application is a simple inventory management system that allows users to manage products and users. The application is secured using a custom Lambda authorizer that validates API keys stored in DynamoDB. The application also provides a detailed cost estimation and projection for the AWS services used.

### The Serverless Monolithic Architecture

We use a serverless monolithic architecture to simplify the deployment and management of the application. The application is deployed to the `dev` stage using GitHub Actions for continuous deployment.

### AWS Services Overview

- **AWS Lambda**: For executing the business logic.
- **Amazon API Gateway**: For exposing RESTful endpoints and integrating with custom authorizers.
- **Amazon DynamoDB**: For storing product and user data, as well as API keys for authentication.
- **AWS IAM**: For managing permissions and roles.
- **Amazon CloudWatch**: For logging and monitoring.

### Project Structure

- **src/**: Contains the source code for the Lambda functions.
  - **auth/**: Contains the custom authorizer function.
  - **products/**: Contains the product management functions.
- **serverless.yml**: Serverless Framework configuration file.
- **.github/workflows/**: Contains GitHub Actions workflows for CI/CD.

### Using the API

This section provides instructions on how to build, test, and deploy the application to your AWS account.

#### Prerequisites

- **Serverless Framework**: [Install SLS](https://www.serverless.com/framework/docs/getting-started) Set up Serverless framework locally. You can verify this with:

```sh
serverless --version
```

- **AWS CLI**: [Install AWS Cli v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) Ensure you have the AWS CLI installed and configured with the necessary permissions. You can verify this with:

```sh
aws --version
```

#### Build and Deploy

**Note**: The following instructions assume you have AWS credentials stored in your environment or `~/.aws/credentials` file. The deployment will create live resources in your AWS account and may incur costs.

The following commands will deploy the application to your AWS account.

```sh
npm install
serverless deploy
```

You may install to alternate environments by specifying the stage.

```sh
serverless deploy --stage dev
serverless deploy --stage prod
```

#### Querying the Api

You can query the health check endpoint to verify the application is running.

```sh
curl -X GET https://<api-id>.execute-api.<region>.amazonaws.com/dev/health
```

In order to query the `products` api, you will need to create an API key in the database. After deploying the application, you can use the aws cli to create the key. It must match this format: `^[a-zA-Z0-9-]{36}$` (e.g. `123e4567-e89b-12d3-a456-426614174000`) or the API Gateway will reject the request.

```sh
PRODUCTS_DEV_API_KEY=$(uuidgen)

aws dynamodb put-item \
  --table-name products-api-api-keys-dev \
  --item '{ "id": { "S": "'$PRODUCTS_DEV_API_KEY'" } }'
```

You can then use the API key to query the API.

```sh
curl -X GET https://<api-id>.execute-api.<region>.amazonaws.com/dev/products \
  -H "x-api-key: $PRODUCTS_DEV_API_KEY"
```

#### Cleanup

To remove the resources created by the application, you can use the following command.

```sh
serverless remove
```

#### Running the CI/CD Pipeline

The project includes a GitHub Actions workflow that automates the deployment process. The workflow is triggered on every push to the `main` branch. The workflow will build, test, and deploy the application to the `dev` stage.

To run the workflow successfully, you will need to set up the following secrets in your GitHub repository:

- **AWS_ACCESS_KEY_ID**: The AWS access key ID with the necessary permissions
- **AWS_SECRET_ACCESS_KEY**: The AWS secret access key associated with the access key ID
- **SERVERLESS_ACCESS_KEY**: The Serverless Framework access key for deploying the application

### Future Improvements

The following are potential improvements that could be made to the application.

#### Potential Future Features

- **User Management**: Implement user management functionality.
- **Multitenancy**: Implement multitenancy support for managing multiple organizations.
- **Event Sourcing**: Implement event sourcing for tracking changes to products.
- **Event Notifications**: Send notifications when products are added or updated.
- **Search Functionality**: Implement search functionality for products.

#### Developer Experience

- **CI/CD Improvements**: Implement a more robust CI/CD pipeline with additional stages and controls.
- **Local Development**: Provide a local development environment for testing the application.
- **Templating**: Implement a templating system for using the repo for other types of objects.

### Contributing

For **feature requests** and **bug reports**, please submit an issue to this repository.
