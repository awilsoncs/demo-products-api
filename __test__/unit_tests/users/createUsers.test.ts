import { handler } from '../../../src/users/createUsers';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

jest.mock('aws-sdk');
jest.mock('uuid');

const mockDynamoDbPut = jest.fn();
DynamoDB.DocumentClient.prototype.put = jest.fn().mockImplementation(() => ({
  promise: mockDynamoDbPut,
  abort: jest.fn(),
  createReadStream: jest.fn(),
  eachPage: jest.fn(),
  isPageable: jest.fn(),
  send: jest.fn(),
  on: jest.fn(),
}));

describe('createUsers handler', () => {
  beforeAll(() => {
    process.env.INVENTORY_TABLE_NAME = 'Users';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no body is provided', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;

    const result = await handler(event, context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid request, no body provided' });
  });

  it('should return 400 if username or password is missing', async () => {
    const event = {
      body: JSON.stringify({ username: 'testuser' }),
    } as APIGatewayProxyEvent;
    const context = {} as Context;

    const result = await handler(event, context);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Username and password are required' });
  });

  it('should return 201 and create a user', async () => {
    const event = {
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    } as APIGatewayProxyEvent;
    const context = {} as Context;

    (uuidv4 as jest.Mock).mockReturnValue('1234');
    mockDynamoDbPut.mockResolvedValue({});

    const result = await handler(event, context);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      userId: '1234',
      username: 'testuser',
      password: 'testpass',
      meta: {
        created_at: expect.any(String),
        created_by: 'system',
        updated_at: expect.any(String),
        updated_by: 'system',
      },
    });
    expect(DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
      TableName: 'Users',
      Item: {
        userId: '1234',
        username: 'testuser',
        password: 'testpass',
        meta: {
          created_at: expect.any(String),
          created_by: 'system',
          updated_at: expect.any(String),
          updated_by: 'system',
        },
      },
    });
  });

  it('should return 500 if DynamoDB put fails', async () => {
    const event = {
      body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
    } as APIGatewayProxyEvent;
    const context = {} as Context;

    (uuidv4 as jest.Mock).mockReturnValue('1234');
    mockDynamoDbPut.mockRejectedValue(new Error('DynamoDB error'));

    const result = await handler(event, context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Could not create user' });
  });
});
