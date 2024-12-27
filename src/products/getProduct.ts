import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const dynamoDb = new DynamoDB.DocumentClient();
  const tableName = process.env.PRODUCTS_TABLE_NAME!;

  const productId = event.pathParameters?.productId;

  const params = {
    TableName: tableName,
    Key: { productId },
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
        body: JSON.stringify({ error: 'Product not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch product' }),
    };
  }
};