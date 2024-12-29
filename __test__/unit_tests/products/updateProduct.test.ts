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
    process.env.TABLE_NAME = 'test-table';
  });

  it('should return 400 if no body is provided', async () => {
    const event = {
      pathParameters: { productId: '123' },
      body: null,
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual('Invalid request, no body provided');
  });

  it('should return 400 if productId is not provided', async () => {
    const event = {
      pathParameters: {},
      body: JSON.stringify({ name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
    } as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual('Product ID is required');
  });

  it('should return 500 if table name is not defined', async () => {
    delete process.env.TABLE_NAME;

    const event = {
      pathParameters: { productId: '123' },
      body: JSON.stringify({ productId: '123', name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual('Table name is not defined in environment variables');
  });

  it('should update the product and return 200', async () => {
    const updatedProduct = {
      name: 'Updated Product',
      price: 150,
      description: 'Updated Description',
      quantity: 20
    };
    mDocumentClient.promise.mockResolvedValueOnce({ Attributes: updatedProduct });

    const event = {
      pathParameters: { productId: '123' },
      body: JSON.stringify(updatedProduct),
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(204);
    expect(mDocumentClient.update).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { productId: '123' },
      UpdateExpression: 'set name = :name, price = :price, description = :description, quantity = :quantity',
      ExpressionAttributeValues: {
        ':name': 'Updated Product',
        ':price': 150,
        ':description': 'Updated Description',
        ':quantity': 20,
      },
      ReturnValues: 'UPDATED_NEW',
    });
  });

  it('should return 500 if update operation fails', async () => {
    mDocumentClient.promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const event = {
      pathParameters: { productId: '123' },
      body: JSON.stringify({ productId: '123', name: 'Updated Product', price: 150, description: 'Updated Description', quantity: 20 }),
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual('Could not update product');
  });
});
