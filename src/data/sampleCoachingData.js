export const defaultCoachingCenters = [
  {
    name: "Excellence Academy",
    description: "Excellence Academy is a premier coaching institute dedicated to providing quality education in sciences and mathematics.",
    address: "Plot 12, Sector 18",
    city: "Noida",
    phone: "+91 98765 43210",
    email: "contact@excellenceacademy.com",
    website: "www.excellenceacademy.com",
    establishedYear: "2010",

    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    classroomImages: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
      "https://images.unsplash.com/photo-1598452963314-b09f397a5c48",
      "https://images.unsplash.com/photo-1627556704302-624286467c65"
    ],

    facilities: [
      "Air Conditioned Classrooms",
      "Digital Learning Tools",
      "Library",
      "Study Material",
      "Doubt Clearing Sessions"
    ],
    subjects: ["Mathematics", "Physics", "Chemistry"],

    batches: [
      {
        name: "Morning Batch",
        subjects: ["Physics", "Chemistry"],
        timing: "6:00 AM - 8:00 AM",
        capacity: 30,
        availableSeats: 8,
        monthlyFee: 2500,
        duration: "2 hours"
      }
    ],

    faculty: [
      {
        name: "Dr. Sharma",
        qualification: "PhD in Physics",
        experience: "15 years",
        subject: "Physics",
        bio: "Expert in quantum mechanics",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
      }
    ],

    slug: "excellence-academy",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Science Hub",
    description: "Science Hub is a leading coaching center focused on helping students excel in science subjects.",
    address: "15A, Sector 15",
    city: "Noida",
    phone: "+91 98765 43211",
    email: "info@sciencehub.com",
    website: "www.sciencehub.com",
    establishedYear: "2012",

    logo: "https://images.unsplash.com/photo-1597733336794-12d05021d510",
    coverImage: "https://images.unsplash.com/photo-1597733336794-12d05021d510",
    classroomImages: [
      "https://images.unsplash.com/photo-1595385540436-51e9b61b3e6e",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7"
    ],

    facilities: [
      "Air Conditioned Classrooms",
      "Online Classes",
      "Study Material",
      "Computer Lab"
    ],
    subjects: ["Physics", "Chemistry", "Biology"],

    batches: [
      {
        name: "Morning Batch",
        subjects: ["Biology", "Chemistry"],
        timing: "7:00 AM - 9:00 AM",
        capacity: 35,
        availableSeats: 10,
        monthlyFee: 2800,
        duration: "2 hours"
      }
    ],

    faculty: [
      {
        name: "Dr. Gupta",
        qualification: "PhD in Chemistry",
        experience: "10 years",
        subject: "Chemistry",
        bio: "Expert in organic chemistry",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      }
    ],

    slug: "science-hub",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]; 