import { DynamoDB } from 'aws-sdk';

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Could not update product`;


export const handler = async (event: any = {}): Promise<any> => {
  const tableName = process.env.PRODUCTS_TABLE_NAME;
  const primaryKey = 'productId';
  const db = new DynamoDB.DocumentClient();
  const productId = event.pathParameters?.productId;

  if (!tableName) {
    return { statusCode: 500, body: 'Table name is not defined in environment variables' };
  }

  if (!event.body) {
    return { statusCode: 400, body: 'Invalid request, no body provided' };
  }

  if (!productId) {
    return { statusCode: 400, body: 'Product ID is required' };
  }

  const editedItem: any = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

  if (editedItem.productId && editedItem.productId !== productId) {
    return { statusCode: 400, body: 'Product ID in body does not match path' };
  }

  const editedItemProperties = Object.keys(editedItem);
  if (!editedItem || editedItemProperties.length < 1) {
    return { statusCode: 400, body: 'invalid request, no arguments provided' };
  }

  const firstProperty = editedItemProperties.splice(0, 1);
  const params: any = {
    TableName: tableName,
    Key: {
      [primaryKey]: productId
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW'
  }
  params.ExpressionAttributeValues[`:${firstProperty}`] = editedItem[`${firstProperty}`];

  editedItemProperties.forEach(property => {
    params.UpdateExpression += `, ${property} = :${property}`;
    params.ExpressionAttributeValues[`:${property}`] = editedItem[property];
  });

  try {
    const vals = await db.update(params).promise();
    return { statusCode: 204, body: JSON.stringify(vals.Attributes) };
  } catch (dbError: any) {
    const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
      RESERVED_RESPONSE : DYNAMODB_EXECUTION_ERROR;
    return { statusCode: 500, body: errorResponse };
  }
};
