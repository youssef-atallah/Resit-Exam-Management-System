# 📘 Course Management API

<div align="center">

![Endpoints](https://img.shields.io/badge/endpoints-7-blue?style=flat-square)
![Access](https://img.shields.io/badge/access-Secretary%20%7C%20Instructor-green?style=flat-square)

**Complete API documentation for course-related operations**

[← Back to Main](./README.md) | [Quick Reference](./QUICK_REFERENCE.md) | [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md)

</div>

---

## 📑 Table of Contents

- [📊 Existing Courses](#-existing-courses)
- [➕ Create Course](#-create-course)
- [🔍 Get Course](#-get-course)
- [✏️ Update Course](#️-update-course)
- [🗑️ Delete Course](#️-delete-course)
- [👥 View Course Students](#-view-course-students)
- [👨‍🏫 View Course Instructor](#-view-course-instructor)
- [📊 View Course Statistics](#-view-course-statistics)
- [❌ Common Errors](#-common-errors)

---

## 📊 Existing Courses

The following courses were created during database seeding:

| Course ID | Course Name | Department | Instructor | Students |
|-----------|-------------|------------|------------|----------|
| `SE302` | Software Project Management | Software Engineering | Dr. Youssef Atallah | 4 |
| `CS101` | Introduction to Computer Science | Computer Science | Prof. Emily Watson | 4 |
| `MATH201` | Calculus II | Mathematics | Dr. Ahmed Hassan | 3 |
| `DS205` | Data Structures and Algorithms | Computer Science | Prof. Emily Watson | 3 |
| `DB301` | Database Management Systems | Software Engineering | Dr. Maria Garcia | 3 |

### ✅ Available Course IDs (not in use)
- `MATH101` - Calculus I
- `MATH301` - Calculus III
- `CS201` - Object-Oriented Programming
- `SE401` - Software Testing
- `DB401` - Advanced Databases
- `AI301` - Artificial Intelligence
- `WEB201` - Web Development

### ❌ Taken Course IDs (already exist)
- `SE302`, `CS101`, `MATH201`, `DS205`, `DB301`

---

## ➕ Create Course

<details open>
<summary><b>POST</b> <code>/course</code></summary>

### Description
Create a new course in the system.

### Access
🔐 **Secretary Only**

### Request Body
```json
{
  "courseId": "MATH101",
  "name": "Calculus I",
  "department": "Mathematics",
  "secretaryId": "sec-001"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courseId` | string | ✅ Yes | Unique course identifier |
| `name` | string | ✅ Yes | Course name |
| `department` | string | ✅ Yes | Department offering the course |
| `secretaryId` | string | ✅ Yes | ID of secretary creating the course |

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "id": "MATH101",
    "name": "Calculus I",
    "department": "Mathematics",
    "instructor_id": null,
    "students": [],
    "createdBy": "sec-001"
  }
}
```

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required fields | One or more required fields are missing |
| 409 | Course already exists | A course with this ID already exists |
| 404 | Secretary not found | Invalid secretary ID |

</details>

---

## 🔍 Get Course

<details>
<summary><b>GET</b> <code>/course/:id</code></summary>

### Description
Retrieve detailed course information.

### Access
👨‍🎓 **Student** | 👨‍🏫 **Instructor** | 🔐 **Secretary**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

### Example Request
```bash
GET /course/CS101
```

### Success Response (200 OK)
```json
{
  "success": true,
  "course": {
    "id": "CS101",
    "name": "Introduction to Computer Science",
    "department": "Computer Science",
    "instructor_id": "inst-002",
    "students": ["stu-001", "stu-002", "stu-005", "stu-006"],
    "resit_exam_id": "resit-CS101",
    "created_at": "2025-12-27T00:51:23.000Z",
    "created_by": "sec-001"
  }
}
```

### Error Response
- **404 Not Found** - Course does not exist

</details>

---

## ✏️ Update Course

<details>
<summary><b>PUT</b> <code>/course/:id</code></summary>

### Description
Update course details including name, department, or assign instructor.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

### Request Body
```json
{
  "name": "Introduction to Computer Science - Advanced",
  "instructor": "inst-002",
  "department": "Computer Science",
  "secretaryId": "sec-001"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ❌ No | Updated course name |
| `instructor` | string | ❌ No | Instructor ID to assign |
| `department` | string | ❌ No | Updated department |
| `secretaryId` | string | ✅ Yes | ID of secretary making the update |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "id": "CS101",
    "name": "Introduction to Computer Science - Advanced",
    "department": "Computer Science",
    "instructor_id": "inst-002"
  }
}
```

### Error Responses
- **404 Not Found** - Course or instructor not found
- **400 Bad Request** - Invalid parameters

</details>

---

## 🗑️ Delete Course

<details>
<summary><b>DELETE</b> <code>/course/:id</code></summary>

### Description
Delete a course and all associated data.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

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
  "message": "Course deleted successfully"
}
```

### ⚠️ Warning
Deleting a course will also remove:
- ✖️ All student enrollments
- ✖️ All grades
- ✖️ All resit exams for this course
- ✖️ All resit exam applications and results

</details>

---

## 👥 View Course Students

<details>
<summary><b>GET</b> <code>/course/students/:id</code></summary>

### Description
Get list of all students enrolled in a course.

### Access
👨‍🏫 **Instructor** | 🔐 **Secretary**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "students": [
    {
      "id": "stu-001",
      "name": "Ali Yilmaz",
      "email": "ali.yilmaz@student.uskudar.edu.tr",
      "grade": 68,
      "gradeLetter": "C"
    },
    {
      "id": "stu-002",
      "name": "Ayşe Demir",
      "email": "ayse.demir@student.uskudar.edu.tr",
      "grade": 42,
      "gradeLetter": "F"
    }
  ],
  "total": 2
}
```

</details>

---

## 👨‍🏫 View Course Instructor

<details>
<summary><b>GET</b> <code>/course/instructor/:id</code></summary>

### Description
Get information about the instructor teaching the course.

### Access
👨‍🎓 **Student** | 👨‍🏫 **Instructor** | 🔐 **Secretary**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "instructor": {
    "id": "inst-002",
    "name": "Prof. Emily Watson",
    "email": "emily.watson@uskudar.edu.tr"
  }
}
```

### Error Response
- **404 Not Found** - Course has no assigned instructor

</details>

---

## 📊 View Course Statistics

<details>
<summary><b>GET</b> <code>/course/statistics/:id</code></summary>

### Description
Get course statistics including enrollment count and grade distribution.

### Access
👨‍🏫 **Instructor** | 🔐 **Secretary**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Course ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "statistics": {
    "courseId": "CS101",
    "courseName": "Introduction to Computer Science",
    "totalStudents": 4,
    "gradeDistribution": {
      "A": 1,
      "B": 1,
      "C": 1,
      "F": 1
    },
    "averageGrade": 67.5,
    "passingRate": 75,
    "failingStudents": 1,
    "resitExamEnrolled": 1
  }
}
```

</details>

---

## ❌ Common Errors

### Course Not Found
```json
{
  "success": false,
  "error": "Course not found"
}
```
**HTTP Status:** `404 Not Found`

### Course Already Exists
```json
{
  "success": false,
  "error": "Course already exists",
  "details": "A course with ID 'MATH101' already exists"
}
```
**HTTP Status:** `409 Conflict`

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": {
    "courseId": false,
    "name": true,
    "department": false,
    "secretaryId": false
  }
}
```
**HTTP Status:** `400 Bad Request`

### Instructor Not Found
```json
{
  "success": false,
  "error": "Instructor not found",
  "details": "Instructor with ID 'inst-005' does not exist"
}
```
**HTTP Status:** `404 Not Found`

---

<div align="center">

**[⬆ Back to Top](#-course-management-api)**

[← Main Documentation](./README.md) | [Students →](./STUDENTS.md) | [Instructors →](./INSTRUCTORS.md) | [Resit Exams →](./RESIT_EXAMS.md)

---

*Last Updated: December 27, 2025*

</div>
