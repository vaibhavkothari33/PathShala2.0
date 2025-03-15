import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Minus, Camera, X, Info, CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import coachingService from '../../services/coachingService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const CoachingRegistration = () => {
  const { user } = useAuth();
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

  // Add preview URLs state for images
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

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Register Your Coaching Center</h1>
              <p className="mt-2 text-gray-600">Fill in the details to get started</p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Registration Progress</span>
                <div className="w-48 h-2 bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Basic Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Info className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Enhanced input fields with better styling */}
                  <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coaching Name *
                </label>
                      <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.basicInfo.name}
                  onChange={handleBasicInfoChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter coaching name"
                />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: formData.basicInfo.name ? 1 : 0 }}
                            className="text-green-500"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </motion.span>
                        </div>
              </div>
              </div>
                    {/* ... other input fields with similar styling ... */}
              </div>
              </div>
              </div>
            </motion.div>

            {/* Images Section with Enhanced UI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Camera className="h-6 w-6 text-indigo-600" />
              </div>
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              </div>

                {/* Enhanced image upload areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Logo Upload */}
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Logo Image *
                </label>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`
                        relative group cursor-pointer border-2 border-dashed rounded-xl p-8
                        ${imagePreviews.logo ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
                        transition-all duration-200
                      `}
                    >
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                  {imagePreviews.logo ? (
                    <div className="relative">
                      <img
                        src={imagePreviews.logo}
                        alt="Logo preview"
                            className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveImage('logo')}
                            className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                          </motion.button>
                    </div>
                  ) : (
                        <label htmlFor="logo" className="flex flex-col items-center">
                          <div className="p-4 bg-indigo-100 rounded-full mb-4">
                            <Upload className="h-8 w-8 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Upload Logo</span>
                          <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    </label>
                  )}
                    </motion.div>
                  </div>

                  {/* Similar enhanced styling for cover image and classroom images */}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Facilities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Home className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Facilities</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formData.facilities.length} selected
                  </span>
                </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilityOptions.map((facility) => (
                    <motion.label
                      key={facility}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center p-4 rounded-xl cursor-pointer
                        ${formData.facilities.includes(facility)
                          ? 'bg-indigo-50 border-2 border-indigo-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'}
                        transition-all duration-200
                      `}
                    >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          facilities: [...prev.facilities, facility]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          facilities: prev.facilities.filter(f => f !== facility)
                        }));
                      }
                    }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{facility}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
                className={`
                  px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 
                  text-white rounded-xl font-medium text-lg
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  flex items-center space-x-3
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700'}
                `}
            >
              {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register Coaching Center</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
              )}
            </motion.button>
            </motion.div>
          </div>
        </div>
      </form>
      </div>
  );
};

export default CoachingRegistration; 
