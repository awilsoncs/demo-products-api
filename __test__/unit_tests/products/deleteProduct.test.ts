import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/products/deleteProduct';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    delete: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
});

describe('deleteProduct handler', () => {
  let mDocumentClient: any;

  beforeAll(() => {
    mDocumentClient = new DynamoDB.DocumentClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PRODUCTS_TABLE_NAME = 'test-table';
  });

  it('should return 400 if productId is not provided', async () => {
    const event = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual('Product ID is required');
  });

  it('should return 500 if table name is not defined', async () => {
    delete process.env.PRODUCTS_TABLE_NAME;

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual('Table name is not defined in environment variables');
  });

  it('should delete the product and return 200', async () => {
    mDocumentClient.promise.mockResolvedValueOnce({});

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual('Product deleted successfully');
    expect(mDocumentClient.delete).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { productId: '123' },
    });
  });

  it('should return 500 if delete operation fails', async () => {
    mDocumentClient.promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual('Could not delete product');
  });
});
