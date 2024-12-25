import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE_NAME;

if (!tableName) {
  throw new Error('Table name is not defined');
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID is required' }),
    };
  }

  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete user' }),
    };
  }
};
