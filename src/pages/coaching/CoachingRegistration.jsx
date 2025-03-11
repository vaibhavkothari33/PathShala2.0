import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Minus, Camera, X } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to register a coaching center');
      navigate('/login');
    }
  }, [user, navigate]);

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
  
      // ✅ Validate required fields
      if (!formData.basicInfo.description) {
        toast.error("Description is required!");
        return;
      }
  
      const submissionData = {
        name: formData.basicInfo.name,
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
        batches_subjects: formData.batches.map(batch => batch.subjects),
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
        faculty_image: updatedFaculty.map(faculty => faculty.image)
      };
  
      console.log("Final Submission Data:", JSON.stringify(submissionData, null, 2));
  
     
      
      await coachingService.registerCoaching(submissionData);
      toast.success("Coaching center registered successfully!");
      navigate("/coaching/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register coaching center");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Coaching Registration</h1>

          {/* Basic Information */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coaching Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.basicInfo.name}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter coaching name"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.basicInfo.description}
                  onChange={handleBasicInfoChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your coaching center"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.basicInfo.address}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter complete address"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.basicInfo.city}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter city"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.basicInfo.phone}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter contact number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.basicInfo.email}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.basicInfo.website}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter website URL (optional)"
                />
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year *
                </label>
                <input
                  type="text"
                  name="establishedYear"
                  required
                  value={formData.basicInfo.establishedYear}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter establishment year"
                />
              </div>
            </div>
          </section>

          {/* Images Upload */}
          <section className="mb-12">
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

          {/* Facilities */}
          <section className="mb-12">
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

          {/* Batches */}
          <section className="mb-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Name
                    </label>
                    <input
                      type="text"
                      value={batch.name}
                      onChange={(e) => handleBatchChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Morning Batch"
                    />
                  </div>
                  {/* Add more batch fields */}
                </div>
              </div>
            ))}
          </section>

          {/* Faculty */}
          <section className="mb-12">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={faculty.name}
                      onChange={(e) => handleFacultyChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter faculty name"
                    />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      required
                      value={faculty.qualification}
                      onChange={(e) => handleFacultyChange(index, 'qualification', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., PhD in Physics"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience *
                    </label>
                    <input
                      type="text"
                      required
                      value={faculty.experience}
                      onChange={(e) => handleFacultyChange(index, 'experience', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5 years"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={faculty.subject}
                      onChange={(e) => handleFacultyChange(index, 'subject', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={faculty.bio}
                      onChange={(e) => handleFacultyChange(index, 'bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter faculty bio (optional)"
                    />
                  </div>

                  {/* Faculty Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg 
                transition-all duration-200 shadow-md hover:shadow-lg
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700'}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                'Register Coaching Center'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CoachingRegistration; 