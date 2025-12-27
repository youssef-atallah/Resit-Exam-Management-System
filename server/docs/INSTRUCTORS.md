# Instructor Management API

Complete API documentation for instructor-related operations.

## Table of Contents
- [Existing Instructors](#existing-instructors)
- [Create Instructor](#create-instructor)
- [Get Instructor](#get-instructor)
- [Update Instructor](#update-instructor)
- [Delete Instructor](#delete-instructor)
- [Assign Instructor to Course](#assign-instructor-to-course)
- [Unassign Instructor from Course](#unassign-instructor-from-course)
- [Get Instructor Courses](#get-instructor-courses)
- [Get Instructor Course Details](#get-instructor-course-details)
- [Set Student Course Grades](#set-student-course-grades)

---

## Existing Instructors

The following instructors were created during seeding:

| Instructor ID | Name | Email | Department |
|---------------|------|-------|------------|
| `inst-001` | Dr. Youssef Atallah | youssef.atallah@uskudar.edu.tr | Software Engineering |
| `inst-002` | Prof. Emily Watson | emily.watson@uskudar.edu.tr | Computer Science |
| `inst-003` | Dr. Ahmed Hassan | ahmed.hassan@uskudar.edu.tr | Mathematics |
| `inst-004` | Dr. Maria Garcia | maria.garcia@uskudar.edu.tr | Software Engineering |

All instructor passwords are: `password123`

---

## Create Instructor

Create a new instructor in the system.

**Endpoint:** `POST /instructor`

**Request Body:**
```json
{
  "instructorId": "inst-005",
  "name": "Dr. John Smith",
  "email": "john.smith@uskudar.edu.tr",
  "password": "password123",
  "secretaryId": "sec-001"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Instructor created successfully",
  "instructor": {
    "id": "inst-005",
    "name": "Dr. John Smith",
    "email": "john.smith@uskudar.edu.tr",
    "courses": [],
    "resitExams": []
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Instructor already exists

---

## Get Instructor

Retrieve instructor information by ID.

**Endpoint:** `GET /instructor/:id`

**Example:** `GET /instructor/inst-001`

**Success Response (200):**
```json
{
  "success": true,
  "instructor": {
    "id": "inst-001",
    "name": "Dr. Youssef Atallah",
    "email": "youssef.atallah@uskudar.edu.tr",
    "courses": ["SE302"],
    "resitExams": ["resit-SE302"],
    "created_at": "2025-12-27T00:51:23.000Z",
    "created_by": "sec-001"
  }
}
```

**Error Response:**
- `404` - Instructor not found

---

## Update Instructor

Update instructor information.

**Endpoint:** `PUT /instructor/:id`

**Request Body:**
```json
{
  "name": "Dr. Youssef Atallah Updated",
  "email": "youssef.updated@uskudar.edu.tr",
  "password": "newpassword123",
  "secretaryId": "sec-001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Instructor updated successfully",
  "instructor": {
    "id": "inst-001",
    "name": "Dr. Youssef Atallah Updated",
    "email": "youssef.updated@uskudar.edu.tr"
  }
}
```

---

## Delete Instructor

Delete an instructor from the system.

**Endpoint:** `DELETE /instructor/:id`

**Request Body:**
```json
{
  "secretaryId": "sec-001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Instructor deleted successfully"
}
```

**Note:** Deleting an instructor will:
- Remove all course assignments
- Delete all resit exams created by them
- Remove all associated data
- Delete the user account

---

## Assign Instructor to Course

Assign an instructor to teach a course.

**Endpoint:** `POST /instructor/course/:id`

**URL Parameter:** `:id` - Instructor ID

**Request Body:**
```json
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Instructor assigned to course successfully"
}
```

**Error Responses:**
- `404` - Instructor or course not found
- `400` - Course already has an instructor

---

## Unassign Instructor from Course

Remove an instructor from a course.

**Endpoint:** `DELETE /instructor/course/:id`

**URL Parameter:** `:id` - Instructor ID

**Request Body:**
```json
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Instructor unassigned from course successfully"
}
```

---

## Get Instructor Courses

Get all courses taught by an instructor.

**Endpoint:** `GET /instructor/courses/:id`

**Example:** `GET /instructor/courses/inst-001`

**Success Response (200):**
```json
{
  "success": true,
  "courses": ["SE302", "DB301"]
}
```

---

## Get Instructor Course Details

Get detailed information about all courses taught by an instructor, including student counts and resit exams.

**Endpoint:** `GET /instructor/cdetails/:id`

**Example:** `GET /instructor/cdetails/inst-001`

**Success Response (200):**
```json
{
  "success": true,
  "courses": [
    {
      "courseId": "SE302",
      "courseName": "Software Project Management",
      "department": "Software Engineering",
      "instructor_id": "inst-001",
      "student_count": 4,
      "students": ["stu-001", "stu-002", "stu-003", "stu-004"],
      "resit_exam": {
        "id": "resit-SE302",
        "name": "Software Project Management - Resit Exam",
        "department": "Software Engineering",
        "exam_date": null,
        "deadline": null,
        "location": null
      }
    }
  ]
}
```

---

## Set Student Course Grades

Set grades for multiple students in a course.

**Endpoint:** `POST /instructor/course/grades/:courseId`

**URL Parameter:** `:courseId` - Course ID

**Request Body:**
```json
{
  "instructorId": "inst-001",
  "grades": [
    {
      "studentId": "stu-001",
      "grade": 85,
      "gradeLetter": "A"
    },
    {
      "studentId": "stu-002",
      "grade": 72,
      "gradeLetter": "B"
    },
    {
      "studentId": "stu-003",
      "grade": 45,
      "gradeLetter": "F"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Grades set successfully for 3 students"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid data
- `403` - Instructor not authorized for this course
- `404` - Course or student not found

---

## Common Error Responses

### Instructor Not Found
```json
{
  "success": false,
  "error": "Instructor not found"
}
```
**HTTP Status:** `404`

### Instructor Already Exists
```json
{
  "success": false,
  "error": "Instructor already exists",
  "details": "An instructor with ID 'inst-005' already exists"
}
```
**HTTP Status:** `409`

### Unauthorized Operation
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Only secretaries can perform this operation"
}
```
**HTTP Status:** `403`

---

[← Back to Main Documentation](./README.md) | [Next: Resit Exams →](./RESIT_EXAMS.md)
