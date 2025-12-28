# Resit Exam Management API

Complete API documentation for resit exam operations.

## Table of Contents
- [Existing Resit Exams](#existing-resit-exams)
- [Create Resit Exam](#create-resit-exam)
- [Get Resit Exam](#get-resit-exam)
- [Update Resit Exam](#update-resit-exam)
- [Delete Resit Exam](#delete-resit-exam)
- [Set Resit Exam Announcement](#set-resit-exam-announcement)
- [Get Instructor Resit Exams](#get-instructor-resit-exams)
- [Update Student Resit Exam Grade](#update-student-resit-exam-grade)
- [Update All Students Resit Exam Grades](#update-all-students-resit-exam-grades)
- [Get Resit Exam Results](#get-resit-exam-results)

---

## Existing Resit Exams

The following resit exams were created during seeding:

| Resit Exam ID | Course | Instructor | Allowed Grades | Enrolled Students |
|---------------|--------|------------|----------------|-------------------|
| `resit-SE302` | SE302 - Software Project Management | Dr. Youssef Atallah | F, D | stu-001, stu-003 |
| `resit-CS101` | CS101 - Introduction to Computer Science | Prof. Emily Watson | F | stu-002 |

---

## Create Resit Exam

Create a new resit exam for a course.

**Endpoint:** `POST /instructor/r-exam/:id`

**URL Parameter:** `:id` - Instructor ID

**Request Body:**
```json
{
  "resitExamId": "resit-MATH201",
  "courseId": "MATH201",
  "name": "Calculus II - Resit Exam",
  "department": "Mathematics",
  "lettersAllowed": ["F", "D"],
  "announcement": "This is a resit exam for students who failed MATH201. Study chapters 1-8."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Resit exam created successfully",
  "resitExam": {
    "id": "resit-MATH201",
    "course_id": "MATH201",
    "name": "Calculus II - Resit Exam",
    "department": "Mathematics",
    "lettersAllowed": ["F", "D"],
    "announcement": "This is a resit exam for students who failed MATH201. Study chapters 1-8.",
    "instructors": ["inst-003"],
    "students": []
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `403` - Instructor not authorized for this course
- `404` - Course not found
- `409` - Resit exam already exists for this course

---

## Get Resit Exam

Retrieve detailed information about a resit exam.

**Endpoint:** `GET /r-exam/:id`

**Example:** `GET /r-exam/resit-SE302`

**Success Response (200):**
```json
{
  "success": true,
  "resitExam": {
    "id": "resit-SE302",
    "course_id": "SE302",
    "name": "Software Project Management - Resit Exam",
    "department": "Software Engineering",
    "examDate": null,
    "deadline": null,
    "location": null,
    "announcement": "This is a resit exam for students who failed SE302. Please prepare well!",
    "lettersAllowed": ["F", "D"],
    "instructors": ["inst-001"],
    "students": ["stu-001", "stu-003"],
    "createdAt": "2025-12-27T00:51:23.000Z",
    "createdBy": "inst-001"
  }
}
```

**Error Response:**
- `404` - Resit exam not found

---

## Update Resit Exam

Update resit exam details (date, location, deadline).

**Endpoint:** `PUT /instructor/r-exam/:id`

**URL Parameter:** `:id` - Resit Exam ID

**Request Body:**
```json
{
  "instructorId": "inst-001",
  "examDate": "2025-06-20",
  "deadline": "2025-06-15",
  "location": "Room A-101"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resit exam updated successfully",
  "resitExam": {
    "id": "resit-SE302",
    "examDate": "2025-06-20",
    "deadline": "2025-06-15",
    "location": "Room A-101"
  }
}
```

---

## Delete Resit Exam

Delete a resit exam.

**Endpoint:** `DELETE /instructor/r-exam/:id`

**URL Parameter:** `:id` - Resit Exam ID

**Request Body:**
```json
{
  "instructorId": "inst-001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resit exam deleted successfully"
}
```

**Note:** Deleting a resit exam will:
- Remove all student enrollments
- Delete all grades/results
- Remove the link from the course

---

## Set Resit Exam Announcement

Update the announcement message for a resit exam.

**Endpoint:** `PUT /instructor/r-announcement/:id`

**URL Parameter:** `:id` - Resit Exam ID

**Request Body:**
```json
{
  "instructorId": "inst-001",
  "announcement": "Updated announcement: Exam will cover chapters 1-10. Bring your student ID and calculator."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Announcement updated successfully"
}
```

---

## Get Instructor Resit Exams

Get all resit exams created by or assigned to an instructor.

**Endpoint:** `GET /instructor/r-exams/:id`

**Example:** `GET /instructor/r-exams/inst-001`

**Success Response (200):**
```json
{
  "success": true,
  "resitExams": [
    {
      "id": "resit-SE302",
      "course_id": "SE302",
      "name": "Software Project Management - Resit Exam",
      "department": "Software Engineering",
      "examDate": "2025-06-20",
      "deadline": "2025-06-15",
      "location": "Room A-101",
      "enrolled_students": ["stu-001", "stu-003"],
      "enrolled_count": 2
    }
  ]
}
```

---

## Update Student Resit Exam Grade

Update the grade for a single student in a resit exam.

**Endpoint:** `PUT /instructor/course/:courseId/student/:studentId`

**URL Parameters:**
- `:courseId` - Course ID
- `:studentId` - Student ID

**Request Body:**
```json
{
  "instructorId": "inst-001",
  "grade": 75,
  "gradeLetter": "B"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student grade updated successfully"
}
```

**Error Responses:**
- `403` - Instructor not authorized for this course
- `404` - Student not enrolled in resit exam
- `400` - Invalid grade or grade letter

---

## Update All Students Resit Exam Grades

Update grades for all students in a resit exam at once.

**Endpoint:** `PUT /instructor/resit-results/all/:resitExamId`

**URL Parameter:** `:resitExamId` - Resit Exam ID

**Request Body:**
```json
{
  "instructorId": "inst-001",
  "results": [
    {
      "studentId": "stu-001",
      "grade": 75,
      "gradeLetter": "B"
    },
    {
      "studentId": "stu-003",
      "grade": 82,
      "gradeLetter": "A"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All student grades updated successfully",
  "updated": 2
}
```

**Note:** This will:
- Update the resit exam grades
- Update the course grades (replacing the original failing grade)
- Create application records if they don't exist

---

## Get Resit Exam Results

Get all results for a specific resit exam.

**Endpoint:** `GET /instructor/resit-results/exam/:resitExamId`

**Example:** `GET /instructor/resit-results/exam/resit-SE302`

**Success Response (200):**
```json
{
  "success": true,
  "results": [
    {
      "studentId": "stu-001",
      "grade": 75,
      "gradeLetter": "B",
      "submittedAt": "2025-06-20T14:30:00.000Z"
    },
    {
      "studentId": "stu-003",
      "grade": 82,
      "gradeLetter": "A",
      "submittedAt": "2025-06-20T14:35:00.000Z"
    }
  ]
}
```

---

## Grade Letter System

The system uses the following grade letter mapping:

| Grade Range | Letter | Status |
|-------------|--------|--------|
| 90-100 | A | Pass |
| 80-89 | B | Pass |
| 70-79 | C | Pass |
| 60-69 | D | Pass |
| 50-59 | E | Pass |
| 0-49 | F | Fail |

**Allowed Letters for Resit Exams:**
Typically, only students with grades `F` and `D` are eligible for resit exams. This is configured when creating the resit exam using the `lettersAllowed` field.

---

## Common Error Responses

### Resit Exam Not Found
```json
{
  "success": false,
  "error": "Resit exam not found"
}
```
**HTTP Status:** `404`

### Unauthorized Instructor
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "You are not authorized to modify this resit exam"
}
```
**HTTP Status:** `403`

### Student Not Eligible
```json
{
  "success": false,
  "error": "Student not eligible",
  "details": "Student grade 'B' is not in the allowed list: F, D"
}
```
**HTTP Status:** `400`

---

[← Back to Main Documentation](./README.md) | [← Instructors](./INSTRUCTORS.md)
