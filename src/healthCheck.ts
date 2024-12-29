export const handler = async (): Promise<any> => {
  return {
    statusCode: 200,
    body: {
      message: 'Health check successful',
      timestamp: new Date().toISOString(),
    },
  };
};
