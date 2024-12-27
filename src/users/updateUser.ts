import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const tableName = process.env.USERS_TABLE_NAME;
    const dynamoDb = new DynamoDB.DocumentClient();

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request, no body provided' }),
        };
    }

    const { userId, name, email } = JSON.parse(event.body);

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
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
        Key: { userId },
        UpdateExpression: 'set #name = :name, #email = :email, #updated_at = :updated_at',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#email': 'email',
            '#updated_at': 'meta.updated_at',
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':email': email,
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
            body: JSON.stringify({ error: 'Could not update user' }),
        };
    }
};