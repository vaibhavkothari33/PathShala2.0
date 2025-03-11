import { ID, Query } from 'appwrite';
import { defaultCoachingCenters } from '../data/sampleCoachingData';
import { client, databases, storage, account } from '../config/appwrite';

// Use environment variables for constants
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Initialize default coaching centers
async function initializeDefaultCoachingCenters() {
  try {
    // Check if coaching centers already exist
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );

    if (existing.documents.length === 0) {
      // Add default coaching centers
      const promises = defaultCoachingCenters.map(coaching => {
        // Ensure the data structure matches exactly what Appwrite expects
        const documentData = {
          name: coaching.name,
          description: coaching.description,
          address: coaching.address,
          city: coaching.city,
          phone: coaching.phone,
          email: coaching.email,
          website: coaching.website || '',
          establishedYear: coaching.establishedYear,
          logo: coaching.logo,
          coverImage: coaching.coverImage,
          classroomImages: coaching.classroomImages,
          facilities: coaching.facilities,
          subjects: coaching.subjects,
          batches: coaching.batches,
          faculty: coaching.faculty,
          slug: coaching.slug,
          createdAt: coaching.createdAt,
          updatedAt: coaching.updatedAt
        };

        return databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          documentData
        );
      });

      await Promise.all(promises);
      console.log('Default coaching centers initialized');
    }
  } catch (error) {
    console.error('Error initializing default coaching centers:', error);
    throw error; // Add this to see the full error
  }
}

// Helper function to format data for Appwrite
const formatCoachingData = (data) => {
  return {
    // Basic Info
    basicInfo_name: data.basicInfo.name,
    basicInfo_description: data.basicInfo.description,
    basicInfo_address: data.basicInfo.address,
    basicInfo_city: data.basicInfo.city,
    basicInfo_phone: data.basicInfo.phone,
    basicInfo_email: data.basicInfo.email,
    basicInfo_website: data.basicInfo.website,
    basicInfo_establishedYear: data.basicInfo.establishedYear,

    // Images
    images_logo: data.images.logo,
    images_coverImage: data.images.coverImage,
    images_classroomImages: data.images.classroomImages,

    // Arrays
    facilities: data.facilities,
    subjects: data.subjects,

    // Batches
    batches_name: data.batches.map(b => b.name),
    batches_subjects: data.batches.map(b => b.subjects).flat(),
    batches_timing: data.batches.map(b => b.timing),
    batches_capacity: data.batches.map(b => b.capacity),
    batches_availableSeats: data.batches.map(b => b.availableSeats),
    batches_monthlyFee: data.batches.map(b => b.monthlyFee),
    batches_duration: data.batches.map(b => b.duration),

    // Faculty
    faculty_name: data.faculty.map(f => f.name),
    faculty_qualification: data.faculty.map(f => f.qualification),
    faculty_experience: data.faculty.map(f => f.experience),
    faculty_subject: data.faculty.map(f => f.subject),
    faculty_bio: data.faculty.map(f => f.bio),
    faculty_image: data.faculty.map(f => f.image),

    // Other fields
    slug: data.slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Helper function to parse data from Appwrite
const parseCoachingData = (data) => {
  const batches = data.batches_name.map((name, index) => ({
    name,
    subjects: data.batches_subjects[index],
    timing: data.batches_timing[index],
    capacity: data.batches_capacity[index],
    availableSeats: data.batches_availableSeats[index],
    monthlyFee: data.batches_monthlyFee[index],
    duration: data.batches_duration[index]
  }));

  const faculty = data.faculty_name.map((name, index) => ({
    name,
    qualification: data.faculty_qualification[index],
    experience: data.faculty_experience[index],
    subject: data.faculty_subject[index],
    bio: data.faculty_bio[index],
    image: data.faculty_image[index]
  }));

  return {
    basicInfo: {
      name: data.basicInfo_name,
      description: data.basicInfo_description,
      address: data.basicInfo_address,
      city: data.basicInfo_city,
      phone: data.basicInfo_phone,
      email: data.basicInfo_email,
      website: data.basicInfo_website,
      establishedYear: data.basicInfo_establishedYear
    },
    images: {
      logo: data.images_logo,
      coverImage: data.images_coverImage,
      classroomImages: data.images_classroomImages
    },
    facilities: data.facilities,
    subjects: data.subjects,
    batches,
    faculty,
    slug: data.slug,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

const coachingService = {
  // Check if user is authenticated
  async checkAuth() {
    try {
      const session = await account.get();
      return session;
    } catch (error) {
      throw new Error('User not authenticated');
    }
  },

  // Upload image to Appwrite Storage
  async uploadImage(file) {
    try {
      await this.checkAuth(); // Check authentication before upload
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      return response.$id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(files) {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  },

  // Get image URL
  getImageUrl(fileId) {
    return storage.getFileView(BUCKET_ID, fileId);
  },

  // Register new coaching center
  async registerCoaching(data) {
    try {
      await this.checkAuth(); // Check authentication before creating document
      
      // Format the data using the helper function
      const formattedData = formatCoachingData(data);
      
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        formattedData
      );
      return response;
    } catch (error) {
      console.error('Error registering coaching:', error);
      throw error;
    }
  },

  // Get coaching by slug
  async getCoachingBySlug(slug) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('slug', slug)
        ]
      );

      if (response.documents.length === 0) {
        throw new Error('Coaching center not found');
      }

      const coaching = response.documents[0];

      // Parse JSON strings back to objects
      return {
        ...coaching,
        batches: JSON.parse(coaching.batches),
        faculty: JSON.parse(coaching.faculty)
      };
    } catch (error) {
      console.error('Error fetching coaching:', error);
      throw error;
    }
  },

  // Update coaching information
  async updateCoaching(id, updateData) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error('Failed to update coaching information');
    }
  },

  // List all coaching centers
  async listCoachingCenters(queries = []) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );
      
      // Convert image IDs to URLs for all coaching centers
      response.documents = response.documents.map(coaching => ({
        ...coaching,
        images: {
          logo: coaching.images.logo ? this.getImageUrl(coaching.images.logo) : null,
          coverImage: coaching.images.coverImage ? this.getImageUrl(coaching.images.coverImage) : null,
          classroomImages: (coaching.images.classroomImages || []).map(id => 
            this.getImageUrl(id)
          )
        }
      }));

      return response;
    } catch (error) {
      console.error('List error:', error);
      throw new Error('Failed to fetch coaching centers');
    }
  },

  initializeDefaultCoachingCenters,

  getImagePreview(fileId) {
    return storage.getFilePreview(
      BUCKET_ID,
      fileId
    );
  }
};

export default coachingService; 