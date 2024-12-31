import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.API_KEYS_TABLE_NAME as string;

export const handler = async (event: any = {}, context: any, callback: any): Promise<void> => {
  var token = event.authorizationToken;
  // query the db for the token

  const params = {
    TableName: tableName,
    Key: {
      id: token
    }
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (data.Item) {
      callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
      callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
  } catch (error) {
    callback(null, generatePolicy('user', 'Deny', event.methodArn));
  }

};

// Private

// AWS policy and statement fields identifiers are case sensitive
interface PolicyDocument {
  Version: string;
  Statement: Array<Statement>;
}

interface Statement {
  Action: string;
  Effect: string;
  Resource: string;
}

interface AuthResponse {
  principalId: string;
  policyDocument: PolicyDocument;
}

const generatePolicy = (principalId: string, effect: string, resource: string): AuthResponse => {
  const authResponse: AuthResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
  return authResponse;
}
