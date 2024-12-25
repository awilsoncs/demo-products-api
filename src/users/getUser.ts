import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const id = event.pathParameters?.id;

  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (data.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(data.Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch user' }),
    };
  }
};
