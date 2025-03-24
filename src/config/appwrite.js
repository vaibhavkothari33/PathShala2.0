import { Client, Account, Databases, Storage } from 'appwrite';
import { getConfig } from '../utils/config';

const config = getConfig();

// Initialize Appwrite Client
const client = new Client();

// Set endpoint and project ID
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export configuration object
export const appwriteConfig = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    requestsCollectionId: import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
    coachingCollectionId: import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID,
    imagesBucketId: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID,
};

export default client;

// Helper function to validate environment variables
export const validateConfig = () => {
    const required = {
        'VITE_APPWRITE_ENDPOINT': config.endpoint,
        'VITE_APPWRITE_PROJECT_ID': config.projectId,
        'VITE_APPWRITE_DATABASE_ID': config.databaseId,
        'VITE_APPWRITE_REQUESTS_COLLECTION_ID': config.requestsCollectionId,
        'VITE_APPWRITE_IMAGES_BUCKET_ID': config.imagesBucketId
    };

    const missing = Object.entries(required)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    return true;
};

// Add this for debugging
console.log('Appwrite Configuration:', {
    endpoint: config.endpoint,
    projectId: config.projectId
});

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
