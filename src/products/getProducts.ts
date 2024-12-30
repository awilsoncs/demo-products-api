import { DynamoDB } from 'aws-sdk';

export const handler = async (): Promise<any> => {
  const dynamoDb = new DynamoDB.DocumentClient();
  const tableName = process.env.PRODUCTS_TABLE_NAME!;

  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(data.Items) };
  } catch (error) {
    return { statusCode: 500, body: 'Could not fetch products' };
  }
};
