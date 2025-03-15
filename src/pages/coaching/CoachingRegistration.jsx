import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Minus, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import coachingService from '../../services/coachingService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

// Add these styles at the top of your file
const commonInputStyles = `
  w-full px-4 py-3 
  border border-gray-300 
  rounded-lg
  transition-all duration-200
  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  bg-white
  text-gray-900
  placeholder-gray-400
  shadow-sm
  hover:border-indigo-300
`;

const sectionStyles = `
  bg-white rounded-xl shadow-sm
  p-6 sm:p-8
  border border-gray-100
  mb-8
`;

const sectionHeaderStyles = `
  flex flex-col sm:flex-row sm:items-center sm:justify-between
  mb-6 pb-4 border-b border-gray-100
`;

const CoachingRegistration = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      website: '',
      establishedYear: '',
    },
    images: {
      logo: null,
      coverImage: null,
      classroomImages: [],
      galleryImages: [],
    },
    facilities: [],
    subjects: [],
    batches: [
      {
        name: '',
        subjects: [],
        timing: '',
        capacity: '',
        availableSeats: '',
        monthlyFee: '',
        duration: '',
      }
    ],
    faculty: [
      {
        name: '',
        qualification: '',
        experience: '',
        subject: '',
        bio: '',
        image: null,
      }
    ]
  });

  // Image previews state
  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
    coverImage: null,
    classroomImages: [],
    galleryImages: []
  });

  const facilityOptions = [
    'Air Conditioned Classrooms',
    'Digital Learning Tools',
    'Library',
    'Study Material',
    'Doubt Clearing Sessions',
    'Online Classes',
    'Parking',
    'WiFi',
    'Cafeteria',
    'Computer Lab'
  ];

  const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Computer Science',
    'History',
    'Geography',
    'Economics',
    'Accountancy'
  ];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to register a coaching center');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Your API call here
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [name]: value }
    }));
  };

  // Enhanced image upload handler
  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);

    if (type === 'classroomImages' || type === 'galleryImages') {
      // Handle multiple images
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: [...prev.images[type], ...files]
        }
      }));

      setImagePreviews(prev => ({
        ...prev,
        [type]: [...prev[type], ...newFiles.map(f => f.preview)]
      }));
    } else {
      // Handle single image (logo or cover)
      const file = files[0];
      const preview = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, [type]: file }
      }));

      setImagePreviews(prev => ({
        ...prev,
        [type]: preview
      }));
    }
  };

  // Remove image handler
  const handleRemoveImage = (type, index) => {
    if (type === 'classroomImages' || type === 'galleryImages') {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: prev.images[type].filter((_, i) => i !== index)
        }
      }));

      setImagePreviews(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, [type]: null }
      }));

      setImagePreviews(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const addBatch = () => {
    setFormData(prev => ({
      ...prev,
      batches: [...prev.batches, {
        name: '',
        subjects: [],
        timing: '',
        capacity: '',
        availableSeats: '',
        monthlyFee: '',
        duration: '',
      }]
    }));
  };

  const handleBatchChange = (index, field, value) => {
    const newBatches = [...formData.batches];
    newBatches[index][field] = value;
    setFormData(prev => ({ ...prev, batches: newBatches }));
  };

  const addFaculty = () => {
    setFormData(prev => ({
      ...prev,
      faculty: [...prev.faculty, {
        name: '',
        qualification: '',
        experience: '',
        subject: '',
        bio: '',
        image: null,
      }]
    }));
  };

  const handleFacultyChange = (index, field, value) => {
    const newFaculty = [...formData.faculty];
    newFaculty[index][field] = value;
    setFormData(prev => ({ ...prev, faculty: newFaculty }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await coachingService.checkAuth();

      const imageIds = {
        logo: null,
        coverImage: null,
        classroomImages: []
      };

      if (formData.images.logo) {
        imageIds.logo = await coachingService.uploadImage(formData.images.logo);
      } else {
        toast.error("Logo image is required!");
        setLoading(false);
        return;
      }

      if (formData.images.coverImage) {
        imageIds.coverImage = await coachingService.uploadImage(formData.images.coverImage);
      }

      if (formData.images.classroomImages.length > 0) {
        imageIds.classroomImages = await Promise.all(
          formData.images.classroomImages.map(img => coachingService.uploadImage(img))
        );
      }

      const updatedFaculty = await Promise.all(
        formData.faculty.map(async (faculty) => {
          if (faculty.image) {
            const imageId = await coachingService.uploadImage(faculty.image);
            return { ...faculty, image: imageId };
          }
          return faculty;
        })
      );

      // Validate required fields
      if (!formData.basicInfo.description) {
        toast.error("Description is required!");
        setLoading(false);
        return;
      }

      const generateSlug = (name) => {
        return name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      };

      const submissionData = {
        name: formData.basicInfo.name,
        slug: generateSlug(formData.basicInfo.name),
        description: formData.basicInfo.description,
        address: formData.basicInfo.address,
        city: formData.basicInfo.city,
        phone: formData.basicInfo.phone,
        email: formData.basicInfo.email,
        website: formData.basicInfo.website,
        establishedYear: formData.basicInfo.establishedYear,

        images_logo: imageIds.logo,
        images_coverImage: imageIds.coverImage,
        images_classroomImages: imageIds.classroomImages,

        batches_name: formData.batches.map(batch => batch.name),
        batches_subjects: formData.batches.flatMap(batch => batch.subjects),
        batches_timing: formData.batches.map(batch => batch.timing),
        batches_capacity: formData.batches.map(batch => batch.capacity),
        batches_availableSeats: formData.batches.map(batch => batch.availableSeats),
        batches_monthlyFee: formData.batches.map(batch => batch.monthlyFee),
        batches_duration: formData.batches.map(batch => batch.duration),

        faculty_name: updatedFaculty.map(faculty => faculty.name),
        faculty_qualification: updatedFaculty.map(faculty => faculty.qualification),
        faculty_experience: updatedFaculty.map(faculty => faculty.experience),
        faculty_subject: updatedFaculty.map(faculty => faculty.subject),
        faculty_bio: updatedFaculty.map(faculty => faculty.bio),
        faculty_image: updatedFaculty.map(faculty => faculty.image),

        // Add facilities and subjects
        facilities: formData.facilities,
        subjects: formData.subjects,

        // Add owner info
        owner_id: user.$id
      };

      await coachingService.registerCoaching(submissionData);
      toast.success("Coaching center registered successfully!");

      // Important: Redirect to dashboard after successful registration
      navigate("/coaching/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register coaching center");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Register Your Coaching Center
            </h1>
            {/* Progress indicator */}
            <div className="hidden sm:block">
              <div className="bg-gray-100 rounded-full h-2 w-48">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <section className={sectionStyles}>
            <div className={sectionHeaderStyles}>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Provide general details about your coaching center
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coaching Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.basicInfo.name}
                    onChange={handleBasicInfoChange}
                    className={commonInputStyles}
                    placeholder="Enter coaching name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.basicInfo.address}
                    onChange={handleBasicInfoChange}
                    className={commonInputStyles}
                    placeholder="Enter complete address"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.basicInfo.description}
                    onChange={handleBasicInfoChange}
                    rows={4}
                    className={`${commonInputStyles} resize-none`}
                    placeholder="Describe your coaching center"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Images Section */}
          <section className={sectionStyles}>
            <div className={sectionHeaderStyles}>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload images of your coaching center
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="relative group">
                <div className={`
                  aspect-square
                  border-2 border-dashed border-gray-300 
                  rounded-xl
                  overflow-hidden
                  transition-all duration-200
                  ${imagePreviews.logo ? 'bg-gray-50' : 'hover:border-indigo-300'}
                `}>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                  {imagePreviews.logo ? (
                    <div className="relative h-full">
                      <img
                        src={imagePreviews.logo}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="
                        absolute inset-0 bg-black bg-opacity-40 
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-200
                        flex items-center justify-center
                      ">
                        <button
                          onClick={() => handleRemoveImage('logo')}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo"
                      className="
                        h-full w-full
                        flex flex-col items-center justify-center
                        cursor-pointer
                        hover:bg-gray-50
                        transition-colors duration-200
                      "
                    >
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">Upload Logo</span>
                      <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Similar styling for Cover Image and Classroom Images */}
            </div>
          </section>

          {/* Facilities Section with improved styling */}
          <section className={sectionStyles}>
            <div className={sectionHeaderStyles}>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Facilities</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select the facilities available at your center
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {facilityOptions.map((facility) => (
                <label 
                  key={facility} 
                  className={`
                    flex items-center p-4 
                    border rounded-lg cursor-pointer
                    transition-all duration-200
                    ${formData.facilities.includes(facility) 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={(e) => {
                      const newFacilities = e.target.checked
                        ? [...formData.facilities, facility]
                        : formData.facilities.filter(f => f !== facility);
                      setFormData(prev => ({
                        ...prev,
                        facilities: newFacilities
                      }));
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-6 -mx-6">
            <div className="max-w-7xl mx-auto flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-8 py-3
                  bg-gradient-to-r from-indigo-600 to-blue-600
                  text-white font-medium
                  rounded-lg
                  transition-all duration-200
                  shadow-md hover:shadow-lg
                  flex items-center
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700'}
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachingRegistration;
