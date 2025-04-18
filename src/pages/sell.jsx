import React, { useState } from 'react';

const Sell = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    condition: 'Good',
    description: '',
    sellerName: '',
    contactEmail: ''
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['Fiction', 'Non-Fiction', 'Textbook', 'Biography', 'Self-Help', 'Science', 'History', 'Other'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Used', 'Acceptable'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Seller name is required';
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSubmitSuccess(false);
      return;
    }
    
    // Here you would normally submit the data to your backend
    console.log('Submitting book data:', formData);
    
    // Show success message and reset form
    setSubmitSuccess(true);
    setFormData({
      title: '',
      author: '',
      price: '',
      category: '',
      condition: 'Good',
      description: '',
      sellerName: '',
      contactEmail: ''
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Sell Your Books</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your book has been successfully listed for sale!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Book Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter book title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter author name"
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Price ($) *</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows="4"
            placeholder="Provide a brief description of the book and its condition"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Cover Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="pt-1 text-sm text-gray-500">Upload a cover image (optional)</p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.sellerName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your name"
              />
              {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email"
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition"
          >
            List Book For Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;