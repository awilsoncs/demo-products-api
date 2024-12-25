import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE_NAME;

if (!tableName) {
  throw new Error('Table name is not defined');
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request, no body provided' }),
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
    Item: {
      userId: uuidv4(),
      username,
      password, // In a real application, ensure this is hashed
      meta: {
        created_at: new Date().toISOString(),
        created_by: 'system', // Replace with actual user ID in a real application
        updated_at: new Date().toISOString(),
        updated_by: 'system', // Replace with actual user ID in a real application
      },
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create user' }),
    };
  }
};
