import { handler } from '../../../src/users/deleteUser';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk');

const mockDynamoDbDelete = jest.fn();
DynamoDB.DocumentClient.prototype.delete = jest.fn().mockImplementation(() => {
  return {
    promise: mockDynamoDbDelete,
    abort: jest.fn(),
    createReadStream: jest.fn(),
    eachPage: jest.fn(),
    isPageable: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
  };
});

describe('deleteUser handler', () => {
  beforeAll(() => {
    process.env.USERS_TABLE_NAME = 'Users';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no user ID is provided', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;

    const result = await handler(event, context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'User ID is required' });
  });

  it('should return 200 and delete the user', async () => {
    const event = {
      pathParameters: { id: '1234' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    mockDynamoDbDelete.mockResolvedValue({});

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ message: 'User deleted successfully' });
    expect(DynamoDB.DocumentClient.prototype.delete).toHaveBeenCalledWith({
      TableName: 'Users',
      Key: { id: '1234' },
    });
  });

  it('should return 500 if DynamoDB delete fails', async () => {
    const event = {
      pathParameters: { id: '1234' },
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;

    mockDynamoDbDelete.mockRejectedValue(new Error('DynamoDB error'));

    const result = await handler(event, context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not delete user' });
  });
});