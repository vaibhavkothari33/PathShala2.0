import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Add this for debugging
console.log('Appwrite Configuration:', {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID
});

// Export the client as both default and named export
export { client };
export default client;

export const appwriteConfig = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    coachingCollectionId: import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID,
    imagesBucketId: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID
};
