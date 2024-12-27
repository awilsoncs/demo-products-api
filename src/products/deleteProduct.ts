import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.PRODUCTS_TABLE_NAME;
  const dynamoDb = new DynamoDB.DocumentClient();

  const productId = event.pathParameters?.productId;

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Product ID is required' }),
    };
  }

  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Table name is not defined in environment variables' }),
    };
  }

  const params = {
    TableName: tableName,
    Key: {
      productId: productId,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete product' }),
    };
  }
};