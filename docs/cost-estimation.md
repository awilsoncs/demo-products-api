# Cost Estimation and Projection

To perform cost estimation and projection for this project, you should consider the following AWS services and their associated costs:

## AWS Services

1. **AWS Lambda**:
   - **Execution Duration**: Calculate the total execution time for all Lambda functions.
   - **Number of Requests**: Estimate the number of requests per month.
   - **Memory Allocation**: Determine the memory allocated to each function.

2. **Amazon API Gateway**:
   - **Number of Requests**: Estimate the number of API requests per month.
   - **Data Transfer**: Calculate the amount of data transferred out.

3. **Amazon DynamoDB**:
   - **Read and Write Capacity**: Estimate the read and write capacity units required.
   - **Data Storage**: Calculate the amount of data stored in DynamoDB tables.

4. **Amazon Cognito**:
   - **Number of Users**: Estimate the number of users.
   - **Authentication Requests**: Estimate the number of authentication requests.

5. **Amazon S3** (if used):
   - **Storage**: Calculate the amount of data stored.
   - **Data Transfer**: Estimate the data transfer out.

6. **Other Costs**:
   - **IAM Roles and Policies**: Typically, there are no direct costs, but consider the complexity and management overhead.

## Steps for Cost Estimation

1. **Identify Usage Patterns**:
   - Determine the expected number of users (Visitors, Users, Admins).
   - Estimate the frequency of API calls and Lambda function invocations.

2. **Calculate Service-Specific Costs**:
   - Use the AWS Pricing Calculator to input your estimates for each service.
   - For Lambda, consider the free tier and calculate based on execution time and memory.
   - For API Gateway, calculate based on the number of requests and data transfer.
   - For DynamoDB, estimate read/write capacity units and storage costs.
   - For Cognito, estimate based on the number of users and authentication requests.

3. **Aggregate Costs**:
   - Sum up the costs for all services to get the total monthly cost.
   - Consider any potential cost-saving measures, such as reserved capacity or savings plans.

## Example Calculation

1. **AWS Lambda**:
   - 1 million requests per month, 128 MB memory, 100 ms average execution time.
   - Cost: $0.20 per 1 million requests + $0.00001667 per GB-second.

2. **Amazon API Gateway**:
   - 1 million requests per month.
   - Cost: $3.50 per million requests.

3. **Amazon DynamoDB**:
   - 100,000 read and write requests per month, 1 GB storage.
   - Cost: $0.25 per WCU, $0.25 per RCU, $0.25 per GB storage.

4. **Amazon Cognito**:
   - 10,000 users, 100,000 authentication requests per month.
   - Cost: $0.0055 per MAU, $0.0025 per 1,000 requests.

5. **Amazon S3** (optional):
   - 10 GB storage, 1 GB data transfer out.
   - Cost: $0.023 per GB storage, $0.09 per GB data transfer out.

## Tools

- [AWS Pricing Calculator](https://calculator.aws/#/)
- AWS Cost Explorer for monitoring and optimizing costs.

By following these steps and using the AWS Pricing Calculator, you can create a detailed cost estimation and projection for your project.
