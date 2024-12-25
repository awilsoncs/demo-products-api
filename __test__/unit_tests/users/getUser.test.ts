import { handler } from '../../../src/users/getUser';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk');

const mockDynamoDbGet = jest.fn();
DynamoDB.DocumentClient.prototype.get = jest.fn().mockReturnValue({
  promise: mockDynamoDbGet,
});

describe('getUser handler', () => {
  beforeAll(() => {
    process.env.INVENTORY_TABLE_NAME = 'Users';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if user is not found', async () => {
    const event = {
      pathParameters: { id: '1234' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    mockDynamoDbGet.mockResolvedValue({ Item: null });

    const result = await handler(event, context);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: 'User not found' });
  });

  it('should return 200 and the user data if user is found', async () => {
    const event = {
      pathParameters: { id: '1234' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    const userData = { id: '1234', username: 'testuser', email: 'testuser@example.com' };
    mockDynamoDbGet.mockResolvedValue({ Item: userData });

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(userData);
    expect(DynamoDB.DocumentClient.prototype.get).toHaveBeenCalledWith({
      TableName: 'Users',
      Key: { id: '1234' },
    });
  });

  it('should return 500 if DynamoDB get fails', async () => {
    const event = {
      pathParameters: { id: '1234' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    mockDynamoDbGet.mockRejectedValue(new Error('DynamoDB error'));

    const result = await handler(event, context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not fetch user' });
  });
});