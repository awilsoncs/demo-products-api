import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './models';
import { Meta } from '../shared/models';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.PRODUCTS_TABLE_NAME;
  const dynamoDb = new DynamoDB.DocumentClient();

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request, no body provided' }),
    };
  }

  const { name, price, description, quantity } = JSON.parse(event.body);

  if (!name || !price || !description || !quantity) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name, price, description, and quantity are required' }),
    };
  }

  const productId = uuidv4();

  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Table name is not defined in environment variables' }),
    };
  }

  const meta = new Meta('system', new Date(), 'system', new Date());
  const product = new Product(productId, name, price, description, quantity, meta);

  const params = {
    TableName: tableName,
    Item: product.toJson(product),
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
      body: JSON.stringify({ error: 'Could not create product' }),
    };
  }
};