# Pathshala - Educational Platform

## Overview
Pathshala is a comprehensive educational platform that connects students with coaching institutes. It provides a seamless interface for both students seeking quality education and coaching centers looking to expand their reach.

## Features

### For Students
- 🎓 Access to premium study materials
- 👨‍🏫 Learn from top educators
- 📊 Track learning progress
- 🔍 Search and filter coaching centers
- 📱 Mobile-responsive interface
- ⭐ Rate and review coaching centers

### For Coaching Institutes
- 📈 Comprehensive institute management
- 📊 Advanced analytics dashboard
- 🤖 Automated administrative tasks
- 📸 Multiple image uploads (logo, cover, classrooms)
- 📝 Detailed batch management
- 👥 Faculty profile management

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Framer Motion
- React Router DOM
- React Icons
- Lucide React

### Backend
- Appwrite
  - Authentication
  - Database
  - Storage
  - OAuth2

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm/yarn
- Appwrite instance

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pathshala.git
cd pathshala
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_APPWRITE_ENDPOINT=your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COACHING_COLLECTION_ID=your-collection-id
VITE_APPWRITE_IMAGES_BUCKET_ID=your-bucket-id
```

4. Start the development server
```bash
npm run dev
```

### Appwrite Setup

1. Create a new project in Appwrite Console
2. Create a database with the following collections:
   - Coaching Centers
   - Students
   - Faculty
   - Batches

3. Set up authentication methods:
   - Email/Password
   - Google OAuth2 (optional)

4. Create storage bucket for images

5. Set up appropriate security rules and permissions

## Project Structure