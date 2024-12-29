import { DynamoDB } from 'aws-sdk';

export const handler = async (event: any = {}): Promise<any> => {
  const tableName = process.env.TABLE_NAME;
  const dynamoDb = new DynamoDB.DocumentClient();
  const productId = event.pathParameters?.productId;

  if (!productId) {
    return { statusCode: 400, body: 'Product ID is required' };
  }

  if (!tableName) {
    return { statusCode: 500, body: 'Table name is not defined in environment variables' };
  }

  const params = {
    TableName: tableName,
    Key: { productId: productId },
  };

  try {
    await dynamoDb.delete(params).promise();
    return { statusCode: 200, body: 'Product deleted successfully' };
  } catch (error) {
    return { statusCode: 500, body: 'Could not delete product' };
  }
};
