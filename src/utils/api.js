export const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.code === 404) {
        console.error('Resource not found. Please check:');
        console.error('- Project ID is correct');
        console.error('- Database ID is correct');
        console.error('- Collection ID is correct');
        console.error('- Document exists');
    }
    
    throw error;
}; 

try {
    const response = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        documentId
    );
    return response;
} catch (error) {
    if (error.code === 404) {
        console.error('Document not found:', documentId);
        // Handle the 404 case specifically
        return null;
    }
    throw error;
} 