import React, { useState } from "react";
import { Client, Databases, Storage, ID } from "appwrite";
import { useNavigate } from "react-router-dom";

const BookForm = () => {
  const [book, setBook] = useState({
    title: "",
    isbn: "",
    type: "",
    condition: "Good",
    quantity: 1,
    price: "",
    shipping: "Free",
    paymentMode: "UPI",
    email: "",
    phone: "",
    pincode: "",
    images: [],
  });

  const navigate = useNavigate();

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")  // Replace with your endpoint
    .setProject("67d01f2c00009b5761f5");               // Replace with your project ID

  const db = new Databases(client);
  const storage = new Storage(client);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setBook((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Upload Images to Storage Bucket
      const imageUrls = [];

      for (const file of book.images) {
        const uploadedFile = await storage.createFile(
          "67d027ef0022e0393767",         // Replace with your bucket ID
          ID.unique(),
          file
        );

        // Get the image URL
        const fileUrl = storage.getFileView("67d027ef0022e0393767", uploadedFile.$id);
        imageUrls.push(fileUrl.href);  // Store the image URL
      }

      // 2️⃣ Store Book Details in the Database
      await db.createDocument(
        "67d01f6a003bc6b65a7d",              // Replace with your database ID
        "67d01fd0003c9a150f73",            // Replace with your collection ID (recently added books)
        ID.unique(),
        {
          title: book.title,
          isbn: book.isbn,
          type: book.type,
          condition: book.condition,
          quantity: parseInt(book.quantity),
          price: parseFloat(book.price),
          shipping: book.shipping,
          paymentMode: book.paymentMode,
          email: book.email,
          phone: book.phone,
          pincode: book.pincode,
          images: imageUrls,
          createdAt: new Date().toISOString()  // Store the creation date
        }
      );

      alert("Book added successfully!");
      navigate("/buysell");  // Redirect to recently added books

    } catch (error) {
      console.error("Error storing book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Sell Your Book</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Book Title *</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* ISBN */}
        <div className="mb-4">
          <label className="block text-gray-700">ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Book Type */}
        <div className="mb-4">
          <label className="block text-gray-700">Book Type</label>
          <select
            name="type"
            value={book.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Textbook">Textbook</option>
          </select>
        </div>

        {/* Condition */}
        <div className="mb-4">
          <label className="block text-gray-700">Condition</label>
          <div className="flex space-x-4">
            {["Excellent", "Good", "Fair"].map((cond) => (
              <label key={cond} className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={book.condition === cond}
                  onChange={handleChange}
                />
                <span className="ml-2">{cond}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={book.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Shipping */}
        <div className="mb-4">
          <label className="block text-gray-700">Shipping</label>
          <select
            name="shipping"
            value={book.shipping}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Payment Mode */}
        <div className="mb-4">
          <label className="block text-gray-700">Payment Mode</label>
          <select
            name="paymentMode"
            value={book.paymentMode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Account">Bank Account</option>
          </select>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={book.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={book.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Pincode */}
        <div className="mb-4">
          <label className="block text-gray-700">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={book.pincode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookForm;
