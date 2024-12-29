import { DynamoDB } from 'aws-sdk';

export const handler = async (event: any = {}): Promise<any> => {
  const dynamoDb = new DynamoDB.DocumentClient();
  const tableName = process.env.TABLE_NAME!;
  const productId = event.pathParameters?.productId;

  const params = {
    TableName: tableName,
    Key: { productId },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (data.Item) {
      return { statusCode: 200, body: data.Item };
    } else {
      return { statusCode: 404, body: 'Product not found' };
    }
  } catch (error) {
    return { statusCode: 500, body: 'Could not fetch product' };
  }
};
