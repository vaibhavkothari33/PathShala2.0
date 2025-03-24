import { databases, env } from '../config/appwrite';
import { Query } from 'appwrite';

export const databaseService = {
    // Get requests for a coaching center
    getRequests: async (coachingId) => {
        try {
            const response = await databases.listDocuments(
                env.databaseId,
                env.requestsCollectionId,
                [
                    Query.equal('coaching_id', coachingId),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    },

    // Create a new request
    createRequest: async (requestData) => {
        try {
            return await databases.createDocument(
                env.databaseId,
                env.requestsCollectionId,
                'unique()',
                requestData
            );
        } catch (error) {
            console.error('Error creating request:', error);
            throw error;
        }
    },

    // Update a request
    updateRequest: async (requestId, data) => {
        try {
            return await databases.updateDocument(
                env.databaseId,
                env.requestsCollectionId,
                requestId,
                data
            );
        } catch (error) {
            console.error('Error updating request:', error);
            throw error;
        }
    }
}; 