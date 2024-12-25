import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.INVENTORY_TABLE_NAME;
  const dynamoDb = new DynamoDB.DocumentClient();

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

  const userId = uuidv4();

  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Table name is not defined in environment variables' }),
    };
  }

  const params = {
    TableName: tableName,
    Item: {
      userId,
      username,
      password,
      meta: {
        created_at: new Date().toISOString(),
        created_by: 'system',
        updated_at: new Date().toISOString(),
        updated_by: 'system',
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
