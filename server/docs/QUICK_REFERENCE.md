# API Quick Reference

Quick reference guide for common API operations.

## Base URL
```
http://localhost:3000
```

## Authentication
Include `secretaryId` in request body for operations that modify data:
```json
{
  "secretaryId": "sec-001"
}
```

---

## Quick Links

- 📘 [Courses](./COURSES.md)
- 👨‍🎓 [Students](./STUDENTS.md)
- 👨‍🏫 [Instructors](./INSTRUCTORS.md)
- 📝 [Resit Exams](./RESIT_EXAMS.md)
- 📊 [Sample Data](./SAMPLE_DATA.md)

---

## Common Operations

### Courses

| Operation | Method | Endpoint | Body |
|-----------|--------|----------|------|
| Create Course | POST | `/course` | `{ courseId, name, department, secretaryId }` |
| Get Course | GET | `/course/:id` | - |
| Update Course | PUT | `/course/:id` | `{ name, instructor, department, secretaryId }` |
| Delete Course | DELETE | `/course/:id` | `{ secretaryId }` |
| List All Courses | GET | `/courses` | - |

### Students

| Operation | Method | Endpoint | Body |
|-----------|--------|----------|------|
| Create Student | POST | `/student/` | `{ studentId, name, email, password, secretaryId }` |
| Get Student | GET | `/student/:id` | - |
| Update Student | PUT | `/student/:id` | `{ name, email, password, secretaryId }` |
| Delete Student | DELETE | `/student/:id` | `{ secretaryId }` |
| Enroll in Course | POST | `/student/:id` | `{ courseId, secretaryId }` |
| Remove from Course | DELETE | `/student-course/:id` | `{ courseId, secretaryId }` |
| Get Student Courses | GET | `/student/courses/:id` | - |
| Get Course Details | GET | `/student/c-details/:id` | - |

### Instructors

| Operation | Method | Endpoint | Body |
|-----------|--------|----------|------|
| Create Instructor | POST | `/instructor` | `{ instructorId, name, email, password, secretaryId }` |
| Get Instructor | GET | `/instructor/:id` | - |
| Update Instructor | PUT | `/instructor/:id` | `{ name, email, password, secretaryId }` |
| Delete Instructor | DELETE | `/instructor/:id` | `{ secretaryId }` |
| Assign to Course | POST | `/instructor/course/:id` | `{ courseId, secretaryId }` |
| Unassign from Course | DELETE | `/instructor/course/:id` | `{ courseId, secretaryId }` |
| Get Instructor Courses | GET | `/instructor/courses/:id` | - |
| Get Course Details | GET | `/instructor/cdetails/:id` | - |
| Set Course Grades | POST | `/instructor/course/grades/:courseId` | `{ instructorId, grades: [{studentId, grade, gradeLetter}] }` |

### Resit Exams

| Operation | Method | Endpoint | Body |
|-----------|--------|----------|------|
| Create Resit Exam | POST | `/instructor/r-exam/:id` | `{ resitExamId, courseId, name, department, lettersAllowed, announcement }` |
| Get Resit Exam | GET | `/r-exam/:id` | - |
| Update Resit Exam | PUT | `/instructor/r-exam/:id` | `{ instructorId, examDate, deadline, location }` |
| Delete Resit Exam | DELETE | `/instructor/r-exam/:id` | `{ instructorId }` |
| Set Announcement | PUT | `/instructor/r-announcement/:id` | `{ instructorId, announcement }` |
| Get Instructor Resits | GET | `/instructor/r-exams/:id` | - |
| Update Student Grade | PUT | `/instructor/course/:courseId/student/:studentId` | `{ instructorId, grade, gradeLetter }` |
| Update All Grades | PUT | `/instructor/resit-results/all/:resitExamId` | `{ instructorId, results: [{studentId, grade, gradeLetter}] }` |
| Get Exam Results | GET | `/instructor/resit-results/exam/:resitExamId` | - |
| Enroll Student | POST | `/student/resit-exam/:id` | `{ resitExamId, secretaryId }` |
| Remove Student | DELETE | `/student/resit-exam/:id` | `{ resitExamId, secretaryId }` |

---

## Sample IDs for Testing

### Secretaries
- `sec-001` - Sarah Johnson
- `sec-002` - Michael Chen

### Instructors
- `inst-001` - Dr. Youssef Atallah
- `inst-002` - Prof. Emily Watson
- `inst-003` - Dr. Ahmed Hassan
- `inst-004` - Dr. Maria Garcia

### Students
- `stu-001` - Ali Yilmaz
- `stu-002` - Ayşe Demir
- `stu-003` - Mehmet Kaya
- `stu-004` - Fatma Özdemir
- `stu-005` - Can Arslan
- `stu-006` - Zeynep Şahin

### Courses
- `SE302` - Software Project Management
- `CS101` - Introduction to Computer Science
- `MATH201` - Calculus II
- `DS205` - Data Structures and Algorithms
- `DB301` - Database Management Systems

### Resit Exams
- `resit-SE302` - SE302 Resit
- `resit-CS101` - CS101 Resit

**All passwords:** `password123`

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Missing/invalid parameters |
| 403 | Forbidden | Unauthorized operation |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

---

## cURL Examples

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

### Set Student Grades
```bash
curl -X POST http://localhost:3000/instructor/course/grades/SE302 \
  -H "Content-Type: application/json" \
  -d '{
    "instructorId": "inst-001",
    "grades": [
      {"studentId": "stu-001", "grade": 85, "gradeLetter": "A"},
      {"studentId": "stu-002", "grade": 72, "gradeLetter": "B"}
    ]
  }'
```

### Create Resit Exam
```bash
curl -X POST http://localhost:3000/instructor/r-exam/inst-001 \
  -H "Content-Type: application/json" \
  -d '{
    "resitExamId": "resit-MATH201",
    "courseId": "MATH201",
    "name": "Calculus II - Resit",
    "department": "Mathematics",
    "lettersAllowed": ["F", "D"],
    "announcement": "Resit exam for MATH201"
  }'
```

---

## Response Format

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

---

[← Back to Main Documentation](./README.md)
