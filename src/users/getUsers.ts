import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const dynamoDb = new DynamoDB.DocumentClient();
  const tableName = process.env.INVENTORY_TABLE_NAME!;

  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    console.log(data);
    if (data.Items) {
      return {
        statusCode: 200,
        body: JSON.stringify(data.Items),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch users' }),
    };
  }
};