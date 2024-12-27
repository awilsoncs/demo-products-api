import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/products/createProduct';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../../src/products/models';
import { Meta } from '../../../src/shared/models';
import { before } from 'node:test';

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

describe('createProduct handler', () => {
    const tableName = 'Products';
    const context: Context = {} as any;

    beforeEach(() => {
        process.env.PRODUCTS_TABLE_NAME = tableName;
        jest.clearAllMocks();
    });

    it('should return 400 if no body is provided', async () => {
        const event: APIGatewayProxyEvent = {
            body: null,
        } as any;

        const result = await handler(event, context);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid request, no body provided' });
    });

    it('should return 400 if required fields are missing', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: 'Test Product' }),
        } as any;

        const result = await handler(event, context);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ error: 'Name, price, description, and quantity are required' });
    });

    it('should return 500 if table name is not defined', async () => {
        delete process.env.PRODUCTS_TABLE_NAME;

        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
        } as any;

        const result = await handler(event, context);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Table name is not defined in environment variables' });
    });

    it('should create a product and return 201', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
        } as any;

        const productId = 'test-uuid';
        (uuidv4 as jest.Mock).mockReturnValue(productId);

        mockDynamoDbPut.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });

        const result = await handler(event, context);

        expect(result.statusCode).toBe(201);
        const responseBody = JSON.parse(result.body);
        expect(responseBody.productId).toBe(productId);
        expect(responseBody.name).toBe('Test Product');
        expect(responseBody.price).toBe(100);
        expect(responseBody.description).toBe('Test Description');
        expect(responseBody.quantity).toBe(10);
        expect(responseBody.meta).toBeDefined();
    });

    it('should return 500 if DynamoDB put fails', async () => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 }),
        } as any;

        mockDynamoDbPut.mockRejectedValue(new Error('DynamoDB error'));


        const result = await handler(event, context);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ error: 'Could not create product' });
    });
});