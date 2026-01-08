import { DefaultAzureCredential } from '@azure/identity';

const entraCreds = new DefaultAzureCredential();

const token = await entraCreds.getToken([
  'https://graph.microsoft.com/.default',
]);

console.log('Access token', token.token);
