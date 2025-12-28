# 📖 API Quick Reference

Complete endpoint reference for the Resit Exam Management System API.

---

## Base URL

```
http://localhost:3000
```

## Authentication

All endpoints except `/auth/signin` require JWT authentication.

```
Authorization: Bearer <token>
```

---

## Endpoints by Category

### 🔐 Authentication

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/signin` | ❌ | All | Sign in and get JWT token |

---

### 👨‍🎓 Student Routes

#### JWT-Based (Own Data)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/my/profile` | ✅ | Student | Get own profile |
| PUT | `/my/profile` | ✅ | Student | Update own profile |
| GET | `/my/courses` | ✅ | Student | Get own enrolled courses |
| GET | `/my/course-details` | ✅ | Student | Get own course details with grades |
| GET | `/my/resit-exams` | ✅ | Student | Get own resit exams |

#### Secretary Routes (Admin)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/student/` | ✅ | Secretary | Create new student |
| DELETE | `/student/:id` | ✅ | Secretary | Delete student |
| PUT | `/student/:id` | ✅ | Secretary | Update student info |
| POST | `/student/:id` | ✅ | Secretary | Enroll student in course |
| DELETE | `/student-course/:id` | ✅ | Secretary | Remove student from course |
| POST | `/student/resit-exam/:id` | ✅ | Secretary | Enroll student in resit exam |
| DELETE | `/student/resit-exam/:id` | ✅ | Secretary | Remove student from resit exam |

#### View by ID

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/student/:id` | ✅ | Owner/Instructor/Secretary | Get student information |
| GET | `/student/courses/:id` | ✅ | Owner/Instructor/Secretary | Get student's course IDs |
| GET | `/student/c-details/:id` | ✅ | Owner/Instructor/Secretary | Get student's course details |
| GET | `/student/resitexams/:id` | ✅ | Owner/Instructor/Secretary | Get student's resit exams |
| GET | `/student/r-exams/:id` | ✅ | Owner/Instructor/Secretary | Get student's resit exams (alt) |

#### Instructor Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/instructor/resit-results/student/:studentId` | ✅ | Instructor | Get all resit results for student |
| GET | `/instructor/resit-results/:studentId/:resitExamId` | ✅ | Instructor | Get specific resit result |

---

### 👨‍🏫 Instructor Routes

#### JWT-Based (Own Data)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/my/instructor/profile` | ✅ | Instructor | Get own profile |
| PUT | `/my/instructor/profile` | ✅ | Instructor | Update own profile |
| GET | `/my/instructor/courses` | ✅ | Instructor | Get own courses |
| GET | `/my/instructor/course-details` | ✅ | Instructor | Get own course details |
| GET | `/my/instructor/resit-exams` | ✅ | Instructor | Get own resit exams |

#### Secretary Routes (Admin)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/instructor` | ✅ | Secretary | Create new instructor |
| DELETE | `/instructor/:id` | ✅ | Secretary | Delete instructor |
| PUT | `/instructor/:id` | ✅ | Secretary | Update instructor info |
| POST | `/instructor/course/:id` | ✅ | Secretary | Assign instructor to course |
| DELETE | `/instructor/course/:id` | ✅ | Secretary | Unassign instructor from course |

#### View by ID

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/instructor/:id` | ✅ | Owner/Secretary | Get instructor information |
| GET | `/instructor/courses/:id` | ✅ | Owner/Secretary | Get instructor's course IDs |
| GET | `/instructor/cdetails/:id` | ✅ | Owner/Secretary | Get instructor's course details |

#### Course Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/instructor/course/grades/:courseId` | ✅ | Instructor | Set grades for multiple students |

#### Resit Exam Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/instructor/r-exam/:id` | ✅ | Instructor | Create resit exam |
| POST | `/r-exam/:id` | ✅ | Instructor | Create resit exam (alt) |
| PUT | `/instructor/r-exam/:id` | ✅ | Instructor | Update resit exam |
| DELETE | `/instructor/r-exam/:id` | ✅ | Instructor | Delete resit exam |
| GET | `/instructor/r-exams/:id` | ✅ | Owner/Secretary | Get instructor's resit exams |
| PUT | `/instructor/r-announcement/:id` | ✅ | Instructor | Set resit exam announcement |

#### Grading

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| PUT | `/instructor/course/:courseId/student/:studentId` | ✅ | Instructor | Update single student's resit grade |
| PUT | `/instructor/resit-results/all/:resitExamId` | ✅ | Instructor | Update all students' resit grades |
| GET | `/instructor/resit-results/exam/:resitExamId` | ✅ | Instructor | Get all results for resit exam |

---

### 📚 Course Routes

#### Secretary Routes (Admin)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/course` | ✅ | Secretary | Create new course |
| PUT | `/course/:id` | ✅ | Secretary | Update course details |
| DELETE | `/course/:id` | ✅ | Secretary | Delete course |

#### Instructor Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/course/students/:id` | ✅ | Instructor/Secretary | Get all students in course |
| GET | `/course/statistics/:id` | ✅ | Instructor/Secretary | Get course statistics |

#### Public Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/course/instructor/:id` | ✅ | All | Get course instructor |
| GET | `/course/:id` | ✅ | All | Get course details |

---

### 📝 Resit Exam Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/r-exam/:id` | ✅ | All | Get resit exam details |

---

### 🔧 Secretary Routes

#### System-Wide Queries

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/secretary/courses` | ✅ | Secretary | Get all courses |
| GET | `/secretary/students` | ✅ | Secretary | Get all students |
| GET | `/secretary/instructors` | ✅ | Secretary | Get all instructors |
| GET | `/secretary/resit-exams` | ✅ | Secretary | Get all resit exams |

#### Resit Exam Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| PUT | `/secretary/confirm/resit-exam/:id` | ✅ | Secretary | Confirm/update resit exam |

---

## Request/Response Examples

### Authentication

#### Sign In

**Request:**
```http
POST /auth/signin
Content-Type: application/json

{
  "id": "stu-001",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "stu-001",
    "name": "John Doe",
    "email": "john@university.edu",
    "role": "student"
  }
}
```

---

### Student Operations

#### Get Own Profile

**Request:**
```http
GET /my/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "student": {
    "id": "stu-001",
    "name": "John Doe",
    "email": "john@university.edu",
    "courses": ["CS101", "CS102"],
    "resitExams": ["resit-CS101-001"]
  }
}
```

#### Update Own Profile

**Request:**
```http
PUT /my/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated Doe",
  "email": "john.new@university.edu"
}
```

#### Create Student (Secretary Only)

**Request:**
```http
POST /student/
Authorization: Bearer <secretary-token>
Content-Type: application/json

{
  "id": "stu-999",
  "name": "New Student",
  "email": "new@university.edu",
  "password": "password123"
}
```

---

### Instructor Operations

#### Get Own Courses

**Request:**
```http
GET /my/instructor/courses
Authorization: Bearer <instructor-token>
```

**Response:**
```json
{
  "success": true,
  "courses": ["CS101", "CS102", "CS201"]
}
```

#### Create Resit Exam

**Request:**
```http
POST /instructor/r-exam/inst-001
Authorization: Bearer <instructor-token>
Content-Type: application/json

{
  "courseId": "CS101",
  "date": "2024-06-15T10:00:00Z",
  "location": "Room 101",
  "deadline": "2024-06-10T23:59:59Z",
  "announcement": "Bring your student ID"
}
```

#### Set Student Grades

**Request:**
```http
POST /instructor/course/grades/CS101
Authorization: Bearer <instructor-token>
Content-Type: application/json

{
  "grades": [
    {"studentId": "stu-001", "grade": 85},
    {"studentId": "stu-002", "grade": 92}
  ]
}
```

---

### Course Operations

#### Create Course (Secretary Only)

**Request:**
```http
POST /course
Authorization: Bearer <secretary-token>
Content-Type: application/json

{
  "id": "CS999",
  "name": "Advanced Topics",
  "department": "Computer Science",
  "instructorId": "inst-001"
}
```

#### Get Course Details

**Request:**
```http
GET /course/CS101
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": "CS101",
    "name": "Introduction to Programming",
    "department": "Computer Science",
    "instructor": {
      "id": "inst-001",
      "name": "Dr. Alice Johnson"
    },
    "studentCount": 25
  }
}
```

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Error Responses

### 401 Unauthorized

```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden - Insufficient permissions",
  "required": ["secretary"],
  "current": "student"
}
```

```json
{
  "error": "Forbidden - You can only access your own resources"
}
```

### 404 Not Found

```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to process request",
  "details": "Database connection error"
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:

- **Sign In**: 5 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

---

## Pagination

Currently not implemented. All list endpoints return full results.

Recommended for production:
```
GET /secretary/students?page=1&limit=50
```

---

## Filtering & Sorting

Currently not implemented. Recommended for production:
```
GET /secretary/students?department=CS&sort=name&order=asc
```

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Sign in as student
TOKEN=$(curl -s -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"id": "stu-001", "password": "password123"}' \
  | jq -r '.token')

# 2. Get profile
curl -X GET http://localhost:3000/my/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Get courses
curl -X GET http://localhost:3000/my/courses \
  -H "Authorization: Bearer $TOKEN"

# 4. Get course details
curl -X GET http://localhost:3000/my/course-details \
  -H "Authorization: Bearer $TOKEN"

# 5. Get resit exams
curl -X GET http://localhost:3000/my/resit-exams \
  -H "Authorization: Bearer $TOKEN"
```

---

## Additional Resources

- **[Getting Started](./GETTING_STARTED.md)** - Installation and setup
- **[Authentication Guide](./AUTH.md)** - Detailed auth documentation
- **[Database Schema](./DATABASE_SCHEMA.md)** - Database structure
- **[Main Documentation](./README.md)** - Complete system overview

---

**Total Endpoints**: 55  
**Last Updated**: December 2024
