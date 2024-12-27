import { handler } from '../../../src/users/updateUser';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk');

const mockDynamoDbUpdate = jest.fn();
DynamoDB.DocumentClient.prototype.update = jest.fn().mockImplementation(() => ({
  promise: mockDynamoDbUpdate,
  abort: jest.fn(),
  createReadStream: jest.fn(),
  eachPage: jest.fn(),
  isPageable: jest.fn(),
  send: jest.fn(),
  on: jest.fn(),
}));

describe('updateUser handler', () => {
    beforeAll(() => {
        process.env.INVENTORY_TABLE_NAME = 'Users';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the user in DynamoDB', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '1234' },
            body: JSON.stringify({
                userId: '1234',
                name: 'John Doe',
                email: 'john.doe@example.com'
            })
        } as any;
        const context: Context = {} as any;

        mockDynamoDbUpdate.mockResolvedValue({
            Attributes: {
                userId: '1234',
                name: 'John Doe',
                email: 'john.doe@example.com',
            }
        });
        
        const result = await handler(event, context);
        expect(result.statusCode).toBe(200);
        expect(DynamoDB.DocumentClient.prototype.update).toHaveBeenCalledWith({
            TableName: 'Users',
            Key: { userId: '1234' },
            UpdateExpression: 'set #name = :name, #email = :email, #updated_at = :updated_at',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#email': 'email',
                '#updated_at': 'meta.updated_at',
            },
            ExpressionAttributeValues: {
                ':name': 'John Doe',
                ':email': 'john.doe@example.com',
                ':updated_at': expect.any(String),
            },
            ReturnValues: 'ALL_NEW',
        });
    });

    it('should return a 400 status code if userId is missing', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@example.com'
            })
        } as any;
        const context: Context = {} as any;
    
        const result = await handler(event, context);
    
        expect(result.statusCode).toBe(400);
    });
});
