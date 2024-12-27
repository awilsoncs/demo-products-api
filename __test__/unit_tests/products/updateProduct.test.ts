import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/products/updateProduct';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    update: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
});

describe('updateProduct handler', () => {
  let mDocumentClient: any;

  beforeAll(() => {
    mDocumentClient = new DynamoDB.DocumentClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PRODUCTS_TABLE_NAME = 'test-table';
  });

  it('should return 400 if no body is provided', async () => {
    const event = {} as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid request, no body provided' });
  });

  it('should return 400 if productId is not provided', async () => {
    const event = {
      body: JSON.stringify({ name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
    } as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Product ID is required' });
  });

  it('should return 500 if table name is not defined', async () => {
    delete process.env.PRODUCTS_TABLE_NAME;

    const event = {
      body: JSON.stringify({ productId: '123', name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
    } as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Table name is not defined in environment variables' });
  });

  it('should update the product and return 200', async () => {
    const updatedProduct = { productId: '123', name: 'Updated Product', price: 150, description: 'Updated Description', quantity: 20 };
    mDocumentClient.promise.mockResolvedValueOnce({ Attributes: updatedProduct });

    const event = {
      body: JSON.stringify({ productId: '123', name: 'Updated Product', price: 150, description: 'Updated Description', quantity: 20 }),
    } as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(updatedProduct);
    expect(mDocumentClient.update).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { productId: '123' },
      UpdateExpression: 'set #name = :name, #price = :price, #description = :description, #quantity = :quantity, #updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#price': 'price',
        '#description': 'description',
        '#quantity': 'quantity',
        '#updated_at': 'meta.updated_at',
      },
      ExpressionAttributeValues: {
        ':name': 'Updated Product',
        ':price': 150,
        ':description': 'Updated Description',
        ':quantity': 20,
        ':updated_at': expect.any(String),
      },
      ReturnValues: 'ALL_NEW',
    });
  });

  it('should return 500 if update operation fails', async () => {
    mDocumentClient.promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const event = {
      body: JSON.stringify({ productId: '123', name: 'Updated Product', price: 150, description: 'Updated Description', quantity: 20 }),
    } as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not update product' });
  });
});