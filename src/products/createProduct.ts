import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: any = {}): Promise<any> => {
  const tableName = process.env.PRODUCTS_TABLE_NAME;
  const dynamoDb = new DynamoDB.DocumentClient();

  if (!tableName) {
    return { statusCode: 500, body: 'Error: Table name is not defined in environment variables' };
  }

  if (!event.body) {
    return { statusCode: 400, body: 'Error: Invalid request, no body provided' };
  }

  const item = JSON.parse(event.body);

  if (!item.name || !item.price || !item.description || !item.quantity) {
    return { statusCode: 400, body: 'Error: Name, price, description, and quantity are required' };
  }

  const itemData = {id: uuidv4(), ...item};

  const params = {
    TableName: tableName,
    Item: itemData
  };

  try {
    console.info('Creating product with data: ', itemData);
    await dynamoDb.put(params).promise();
    return { statusCode: 201, body: JSON.stringify(itemData) };
  } catch (error) {
    console.error('Error creating product: ', error);
    return { statusCode: 500, body: 'Error: Could not create product' };
  }
};
