import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/products/getProduct';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    get: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
});

describe('getProduct handler', () => {
  let mDocumentClient: any;

  beforeAll(() => {
    mDocumentClient = new DynamoDB.DocumentClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PRODUCTS_TABLE_NAME = 'test-table';
  });

  it('should return 404 if product is not found', async () => {
    mDocumentClient.promise.mockResolvedValueOnce({});

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: 'Product not found' });
  });

  it('should return 500 if table name is not defined', async () => {
    delete process.env.PRODUCTS_TABLE_NAME;

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not fetch product' });
  });

  it('should return the product and status 200', async () => {
    const product = { productId: '123', name: 'Test Product' };
    mDocumentClient.promise.mockResolvedValueOnce({ Item: product });

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(product);
    expect(mDocumentClient.get).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: { productId: '123' },
    });
  });

  it('should return 500 if get operation fails', async () => {
    mDocumentClient.promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const event = {
      pathParameters: { productId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event, {} as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not fetch product' });
  });
});