import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/products/getProducts';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
  };
});

describe('getProducts handler', () => {
  let mDocumentClient: any;

  beforeAll(() => {
    mDocumentClient = new DynamoDB.DocumentClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PRODUCTS_TABLE_NAME = 'test-table';
  });

  it('should return 200 and the list of products', async () => {
    const products = [
      { productId: '123', name: 'Product 1' },
      { productId: '456', name: 'Product 2' },
    ];
    mDocumentClient.promise.mockResolvedValueOnce({ Items: products });

    const event = {} as APIGatewayProxyEvent;

    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(products);
    expect(mDocumentClient.scan).toHaveBeenCalledWith({
      TableName: 'test-table',
    });
  });

  it('should return 500 if scan operation fails', async () => {
    mDocumentClient.promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const event = {} as APIGatewayProxyEvent;

    const result = await handler();

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual('Could not fetch products');
  });
});
