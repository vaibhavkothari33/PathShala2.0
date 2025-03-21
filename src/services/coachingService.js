import { ID, Query } from 'appwrite';
import { databases, storage, account } from '../config/appwrite';

// Use environment variables for constants
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID;
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
      // Generate a unique ID
      const documentId = ID.unique();
      
      const documentData = {
        ...coachingData,
        location: coachingData.location || coachingData.city || "", 
        documentId: documentId, // Add this required field
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId, // Use the generated ID here
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
        COLLECTION_ID,
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
        COLLECTION_ID,
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
  // async initializeDefaultCoachingCenters() {
  //   console.log('Initializing default coaching centers...');
  //   // Generate a unique ID
  //   const documentId = ID.unique();
    
  //   const defaultCoachingData = {
  //     name: 'Default Coaching Center',
  //     phone: '1234567890',
  //     description: "this is a coaching",
  //     email: 'default@example.com',
  //     address: "bennett university",
  //     city: "Jaipur",
  //     establishedYear: "2016",
  //     images_logo: "",
  //     images_coverImage: "",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     slug: "",
  //     owner_id: "",
  //     documentId: documentId, // Add this required field
  //     location: "Jaipur", 
  //   };

  //   try {
  //     const response = await databases.createDocument(
  //       DATABASE_ID,
  //       COLLECTION_ID,
  //       documentId, // Use the same ID here
  //       defaultCoachingData
  //     );
  //     console.log('Default coaching center initialized:', response);
  //   } catch (error) {
  //     console.error('Error initializing default coaching center:', error);
  //   }
  // },
};

export default coachingService;