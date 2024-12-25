import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE_NAME as string;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch users' }),
    };
  }
};
