export const getConfig = () => {
  const required = {
    VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_REQUESTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
    VITE_APPWRITE_IMAGES_BUCKET_ID: import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return required;
}; 