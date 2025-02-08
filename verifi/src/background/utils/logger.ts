export const logApiResponse = (apiName: string, response: any): void => {
    console.log(`${apiName} Response:`, JSON.stringify(response, null, 2));
  };