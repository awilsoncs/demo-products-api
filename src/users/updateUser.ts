import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const { id } = event.pathParameters || {};
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID is required' }),
    };
  }
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Request body is required' }),
    };
  }
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password are required' }),
    };
  }

  const params = {
    TableName: tableName,
    Key: { userId: id },
    UpdateExpression: 'set #username = :username, #password = :password, #meta.#updated_at = :updated_at, #meta.#updated_by = :updated_by',
    ExpressionAttributeNames: {
      '#username': 'username',
      '#password': 'password',
      '#meta': 'meta',
      '#updated_at': 'updated_at',
      '#updated_by': 'updated_by',
    },
    ExpressionAttributeValues: {
      ':username': username,
      ':password': password, // In a real application, ensure this is hashed
      ':updated_at': new Date().toISOString(),
      ':updated_by': 'system', // Replace with actual user ID in a real application
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update user' }),
    };
  }
};
