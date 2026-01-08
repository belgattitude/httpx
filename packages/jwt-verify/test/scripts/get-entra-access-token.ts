import { AzureCliCredential } from '@azure/identity';

const entra = new AzureCliCredential();

const token = await entra.getToken(['common']);

console.log('Access token', token.token);
