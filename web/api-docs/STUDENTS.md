# 👨‍🎓 Student Management API

<div align="center">

![Endpoints](https://img.shields.io/badge/endpoints-10-blue?style=flat-square)
![Access](https://img.shields.io/badge/access-Secretary%20%7C%20Student-green?style=flat-square)

**Complete API documentation for student-related operations**

[← Back to Main](./README.md) | [Quick Reference](./QUICK_REFERENCE.md) | [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md)

</div>

---

## 📑 Table of Contents

- [📊 Existing Students](#-existing-students)
- [➕ Create Student](#-create-student)
- [🔍 Get Student](#-get-student)
- [✏️ Update Student](#️-update-student)
- [🗑️ Delete Student](#️-delete-student)
- [📚 Course Enrollment](#-course-enrollment)
- [📝 Resit Exam Enrollment](#-resit-exam-enrollment)
- [📈 View Student Data](#-view-student-data)
- [❌ Common Errors](#-common-errors)

---

## 📊 Existing Students

The following students were created during database seeding:

| Student ID | Name | Email | Enrolled Courses |
|------------|------|-------|------------------|
| `stu-001` | Ali Yilmaz | ali.yilmaz@student.uskudar.edu.tr | SE302, CS101, DS205 |
| `stu-002` | Ayşe Demir | ayse.demir@student.uskudar.edu.tr | CS101, DB301 |
| `stu-003` | Mehmet Kaya | mehmet.kaya@student.uskudar.edu.tr | SE302, MATH201, DS205 |
| `stu-004` | Fatma Özdemir | fatma.ozdemir@student.uskudar.edu.tr | SE302, MATH201, DB301 |
| `stu-005` | Can Arslan | can.arslan@student.uskudar.edu.tr | CS101, MATH201, DB301 |
| `stu-006` | Zeynep Şahin | zeynep.sahin@student.uskudar.edu.tr | CS101, DS205 |

> 🔑 **Default Password:** All students have the password `password123`

---

## ➕ Create Student

<details open>
<summary><b>POST</b> <code>/student/</code></summary>

### Description
Create a new student account in the system.

### Access
🔐 **Secretary Only**

### Request Body
```json
{
  "studentId": "stu-007",
  "name": "Ahmet Yılmaz",
  "email": "ahmet.yilmaz@student.uskudar.edu.tr",
  "password": "password123",
  "secretaryId": "sec-001"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentId` | string | ✅ Yes | Unique student identifier |
| `name` | string | ✅ Yes | Student's full name |
| `email` | string | ✅ Yes | Student's email address |
| `password` | string | ✅ Yes | Student's password (min 8 characters) |
| `secretaryId` | string | ✅ Yes | ID of secretary creating the student |

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Student created successfully",
  "student": {
    "id": "stu-007",
    "name": "Ahmet Yılmaz",
    "email": "ahmet.yilmaz@student.uskudar.edu.tr",
    "courses": [],
    "resitExams": []
  }
}
```

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required fields | One or more required fields are missing |
| 409 | Student already exists | A student with this ID already exists |
| 404 | Secretary not found | Invalid secretary ID |

</details>

---

## 🔍 Get Student

<details>
<summary><b>GET</b> <code>/student/:id</code></summary>

### Description
Retrieve detailed student information including courses and resit exams.

### Access
👨‍🎓 **Student** (own data) | 🔐 **Secretary** (any student)

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Student ID |

### Example Request
```bash
GET /student/stu-001
```

### Success Response (200 OK)
```json
{
  "success": true,
  "student": {
    "id": "stu-001",
    "name": "Ali Yilmaz",
    "email": "ali.yilmaz@student.uskudar.edu.tr",
    "courses": ["SE302", "CS101", "DS205"],
    "resitExams": ["resit-SE302"],
    "created_at": "2025-12-27T00:51:23.000Z",
    "created_by": "sec-001"
  }
}
```

### Error Response
- **404 Not Found** - Student does not exist

</details>

---

## ✏️ Update Student

<details>
<summary><b>PUT</b> <code>/student/:id</code></summary>

### Description
Update student's name, email, or password.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Student ID |

### Request Body
```json
{
  "name": "Ahmet Yılmaz Updated",
  "email": "ahmet.updated@student.uskudar.edu.tr",
  "password": "newpassword123",
  "secretaryId": "sec-001"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Student updated successfully",
  "student": {
    "id": "stu-007",
    "name": "Ahmet Yılmaz Updated",
    "email": "ahmet.updated@student.uskudar.edu.tr"
  }
}
```

</details>

---

## 🗑️ Delete Student

<details>
<summary><b>DELETE</b> <code>/student/:id</code></summary>

### Description
Delete a student and all associated data.

### Access
🔐 **Secretary Only**

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Student ID |

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
  "message": "Student deleted successfully"
}
```

### ⚠️ Warning
Deleting a student will also remove:
- ✖️ All course enrollments
- ✖️ All grades
- ✖️ All resit exam enrollments
- ✖️ The user account

</details>

---

## 📚 Course Enrollment

### Enroll Student in Course

<details>
<summary><b>POST</b> <code>/student/:id</code></summary>

### Description
Enroll a student in a course.

### Access
🔐 **Secretary Only**

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
  "message": "Course added to student successfully"
}
```

</details>

### Remove Student from Course

<details>
<summary><b>DELETE</b> <code>/student-course/:id</code></summary>

### Description
Remove a student from a course and delete their grade.

### Access
🔐 **Secretary Only**

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
  "message": "Student removed from course successfully"
}
```

### ⚠️ Note
This will also:
- Remove their grade for that course
- Remove them from any associated resit exams

</details>

---

## 📝 Resit Exam Enrollment

### Enroll in Resit Exam

<details>
<summary><b>POST</b> <code>/student/resit-exam/:id</code></summary>

### Description
Enroll a student in a resit exam.

### Access
🔐 **Secretary Only**

### Request Body
```json
{
  "resitExamId": "resit-SE302",
  "secretaryId": "sec-001"
}
```

</details>

### Remove from Resit Exam

<details>
<summary><b>DELETE</b> <code>/student/resit-exam/:id</code></summary>

### Description
Remove a student from a resit exam.

### Access
🔐 **Secretary Only**

### Request Body
```json
{
  "resitExamId": "resit-SE302",
  "secretaryId": "sec-001"
}
```

</details>

---

## 📈 View Student Data

### Get Student's Courses

<details>
<summary><b>GET</b> <code>/student/courses/:id</code></summary>

### Description
Get list of course IDs the student is enrolled in.

### Access
👨‍🎓 **Student** | 🔐 **Secretary**

### Success Response (200 OK)
```json
{
  "success": true,
  "courses": ["SE302", "CS101", "DS205"]
}
```

</details>

### Get Course Details with Grades

<details>
<summary><b>GET</b> <code>/student/c-details/:id</code></summary>

### Description
Get detailed course information including grades and resit exam status.

### Access
👨‍🎓 **Student** | 🔐 **Secretary**

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
      "grade": 45,
      "gradeLetter": "F",
      "resit_exam": {
        "id": "resit-SE302",
        "deadline": "2025-06-15",
        "status": "pending"
      }
    },
    {
      "courseId": "CS101",
      "courseName": "Introduction to Computer Science",
      "department": "Computer Science",
      "instructor_id": "inst-002",
      "grade": 68,
      "gradeLetter": "C"
    }
  ]
}
```

</details>

### Get Student's Resit Exams

<details>
<summary><b>GET</b> <code>/student/resitexams/:id</code></summary>

### Description
Get list of resit exams the student is enrolled in.

### Access
👨‍🎓 **Student** | 🔐 **Secretary**

### Success Response (200 OK)
```json
{
  "success": true,
  "resitExams": ["resit-SE302"]
}
```

</details>

---

## ❌ Common Errors

### Student Not Found
```json
{
  "success": false,
  "error": "Student not found"
}
```
**HTTP Status:** `404 Not Found`

### Student Already Exists
```json
{
  "success": false,
  "error": "Student already exists",
  "details": "A student with ID 'stu-007' already exists"
}
```
**HTTP Status:** `409 Conflict`

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": {
    "studentId": false,
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

**[⬆ Back to Top](#-student-management-api)**

[← Main Documentation](./README.md) | [Courses →](./COURSES.md) | [Instructors →](./INSTRUCTORS.md) | [Resit Exams →](./RESIT_EXAMS.md)

---

*Last Updated: December 27, 2025*

</div>
