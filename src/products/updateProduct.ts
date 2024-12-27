import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const tableName = process.env.PRODUCTS_TABLE_NAME;
    const dynamoDb = new DynamoDB.DocumentClient();

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request, no body provided' }),
        };
    }

    const { productId, name, price, description, quantity } = JSON.parse(event.body);

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' }),
        };
    }

    if (!tableName) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Table name is not defined in environment variables' }),
        };
    }

    const params = {
        TableName: tableName,
        Key: { productId },
        UpdateExpression: 'set #name = :name, #price = :price, #description = :description, #quantity = :quantity, #updated_at = :updated_at',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#price': 'price',
            '#description': 'description',
            '#quantity': 'quantity',
            '#updated_at': 'meta.updated_at',
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':price': price,
            ':description': description,
            ':quantity': quantity,
            ':updated_at': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const result = await dynamoDb.update(params).promise();
        console.log(result);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not update product' }),
        };
    }
};