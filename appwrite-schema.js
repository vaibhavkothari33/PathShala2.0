{   
  "$id": "coaching",
  "name": "Coaching Centers",
  "permissions": ["read('any')", "write('team')"],
  "attributes": {
    "basicInfo": {
      "type": "object",
      "required": true,
      "attributes": {
        "name": { "type": "string", "required": true },
        "description": { "type": "string", "required": true },
        "address": { "type": "string", "required": true },
        "city": { "type": "string", "required": true },
        "phone": { "type": "string", "required": true },
        "email": { "type": "string", "required": true },
        "website": { "type": "string", "required": false },
        "establishedYear": { "type": "string", "required": true }
      } 
    },
    "images": {
      "type": "object",
      "required": true,
      "attributes": {
        "logo": { "type": "string", "required": false },
        "coverImage": { "type": "string", "required": false },
        "classroomImages": { "type": "array", "items": { "type": "string" } }
      }
    },
    "facilities": {
      "type": "array",
      "required": true,
      "items": { "type": "string" }
    },
    "subjects": {
      "type": "array",
      "required": true,
      "items": { "type": "string" }
    },
    "batches": {
      "type": "array",
      "required": true,
      "items": {
        "type": "object",
        "attributes": {
          "name": { "type": "string", "required": true },
          "subjects": { "type": "array", "items": { "type": "string" } },
          "timing": { "type": "string", "required": true },
          "capacity": { "type": "integer", "required": true },
          "availableSeats": { "type": "integer", "required": true },
          "monthlyFee": { "type": "integer", "required": true },
          "duration": { "type": "string", "required": true }
        }
      }
    },
    "faculty": {
      "type": "array",
      "required": true,
      "items": {
        "type": "object",
        "attributes": {
          "name": { "type": "string", "required": true },
          "qualification": { "type": "string", "required": true },
          "experience": { "type": "string", "required": true },
          "subject": { "type": "string", "required": true },
          "bio": { "type": "string", "required": false },
          "image": { "type": "string", "required": false }
        }
      }
    },
    "slug": { "type": "string", "required": true },
    "createdAt": { "type": "string", "required": true },
    "updatedAt": { "type": "string", "required": true }
  },
  "indexes": [
    {
      "key": "slug",
      "type": "unique",
      "attributes": ["slug"]
    },
    {
      "key": "city",
      "type": "key",
      "attributes": ["basicInfo.city"]
    }
  ]
} 