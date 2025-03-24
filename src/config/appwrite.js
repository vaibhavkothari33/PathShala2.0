import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

// Set endpoint and project ID using environment variables
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export configuration object using environment variables
export const appwriteConfig = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    requestsCollectionId: import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
    imagesBucketId: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID,
};

// Helper function to validate config
export const validateConfig = () => {
    const required = {
        'VITE_APPWRITE_ENDPOINT': import.meta.env.VITE_APPWRITE_ENDPOINT,
        'VITE_APPWRITE_PROJECT_ID': import.meta.env.VITE_APPWRITE_PROJECT_ID,
        'VITE_APPWRITE_DATABASE_ID': import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'VITE_APPWRITE_REQUESTS_COLLECTION_ID': import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
        'VITE_APPWRITE_IMAGES_BUCKET_ID': import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID
    };

    const missing = Object.entries(required)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    return true;
};

export default client;

// Add this for debugging
console.log('Appwrite Configuration:', {
    endpoint: appwriteConfig.endpoint,
    projectId: appwriteConfig.projectId
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
