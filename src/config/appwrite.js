import { Client, Databases, Storage, Account } from 'appwrite';
import { getConfig } from '../utils/config';

const config = getConfig();

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Add this for debugging
console.log('Appwrite Configuration:', {
    endpoint: config.VITE_APPWRITE_ENDPOINT,
    projectId: config.VITE_APPWRITE_PROJECT_ID
});

// Export the client as both default and named export
export { client };
export default client;

export const appwriteConfig = {
    databaseId: config.VITE_APPWRITE_DATABASE_ID,
    coachingCollectionId: config.VITE_APPWRITE_COACHING_COLLECTION_ID,
    imagesBucketId: config.VITE_APPWRITE_IMAGES_BUCKET_ID
};

// Add this function to check auth status
export const checkAuthStatus = async () => {
    try {
        const session = await account.getSession('current');
        return session;
    } catch (error) {
        console.error('Auth status check failed:', error);
        return null;
    }
};

// Add this helper function
export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};
