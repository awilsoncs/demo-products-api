import { handler } from '../../../src/users/getUsers';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
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

describe('getUsers handler', () => {
  let mDocumentClient: any;

  beforeAll(() => {
    process.env.INVENTORY_TABLE_NAME = 'Users';
  });

  beforeEach(() => {
    mDocumentClient = new DynamoDB.DocumentClient();
    jest.clearAllMocks();
  });

  it('should return 200 and an empty list', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;

    mDocumentClient.scan().promise.mockResolvedValue({ Items: [] });

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  it('should return 200 and one user entry', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;

    const userData = [
      { id: '1234', username: 'testuser', email: 'testuser@example.com' },
    ];
    mDocumentClient.scan().promise.mockResolvedValue({ Items: userData });

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(userData);
    expect(mDocumentClient.scan).toHaveBeenCalledWith({
      TableName: 'Users',
    });
  });

  it('should return 500 if DynamoDB scan fails', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;

    mDocumentClient.scan().promise.mockRejectedValue(new Error('DynamoDB error'));

    const result = await handler(event, context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not fetch users' });
  });
});