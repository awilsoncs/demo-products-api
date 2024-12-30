export const handler = async (): Promise<any> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Health check successful',
      timestamp: new Date().toISOString(),
    }),
  };
};
