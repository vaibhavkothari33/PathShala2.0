import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite cloud endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID) // Set project ID
    // .setSelfSigned(true); // Enable self-signed certificate

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export the client as both default and named export
export { client };
export default client;

export const appwriteConfig = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    coachingCollectionId: import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID,
    imagesBucketId: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID
};
