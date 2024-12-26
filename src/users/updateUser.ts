import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const client = new DynamoDBClient({});
  const dynamoDb = DynamoDBDocumentClient.from(client);
  const tableName = process.env.INVENTORY_TABLE_NAME;

  // Validate input
  console.debug('Updating user', event);
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
    ReturnValues: 'ALL_NEW' as const,
  };

  try {
    const data = await dynamoDb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    console.error('Error updating user', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update user' }),
    };
  }
};
