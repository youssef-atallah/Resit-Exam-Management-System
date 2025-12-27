# Resit Exam Management System - API Documentation

Welcome to the API documentation for the Resit Exam Management System at Üsküdar University.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Categories](#api-categories)
4. [Common Responses](#common-responses)
5. [Sample Data](#sample-data)

## Getting Started

### Base URL
```
http://localhost:3000
```

### Content Type
All requests and responses use JSON format:
```
Content-Type: application/json
```

### Required Fields
Most operations require a `secretaryId` for authorization. This represents the secretary performing the action.

## Authentication

Currently, the system uses secretary ID-based authorization. Include the `secretaryId` in the request body for operations that modify data.

**Example:**
```json
{
  "secretaryId": "sec-001",
  // ... other fields
}
```

## API Categories

The API is organized into the following categories:

### 📘 [Course Management](./COURSES.md)
- Create, read, update, and delete courses
- Assign instructors to courses
- View course statistics and student enrollments

### 👨‍🎓 [Student Management](./STUDENTS.md)
- Create, read, update, and delete students
- Enroll students in courses
- View student grades and course details
- Manage student resit exam enrollments

### 👨‍🏫 [Instructor Management](./INSTRUCTORS.md)
- Create, read, update, and delete instructors
- Assign instructors to courses
- View instructor course details
- Manage instructor resit exams

### 📝 [Resit Exam Management](./RESIT_EXAMS.md)
- Create and manage resit exams
- Enroll students in resit exams
- Set and update resit exam grades
- View resit exam results

### 🔐 [Secretary Operations](./SECRETARIES.md)
- Secretary management
- Administrative operations
- System-wide queries

## Common Responses

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* relevant data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Missing or invalid parameters |
| 403 | Forbidden | Unauthorized operation |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 500 | Internal Server Error | Server-side error |

## Sample Data

The system comes pre-populated with sample data for testing:

### Secretaries
- **Sarah Johnson** (`sec-001`): sarah.johnson@uskudar.edu.tr
- **Michael Chen** (`sec-002`): michael.chen@uskudar.edu.tr

### Instructors
- **Dr. Youssef Atallah** (`inst-001`): youssef.atallah@uskudar.edu.tr
- **Prof. Emily Watson** (`inst-002`): emily.watson@uskudar.edu.tr
- **Dr. Ahmed Hassan** (`inst-003`): ahmed.hassan@uskudar.edu.tr
- **Dr. Maria Garcia** (`inst-004`): maria.garcia@uskudar.edu.tr

### Students
- **Ali Yilmaz** (`stu-001`): ali.yilmaz@student.uskudar.edu.tr
- **Ayşe Demir** (`stu-002`): ayse.demir@student.uskudar.edu.tr
- **Mehmet Kaya** (`stu-003`): mehmet.kaya@student.uskudar.edu.tr
- **Fatma Özdemir** (`stu-004`): fatma.ozdemir@student.uskudar.edu.tr
- **Can Arslan** (`stu-005`): can.arslan@student.uskudar.edu.tr
- **Zeynep Şahin** (`stu-006`): zeynep.sahin@student.uskudar.edu.tr

**All passwords**: `password123`

### Courses
- **SE302**: Software Project Management
- **CS101**: Introduction to Computer Science
- **MATH201**: Calculus II
- **DS205**: Data Structures and Algorithms
- **DB301**: Database Management Systems

For complete sample data details, see [SAMPLE_DATA.md](./SAMPLE_DATA.md)

## Quick Start Examples

### Create a Course
```bash
curl -X POST http://localhost:3000/course \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "MATH101",
    "name": "Calculus I",
    "department": "Mathematics",
    "secretaryId": "sec-001"
  }'
```

### Get Student Information
```bash
curl http://localhost:3000/student/stu-001
```

### Enroll Student in Course
```bash
curl -X POST http://localhost:3000/student/stu-001 \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "MATH101",
    "secretaryId": "sec-001"
  }'
```

## Development

### Running the Server
```bash
npm start
```

### Seeding the Database
```bash
npm run seed
```

### Server Information
- **Port**: 3000
- **Frontend**: http://localhost:3000/index.html

## Support

For issues or questions, please refer to the individual category documentation or contact the development team.

---

**Last Updated**: December 27, 2025
