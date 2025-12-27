# Existing Courses in Database

The following courses were created during database seeding and already exist:

## Course IDs Already in Use

| Course ID | Course Name | Department | Instructor |
|-----------|-------------|------------|------------|
| `SE302` | Software Project Management | Software Engineering | Dr. Youssef Atallah (inst-001) |
| `CS101` | Introduction to Computer Science | Computer Science | Prof. Emily Watson (inst-002) |
| `MATH201` | Calculus II | Mathematics | Dr. Ahmed Hassan (inst-003) |
| `DS205` | Data Structures and Algorithms | Computer Science | Prof. Emily Watson (inst-002) |
| `DB301` | Database Management Systems | Software Engineering | Dr. Maria Garcia (inst-004) |

## Creating New Courses

To create a new course, use a **different course ID** that doesn't exist yet. For example:

### ✅ Valid Course IDs (not in use):
- `MATH101` - Calculus I
- `MATH301` - Calculus III
- `CS201` - Object-Oriented Programming
- `SE401` - Software Testing
- `DB401` - Advanced Databases
- `AI301` - Artificial Intelligence
- `WEB201` - Web Development
- etc.

### ❌ Invalid Course IDs (already exist):
- `SE302` ❌
- `CS101` ❌
- `MATH201` ❌
- `DS205` ❌
- `DB301` ❌

## Example: Create a New Course

```json
POST /course
{
  "courseId": "MATH101",
  "name": "Calculus I",
  "department": "Mathematics",
  "secretaryId": "sec-001"
}
```

## Error Response

If you try to create a course with an existing ID, you'll now get:

```json
{
  "success": false,
  "error": "Course already exists",
  "details": "A course with ID 'MATH201' already exists"
}
```

**HTTP Status Code**: `409 Conflict`

## Updating Existing Courses

To modify an existing course, use the `PUT /course/:id` endpoint instead:

```json
PUT /course/MATH201
{
  "name": "Calculus II - Advanced",
  "instructor": "inst-003",
  "department": "Mathematics",
  "secretaryId": "sec-001"
}
```

---

## Student Management

### Existing Students

The following students were created during seeding:

| Student ID | Name | Email |
|------------|------|-------|
| `stu-001` | Ali Yilmaz | ali.yilmaz@student.uskudar.edu.tr |
| `stu-002` | Ayşe Demir | ayse.demir@student.uskudar.edu.tr |
| `stu-003` | Mehmet Kaya | mehmet.kaya@student.uskudar.edu.tr |
| `stu-004` | Fatma Özdemir | fatma.ozdemir@student.uskudar.edu.tr |
| `stu-005` | Can Arslan | can.arslan@student.uskudar.edu.tr |
| `stu-006` | Zeynep Şahin | zeynep.sahin@student.uskudar.edu.tr |

All student passwords are: `password123`

### Create a New Student

```json
POST /student/
{
  "studentId": "stu-007",
  "name": "Ahmet Yılmaz",
  "email": "ahmet.yilmaz@student.uskudar.edu.tr",
  "password": "password123",
  "secretaryId": "sec-001"
}
```

**Response:**
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

### Get Student Information

```json
GET /student/stu-001
```

**Response:**
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

### Delete a Student

```json
DELETE /student/stu-007
{
  "secretaryId": "sec-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Note:** Deleting a student will also remove:
- All course enrollments
- All grades
- All resit exam enrollments
- The user account

### Enroll Student in a Course

```json
POST /student/stu-007
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course added to student successfully"
}
```

### Remove Student from a Course

```json
DELETE /student-course/stu-007
{
  "courseId": "CS101",
  "secretaryId": "sec-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student removed from course successfully"
}
```

**Note:** Removing a student from a course will also:
- Remove their grade for that course
- Remove them from any associated resit exams

### Update Student Information

```json
PUT /student/stu-007
{
  "name": "Ahmet Yılmaz Updated",
  "email": "ahmet.updated@student.uskudar.edu.tr",
  "password": "newpassword123",
  "secretaryId": "sec-001"
}
```

**Response:**
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

### Get Student's Courses

```json
GET /student/courses/stu-001
```

**Response:**
```json
{
  "success": true,
  "courses": ["SE302", "CS101", "DS205"]
}
```

### Get Student's Course Details (with grades)

```json
GET /student/c-details/stu-001
```

**Response:**
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

### Enroll Student in Resit Exam

```json
POST /student/resit-exam/stu-001
{
  "resitExamId": "resit-SE302",
  "secretaryId": "sec-001"
}
```

### Remove Student from Resit Exam

```json
DELETE /student/resit-exam/stu-001
{
  "resitExamId": "resit-SE302",
  "secretaryId": "sec-001"
}
```

---

## Common Error Responses

### Student Not Found
```json
{
  "success": false,
  "error": "Student not found"
}
```
**HTTP Status**: `404 Not Found`

### Student Already Exists
```json
{
  "success": false,
  "error": "Student already exists",
  "details": "A student with ID 'stu-007' already exists"
}
```
**HTTP Status**: `409 Conflict`

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
**HTTP Status**: `400 Bad Request`

