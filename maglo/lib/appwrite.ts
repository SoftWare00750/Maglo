import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6925f7e8003628848504');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6925f91b000dc1b43405';
export const INVOICES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || 'invoices';
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '';

export { ID };
export default client;