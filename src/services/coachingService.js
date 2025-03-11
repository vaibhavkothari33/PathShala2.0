import { ID, Query } from 'appwrite';
import { databases, storage } from '../config/appwrite';

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
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );

    if (existing.documents.length === 0) {
      const defaultCenter = {
        // Basic Info
        name: "Excellence Tutorial",
        description: "Premier coaching institute for JEE and NEET preparation",
        address: "123 Education Street",
        city: "Mumbai",
        phone: "1234567890",
        email: "contact@excellence.com",
        webiste: "www.excellence.com", // Note: matches your attribute name
        establishedYear: "2010",

        // Images
        images_logo: "default_logo_1",
        images_coverImage: "default_cover_1", // Note: matches your attribute name
        images_classroomImages: "classroom1,classroom2", // String format

        // Batches (as arrays)
        batches_name: ["Morning Batch", "Evening Batch"],
        batches_subjects: ["Physics,Chemistry", "Mathematics,Physics"],
        batches_timing: ["8:00 AM - 11:00 AM", "4:00 PM - 7:00 PM"],
        batches_capacity: ["50", "40"],
        batches_availableSeats: ["20", "15"],
        batches_monthlyFee: ["5000", "4500"],
        batches_duration: ["3 hours", "3 hours"],

        // Faculty (as arrays)
        faculty_name: ["Dr. Sharma", "Dr. Verma"],
        faculty_qualification: ["PhD Physics", "PhD Mathematics"],
        faculty_experience: ["15 years", "12 years"],
        faculty_subject: ["Physics", "Mathematics"],
        faculty_bio: ["Expert in quantum physics", "Specializes in calculus"],
        faculty_image: ["faculty1", "faculty2"]
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        defaultCenter
      );

      console.log('Default coaching center initialized');
    }
  } catch (error) {
    if (error.code !== 401) { // Ignore authentication errors
      console.error('Error initializing default centers:', error);
      throw error;
    }
  }
}

// Helper function to format data for Appwrite
const formatCoachingData = (data) => {
  return {
    // Basic Info - using the exact field names required by Appwrite
    name: data.basicInfo.name,
    description: data.basicInfo.description,
    address: data.basicInfo.address,
    city: data.basicInfo.city,
    phone: data.basicInfo.phone,
    email: data.basicInfo.email,
    website: data.basicInfo.website || '',
    established_year: data.basicInfo.establishedYear,

    // Images - using the exact field names required by Appwrite
    images_logo: data.images.logo || '',
    images_cover: data.images.coverImage || '',
    images_classroom: data.images.classroomImages || [],
    images_gallery: data.images.galleryImages || [],

    // Arrays
    facilities: data.facilities || [],
    subjects: data.subjects || [],

    // Batches - store as stringified JSON
    batches: JSON.stringify(data.batches.map(batch => ({
      name: batch.name,
      subjects: batch.subjects,
      timing: batch.timing,
      capacity: parseInt(batch.capacity) || 0,
      available_seats: parseInt(batch.availableSeats) || 0,
      monthly_fee: parseInt(batch.monthlyFee) || 0,
      duration: batch.duration
    }))),

    // Faculty - store as stringified JSON
    faculty: JSON.stringify(data.faculty.map(f => ({
      name: f.name,
      qualification: f.qualification,
      experience: f.experience,
      subject: f.subject,
      bio: f.bio || '',
      image: f.image || ''
    }))),

    // Other fields
    slug: data.basicInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    user_id: data.userId || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
      classroomImages: data.images_classroomImages.split(',').filter(Boolean)
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
  async registerCoaching(coachingData) {
    try {
      const documentData = {
        ...coachingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        documentData
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
        [Query.equal('name', slug)]
      );

      if (response.documents.length === 0) {
        throw new Error('Coaching center not found');
      }

      const doc = response.documents[0];

      // Convert the data back to the expected format
      return {
        basicInfo: {
          name: doc.name,
          description: doc.description,
          address: doc.address,
          city: doc.city,
          phone: doc.phone,
          email: doc.email,
          website: doc.webiste,
          establishedYear: doc.establishedYear
        },
        images: {
          logo: doc.images_logo,
          coverImage: doc.images_coverImage,
          classroomImages: doc.images_classroomImages.split(',').filter(Boolean)
        },
        batches: doc.batches_name.map((name, index) => ({
          name: name,
          subjects: doc.batches_subjects[index].split(','),
          timing: doc.batches_timing[index],
          capacity: parseInt(doc.batches_capacity[index]),
          availableSeats: parseInt(doc.batches_availableSeats[index]),
          monthlyFee: parseInt(doc.batches_monthlyFee[index]),
          duration: doc.batches_duration[index]
        })),
        faculty: doc.faculty_name.map((name, index) => ({
          name: name,
          qualification: doc.faculty_qualification[index],
          experience: doc.faculty_experience[index],
          subject: doc.faculty_subject[index],
          bio: doc.faculty_bio[index],
          image: doc.faculty_image[index]
        }))
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
          updated_at: new Date().toISOString()
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