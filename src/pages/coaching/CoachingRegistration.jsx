import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Minus, Camera, X, CheckCircle, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import coachingService from '../../services/coachingService';

const stepVariants = {
  hidden: { opacity: 0.5, x: 10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0.5, x: -10 }
};

const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Basic Info', description: 'General information about your coaching center' },
    { id: 2, title: 'Images', description: 'Upload logo and other images' },
    { id: 3, title: 'Facilities', description: 'Select available facilities' },
    { id: 4, title: 'Batches', description: 'Add batch details' },
    { id: 5, title: 'Faculty', description: 'Add faculty information' }
  ];

  // Add form validation state
  const [formErrors, setFormErrors] = useState({
    basicInfo: {},
    images: {},
    facilities: false,
    batches: [],
    faculty: []
  });

  // Add validation function
  const validateStep = (step) => {
    let isValid = true;
    const errors = { ...formErrors };

    switch (step) {
      case 1:
        // Basic Info validation
        const requiredFields = ['name', 'description', 'address', 'city', 'phone', 'email'];
        requiredFields.forEach(field => {
          if (!formData.basicInfo[field]) {
            errors.basicInfo[field] = 'This field is required';
            isValid = false;
          } else {
            delete errors.basicInfo[field];
          }
        });
        
        // Email validation
        if (formData.basicInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.basicInfo.email)) {
          errors.basicInfo.email = 'Invalid email format';
          isValid = false;
        }
        
        // Phone validation - only validate if there's a value
        if (formData.basicInfo.phone && formData.basicInfo.phone.length !== 10) {
          errors.basicInfo.phone = 'Phone number must be 10 digits';
          isValid = false;
        }
        break;

      case 2:
        // Images validation
        if (!formData.images.logo) {
          errors.images.logo = 'Logo is required';
          isValid = false;
        }
        break;

      case 3:
        // Facilities validation
        if (formData.facilities.length === 0) {
          errors.facilities = 'Select at least one facility';
          isValid = false;
        }
        break;

      case 4:
        // Batches validation
        const batchErrors = formData.batches.map(batch => {
          const error = {};
          if (!batch.name) error.name = 'Batch name is required';
          if (!batch.subjects.length) error.subjects = 'Select at least one subject';
          if (!batch.timing) error.timing = 'Timing is required';
          return error;
        });
        
        if (batchErrors.some(error => Object.keys(error).length > 0)) {
          errors.batches = batchErrors;
          isValid = false;
        }
        break;

      case 5:
        // Faculty validation
        const facultyErrors = formData.faculty.map(faculty => {
          const error = {};
          if (!faculty.name) error.name = 'Faculty name is required';
          if (!faculty.qualification) error.qualification = 'Qualification is required';
          if (!faculty.subject) error.subject = 'Subject is required';
          return error;
        });
        
        if (facultyErrors.some(error => Object.keys(error).length > 0)) {
          errors.faculty = facultyErrors;
          isValid = false;
        }
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Check if user exists
        if (!user) {
          throw new Error('Please login to register a coaching center');
        }
        // Any other initialization logic here
      } catch (error) {
        console.error('Error:', error);
        setError(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, [name]: phoneValue }
      }));
      return;
    }

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

  // Update the nextStep function
  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
      } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) {
      nextStep(e);
      return;
    }
    
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

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <p className="text-gray-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const Header = ({ currentStep, steps }) => (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-6">
          {/* Progress Bar - Mobile */}
          <div className="md:hidden">
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps Progress - Desktop */}
          <div className="hidden md:flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center w-full">
                <div className="relative flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-12 h-12 rounded-full 
                      transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap
                    ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-full mx-4">
                    <div className={`h-1 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentWrapper = ({ children }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );

  const NavigationButtons = ({ currentStep, totalSteps, loading, prevStep, handleSubmit }) => (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <button
        onClick={prevStep}
        className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium
          ${currentStep === 1 
            ? 'invisible' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Previous
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`flex items-center px-6 py-3 rounded-xl text-sm font-medium
          ${currentStep === totalSteps
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
            : 'bg-indigo-600'} 
          text-white
          ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <>
            {currentStep === totalSteps ? 'Complete Registration' : 'Next'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </>
        )}
      </button>
    </div>
  );

  // Update the input field to show error messages
  const InputField = ({ label, name, type = 'text', value, onChange, error, ...props }) => (
    <div>
      <label className={labelClasses}>
        {label} {props.required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClasses} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-blue-50/20">
      <Header currentStep={currentStep} steps={steps} />
      
      <ContentWrapper>
        <div>
          {currentStep === 1 && (
            <section className="basic-info">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>
                    Coaching Name {required && '*'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.basicInfo.name}
                    onChange={handleBasicInfoChange}
                    className={`${inputClasses} ${formErrors.basicInfo?.name ? 'border-red-500' : ''}`}
                    placeholder="Enter coaching name"
                    autoComplete="off"
                    style={{ WebkitAppearance: 'none' }}
                  />
                  {formErrors.basicInfo?.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.basicInfo.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.basicInfo.description}
                    onChange={handleBasicInfoChange}
                    rows={4}
                    className={`${inputClasses} ${formErrors.basicInfo?.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your coaching center"
                  />
                  {formErrors.basicInfo?.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.basicInfo.description}</p>
                  )}
                </div>

                <InputField
                  label="Address"
                  name="address"
                  required
                  value={formData.basicInfo.address}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.address}
                  placeholder="Enter complete address"
                />

                <InputField
                  label="City"
                  name="city"
                  required
                  value={formData.basicInfo.city}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.city}
                  placeholder="Enter city"
                />

                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.basicInfo.phone}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.phone}
                  placeholder="Enter 10-digit number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={10}
                />

                <InputField
                  label="Email"
                  name="email"
                  required
                  value={formData.basicInfo.email}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.email}
                  placeholder="Enter email address"
                />

                <InputField
                  label="Website"
                  name="website"
                  value={formData.basicInfo.website}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.website}
                  placeholder="Enter website URL (optional)"
                />

                <InputField
                  label="Established Year"
                  name="establishedYear"
                  required
                  value={formData.basicInfo.establishedYear}
                  onChange={handleBasicInfoChange}
                  error={formErrors.basicInfo?.establishedYear}
                  placeholder="Enter establishment year"
                />
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="images">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>

              {/* Logo and Cover Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Logo Upload */}
                <div className="relative">
                  <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${imagePreviews.logo ? 'bg-gray-50' : ''}`}>
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
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage('logo')}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="logo"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload Logo</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="relative">
                  <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${imagePreviews.coverImage ? 'bg-gray-50' : ''}`}>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'coverImage')}
                      className="hidden"
                    />
                    {imagePreviews.coverImage ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.coverImage}
                          alt="Cover preview"
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage('coverImage')}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="coverImage"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload Cover Image</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Classroom Images */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Classroom Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.classroomImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Classroom ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage('classroomImages', index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                    <input
                      type="file"
                      id="classroomImages"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, 'classroomImages')}
                      className="hidden"
                    />
                    <label
                      htmlFor="classroomImages"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Add Classroom Images</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="facilities">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2">
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className="batches">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Batches</h2>
                <button
                  type="button"
                  onClick={addBatch}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Batch
                </button>
              </div>

              {formData.batches.map((batch, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Batch Name */}
                    <div>
                      <label className={labelClasses}>
                        Batch Name
                      </label>
                      <input
                        type="text"
                        value={batch.name}
                        onChange={(e) => handleBatchChange(index, "name", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., Morning Batch"
                      />
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className={labelClasses}>
                        Subjects
                      </label>
                      <input
                        type="text"
                        value={batch.subjects}
                        onChange={(e) => handleBatchChange(index, "subjects", e.target.value.split(","))}
                        className={inputClasses}
                        placeholder="e.g., Math, Physics"
                      />
                    </div>

                    {/* Batch Timing */}
                    <div>
                      <label className={labelClasses}>
                        Batch Timing
                      </label>
                      <input
                        type="text"
                        value={batch.timing}
                        onChange={(e) => handleBatchChange(index, "timing", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 10:00 AM - 12:00 PM"
                      />
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className={labelClasses}>
                        Capacity
                      </label>
                      <input
                        type="number"
                        value={batch.capacity}
                        onChange={(e) => handleBatchChange(index, "capacity", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 30"
                      />
                    </div>

                    {/* Available Seats */}
                    <div>
                      <label className={labelClasses}>
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={batch.availableSeats}
                        onChange={(e) => handleBatchChange(index, "availableSeats", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 10"
                      />
                    </div>

                    {/* Monthly Fee */}
                    <div>
                      <label className={labelClasses}>
                        Monthly Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={batch.monthlyFee}
                        onChange={(e) => handleBatchChange(index, "monthlyFee", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 2000"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className={labelClasses}>
                        Duration (Months)
                      </label>
                      <input
                        type="number"
                        value={batch.duration}
                        onChange={(e) => handleBatchChange(index, "duration", e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 6"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </section>
          )}

          {currentStep === 5 && (
            <section className="faculty">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Faculty</h2>
                <button
                  type="button"
                  onClick={addFaculty}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Faculty
                </button>
              </div>

              {formData.faculty.map((faculty, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Faculty Name */}
                    <div>
                      <label className={labelClasses}>
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={faculty.name}
                        onChange={(e) => handleFacultyChange(index, 'name', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter faculty name"
                      />
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className={labelClasses}>
                        Qualification *
                      </label>
                      <input
                        type="text"
                        required
                        value={faculty.qualification}
                        onChange={(e) => handleFacultyChange(index, 'qualification', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., PhD in Physics"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className={labelClasses}>
                        Experience *
                      </label>
                      <input
                        type="text"
                        required
                        value={faculty.experience}
                        onChange={(e) => handleFacultyChange(index, 'experience', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={labelClasses}>
                        Subject *
                      </label>
                      <select
                        required
                        value={faculty.subject}
                        onChange={(e) => handleFacultyChange(index, 'subject', e.target.value)}
                        className={inputClasses}
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map(subject => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className={labelClasses}>
                        Bio
                      </label>
                      <textarea
                        value={faculty.bio}
                        onChange={(e) => handleFacultyChange(index, 'bio', e.target.value)}
                        rows={3}
                        className={inputClasses}
                        placeholder="Enter faculty bio (optional)"
                      />
                    </div>

                    {/* Faculty Image */}
                    <div className="md:col-span-2">
                      <label className={labelClasses}>
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-4">
                        {faculty.image ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(faculty.image)}
                              alt={faculty.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleFacultyChange(index, 'image', null)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                            <input
                              type="file"
                              id={`faculty-image-${index}`}
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFacultyChange(index, 'image', e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor={`faculty-image-${index}`}
                              className="cursor-pointer"
                            >
                              <Camera className="h-8 w-8 text-gray-400" />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Faculty Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        faculty: prev.faculty.filter((_, i) => i !== index)
                      }));
                    }}
                    className="mt-4 text-red-600 hover:text-red-700"
                  >
                    Remove Faculty
                  </button>
                </div>
              ))}
            </section>
          )}
        </div>

        <NavigationButtons 
          currentStep={currentStep}
          totalSteps={totalSteps}
          loading={loading}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      </ContentWrapper>
    </div>
  );
};

export default CoachingRegistration;