import { ID, Query } from 'appwrite';
import { databases, storage, account } from '../config/appwrite';

// Use environment variables for constants
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COACHING_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID;
const REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;

const coachingService = {
  // Check if user is authenticated
  async checkAuth() {
    try {
      const session = await account.get();
      return session;
    } catch (error) {
      console.log(error);
      throw new Error('User not authenticated');
    }
  },

  // Upload image to Appwrite Storage
  async uploadImage(file) {
    try {
      await this.checkAuth();
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      return response.$id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Register new coaching center
  async registerCoaching(coachingData) {
    try {
      const documentData = {
        ...coachingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COACHING_COLLECTION_ID,
        ID.unique(),
        documentData
      );
      return response;
    } catch (error) {
      console.error('Error registering coaching:', error);
      throw error;
    }
  },

  // Get coaching by user ID
  async getUserCoaching(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Query for coaching centers where owner_id equals the userId
      const response = await databases.listDocuments(
        DATABASE_ID,
        COACHING_COLLECTION_ID,
        [Query.equal('owner_id', userId)] // Ensure this field exists in your database
      );

      if (response.documents.length === 0) {
        return null; // No coaching center found
      }

      return response.documents[0];
    } catch (error) {
      console.error('Error fetching user coaching:', error);
      throw error;
    }
  },
  // Get coaching by slug
  async getCoachingBySlug(slug) {
    try {
      if (!slug) {
        throw new Error('Slug is required');
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COACHING_COLLECTION_ID,
        [Query.equal('slug', [slug])]
      );

      if (response.documents.length === 0) {
        return null; // No coaching center found
      }

      return this.transformCoachingData(response.documents[0]);
    } catch (error) {
      console.error('Error fetching coaching by slug:', error);
      throw error;
    }
  },

  // Transform the flat data structure into a nested one for the UI
  transformCoachingData(doc) {
    if (!doc) return null;

    // Handle image URLs
    const getImageUrl = (fileId) => {
      if (!fileId) return null;
      try {
        return storage.getFileView(BUCKET_ID, fileId);
      } catch (error) {
        console.error('Error generating image URL:', error);
        return null;
      }
    };

    // Process batch data from flattened structure
    const processBatches = () => {
      if (!doc.batches_name || !Array.isArray(doc.batches_name)) {
        return [];
      }

      const batches = [];

      for (let i = 0; i < doc.batches_name.length; i++) {
        batches.push({
          id: `batch-${i}`,
          name: doc.batches_name[i] || '',
          subjects: Array.isArray(doc.batches_subjects)
            ? doc.batches_subjects.filter((subject, idx) => {
              // This logic needs to be adjusted based on how your batches_subjects is structured
              // If it's a flat array of all subjects for all batches
              return idx === i;
            })
            : [],
          timing: doc.batches_timing?.[i] || '',
          capacity: doc.batches_capacity?.[i] || '',
          availableSeats: doc.batches_availableSeats?.[i] || '',
          fees: doc.batches_monthlyFee?.[i] || '',
          duration: doc.batches_duration?.[i] || ''
        });
      }

      return batches;
    };

    // Process faculty data from flattened structure
    const processFaculty = () => {
      if (!doc.faculty_name || !Array.isArray(doc.faculty_name)) {
        return [];
      }

      const faculty = [];

      for (let i = 0; i < doc.faculty_name.length; i++) {
        faculty.push({
          id: `faculty-${i}`,
          name: doc.faculty_name[i] || '',
          qualification: doc.faculty_qualification?.[i] || '',
          experience: doc.faculty_experience?.[i] || '',
          subject: doc.faculty_subject?.[i] || '',
          bio: doc.faculty_bio?.[i] || '',
          image: doc.faculty_image?.[i] ? getImageUrl(doc.faculty_image[i]) : null
        });
      }

      return faculty;
    };

    // Return transformed data structure
    return {
      id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      subjects: doc.subjects || [],
      rating: doc.rating || 4.5,
      reviews: doc.reviews || 0,
      students: doc.totalStudents || 0,
      image: doc.images_coverImage ? getImageUrl(doc.images_coverImage) : null,
      logo: doc.images_logo ? getImageUrl(doc.images_logo) : null,
      classroomImages: (doc.images_classroomImages || []).map(id => getImageUrl(id)),
      address: doc.address,
      city: doc.city,
      contact: {
        phone: doc.phone || '',
        email: doc.email || '',
        website: doc.website || ''
      },
      facilities: doc.facilities || [],
      batches: processBatches(),
      faculty: processFaculty(),
      establishedYear: doc.establishedYear,
      price: doc.batches_monthlyFee?.[0] || '₹2000'
    };
  },
  // Get file URL
  getFileUrl(fileId) {
    if (!fileId) return null;
    try {
      return storage.getFileView(BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error generating file URL:', error);
      return null;
    }
  },
  // Initialize default coaching centers
  async initializeDefaultCoachingCenters() {
    console.log('Initializing default coaching centers...');
    // Placeholder for logic to initialize default coaching centers
    const defaultCoachingData = {
      name: 'Default Coaching Center',
      location: 'Default Location',
      mobile: '1234567890',
      email: 'default@example.com'
    };

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COACHING_COLLECTION_ID,
        ID.unique(),
        defaultCoachingData
      );
      console.log('Default coaching center initialized:', response);
    } catch (error) {
      console.error('Error initializing default coaching center:', error);
    }


    // Logic to save defaultCoachingData to Appwrite can be added here
  },

  // Create a new request (for batch join or demo class)
  async createRequest(requestData) {
    try {
      const user = await this.checkAuth();
      
      const documentId = ID.unique();
      const response = await databases.createDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        documentId,
        {
          coachingId: requestData.coachingId,
          studentId: user.$id,
          studentName: user.name,
          studentEmail: user.email,
          studentPhone: requestData.studentPhone || '',
          type: requestData.type, // 'batch' or 'demo'
          batchId: requestData.batchId,
          batchName: requestData.batchName,
          message: requestData.message || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  // Get all requests for a coaching center
  async getCoachingRequests(coachingId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [
          Query.equal('coachingId', coachingId),
          Query.orderDesc('$createdAt')
        ]
      );
      
      return response.documents;
    } catch (error) {
      console.error('Error fetching coaching requests:', error);
      throw error;
    }
  },

  // Get requests for a student
  async getStudentRequests(studentId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [
          Query.equal('studentId', studentId),
          Query.orderDesc('$createdAt')
        ]
      );
      
      return response.documents;
    } catch (error) {
      console.error('Error fetching student requests:', error);
      throw error;
    }
  },

  // Update request status
  async updateRequestStatus(requestId, status) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId,
        {
          status,
          updatedAt: new Date().toISOString()
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  },

  // Delete request
  async deleteRequest(requestId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },

  // Get request by ID
  async getRequestById(requestId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId
      );
      
      return response;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  },

  // Get pending requests count for a coaching center
  async getPendingRequestsCount(coachingId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [
          Query.equal('coachingId', coachingId),
          Query.equal('status', 'pending')
        ]
      );
      
      return response.total;
    } catch (error) {
      console.error('Error fetching pending requests count:', error);
      throw error;
    }
  },

  // Transform request data
  transformRequestData(doc) {
    if (!doc) return null;

    return {
      id: doc.$id,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
      coachingId: doc.coachingId,
      studentId: doc.studentId,
      studentName: doc.studentName,
      studentEmail: doc.studentEmail,
      studentPhone: doc.studentPhone || '',
      type: doc.type,
      batchId: doc.batchId,
      batchName: doc.batchName,
      status: doc.status,
      message: doc.message || '',
      formattedDate: new Date(doc.$createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  },

  // Get all requests with pagination
  async getRequestsWithPagination(coachingId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [
          Query.equal('coachingId', coachingId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
      
      return {
        requests: response.documents.map(doc => this.transformRequestData(doc)),
        total: response.total,
        currentPage: page,
        totalPages: Math.ceil(response.total / limit)
      };
    } catch (error) {
      console.error('Error fetching paginated requests:', error);
      throw error;
    }
  }
};

export default coachingService;
