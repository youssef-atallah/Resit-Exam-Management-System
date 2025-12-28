# 👨‍🏫 Instructor Management API

<div align="center">

![Endpoints](https://img.shields.io/badge/endpoints-8-blue?style=flat-square)
![Access](https://img.shields.io/badge/access-Secretary%20%7C%20Instructor-green?style=flat-square)

**Complete API documentation for instructor-related operations**

[← Back to Main](./README.md) | [Quick Reference](./QUICK_REFERENCE.md) | [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md)

</div>

---

## 📑 Table of Contents

- [📊 Existing Instructors](#-existing-instructors)
- [➕ Create Instructor](#-create-instructor)
- [🔍 Get Instructor](#-get-instructor)
- [✏️ Update Instructor](#️-update-instructor)
- [🗑️ Delete Instructor](#️-delete-instructor)
- [📚 Course Assignment](#-course-assignment)
- [📖 View Instructor Data](#-view-instructor-data)
- [📝 Grade Management](#-grade-management)
- [❌ Common Errors](#-common-errors)

---

## 📊 Existing Instructors

The following instructors were created during database seeding:

| Instructor ID | Name | Email | Department | Courses |
|---------------|------|-------|------------|---------|
| `inst-001` | Dr. Youssef Atallah | youssef.atallah@uskudar.edu.tr | Software Engineering | SE302 |
| `inst-002` | Prof. Emily Watson | emily.watson@uskudar.edu.tr | Computer Science | CS101, DS205 |
| `inst-003` | Dr. Ahmed Hassan | ahmed.hassan@uskudar.edu.tr | Mathematics | MATH201 |
| `inst-004` | Dr. Maria Garcia | maria.garcia@uskudar.edu.tr | Software Engineering | DB301 |

> 🔑 **Default Password:** All instructors have the password `password123`

---

## ➕ Create Instructor

<details open>
<summary><b>POST</b> <code>/instructor</code></summary>

### Description
Create a new instructor account in the system.

### Access
🔐 **Secretary Only**

### Request Body
```json
{
  "instructorId": "inst-005",
  "name": "Dr. John Smith",
  "email": "john.smith@uskudar.edu.tr",
  "password": "password123",
  "secretaryId": "sec-001"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instructorId` | string | ✅ Yes | Unique instructor identifier |
| `name` | string | ✅ Yes | Instructor's full name |
| `email` | string | ✅ Yes | Instructor's email address |
| `password` | string | ✅ Yes | Instructor's password (min 8 characters) |
| `secretaryId` | string | ✅ Yes | ID of secretary creating the instructor |

### Success Response (201 Created)
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

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required fields | One or more required fields are missing |
| 409 | Instructor already exists | An instructor with this ID already exists |
| 404 | Secretary not found | Invalid secretary ID |

</details>

---

## 🔍 Get Instructor

<details>
<summary><b>GET</b> <code>/instructor/:id</code></summary>

### Description
Retrieve detailed instructor information including courses and resit exams.

### Access
👨‍🏫 **Instructor** (own data) | 🔐 **Secretary** (any instructor)

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Example Request
```bash
GET /instructor/inst-001
```

### Success Response (200 OK)
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

### Error Response
- **404 Not Found** - Instructor does not exist

</details>

---

## ✏️ Update Instructor

<details>
<summary><b>PUT</b> <code>/instructor/:id</code></summary>

### Description
Update instructor's name, email, or password.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Request Body
```json
{
  "name": "Dr. Youssef Atallah Updated",
  "email": "youssef.updated@uskudar.edu.tr",
  "password": "newpassword123",
  "secretaryId": "sec-001"
}
```

### Success Response (200 OK)
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

</details>

---

## 🗑️ Delete Instructor

<details>
<summary><b>DELETE</b> <code>/instructor/:id</code></summary>

### Description
Delete an instructor and all associated data.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Request Body
```json
{
  "secretaryId": "sec-001"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Instructor deleted successfully"
}
```

### ⚠️ Warning
Deleting an instructor will:
- ✖️ Remove all course assignments
- ✖️ Delete all resit exams created by them
- ✖️ Remove all associated data
- ✖️ Delete the user account

</details>

---

## 📚 Course Assignment

### Assign Instructor to Course

<details>
<summary><b>POST</b> <code>/instructor/course/:id</code></summary>

### Description
Assign an instructor to teach a course.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Request Body
```json
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Instructor assigned to course successfully"
}
```

### Error Responses
- **404 Not Found** - Instructor or course not found
- **400 Bad Request** - Course already has an instructor

</details>

### Unassign Instructor from Course

<details>
<summary><b>DELETE</b> <code>/instructor/course/:id</code></summary>

### Description
Remove an instructor from a course.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Request Body
```json
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Instructor unassigned from course successfully"
}
```

</details>

---

## 📖 View Instructor Data

### Get Instructor Courses

<details>
<summary><b>GET</b> <code>/instructor/courses/:id</code></summary>

### Description
Get all courses taught by an instructor.

### Access
👨‍🏫 **Instructor**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "courses": ["SE302", "DB301"]
}
```

</details>

### Get Instructor Course Details

<details>
<summary><b>GET</b> <code>/instructor/cdetails/:id</code></summary>

### Description
Get detailed information about all courses taught by an instructor, including student counts and resit exams.

### Access
👨‍🏫 **Instructor**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Instructor ID |

### Success Response (200 OK)
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

</details>

---

## 📝 Grade Management

### Set Student Course Grades

<details>
<summary><b>POST</b> <code>/instructor/course/grades/:courseId</code></summary>

### Description
Set grades for multiple students in a course.

### Access
👨‍🏫 **Instructor**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `courseId` | string | Course ID |

### Request Body
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

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instructorId` | string | ✅ Yes | ID of instructor setting grades |
| `grades` | array | ✅ Yes | Array of student grades |
| `grades[].studentId` | string | ✅ Yes | Student ID |
| `grades[].grade` | number | ✅ Yes | Numeric grade (0-100) |
| `grades[].gradeLetter` | string | ✅ Yes | Letter grade (A, B, C, D, E, F) |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Grades set successfully for 3 students"
}
```

### Error Responses
- **400 Bad Request** - Missing required fields or invalid data
- **403 Forbidden** - Instructor not authorized for this course
- **404 Not Found** - Course or student not found

</details>

---

## ❌ Common Errors

### Instructor Not Found
```json
{
  "success": false,
  "error": "Instructor not found"
}
```
**HTTP Status:** `404 Not Found`

### Instructor Already Exists
```json
{
  "success": false,
  "error": "Instructor already exists",
  "details": "An instructor with ID 'inst-005' already exists"
}
```
**HTTP Status:** `409 Conflict`

### Unauthorized Operation
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Only secretaries can perform this operation"
}
```
**HTTP Status:** `403 Forbidden`

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": {
    "instructorId": false,
    "name": true,
    "email": false,
    "password": true,
    "secretaryId": false
  }
}
```
**HTTP Status:** `400 Bad Request`

---

<div align="center">

**[⬆ Back to Top](#-instructor-management-api)**

[← Main Documentation](./README.md) | [Courses →](./COURSES.md) | [Students →](./STUDENTS.md) | [Resit Exams →](./RESIT_EXAMS.md)

---

*Last Updated: December 27, 2025*

</div>

