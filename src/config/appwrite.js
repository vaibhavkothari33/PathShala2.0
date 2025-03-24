import { Client, Databases, Storage, Account } from 'appwrite';
import { getConfig } from '../utils/config';

const config = getConfig();

// Get environment variables
const env = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    requestsCollectionId: import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
    imagesBucketId: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID
};

// Validate environment variables
const validateEnv = () => {
    const required = [
        'endpoint',
        'projectId',
        'databaseId',
        'requestsCollectionId',
        'imagesBucketId'
    ];

    const missing = required.filter(key => !env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return true;
};

// Initialize Appwrite
const initializeAppwrite = () => {
    validateEnv();

    const client = new Client()
        .setEndpoint(env.endpoint)
        .setProject(env.projectId);

    return {
        client,
        account: new Account(client),
        databases: new Databases(client),
        env
    };
};

const appwrite = initializeAppwrite();

// Initialize services
export const { databases, storage } = appwrite;
export const account = appwrite.account;

// Add this for debugging
console.log('Appwrite Configuration:', {
    endpoint: env.endpoint,
    projectId: env.projectId
});

// Export the client as both default and named export
export { appwrite.client };
export default appwrite.client;

export const appwriteConfig = {
    databaseId: env.databaseId,
    coachingCollectionId: config.VITE_APPWRITE_COACHING_COLLECTION_ID,
    imagesBucketId: env.imagesBucketId
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
