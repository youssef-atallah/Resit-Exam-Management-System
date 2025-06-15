# 📚 API Documentation

notion link: https://imaginary-methane-624.notion.site/
---

## Secretary Dashboard APIs

### 1. Course Management

#### 1.1 Create Course

**POST** `/course`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "name": "Introduction to Computer Science",
  "department": "Computer Science",
  "secretaryId": "sec-001"
}
```

---

#### 1.2 Get Course by ID

**GET** `/course/:id`

- **Params:** id (e.g., `course-003`)

---

#### 1.3 Update Course

**PUT** `/course/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "name": "Physics",
  "instructor": "Dr. Jolnihal",
  "department": "Science",
  "secretaryId": "sec-001"
}
```

---

#### 1.4 Delete Course

**DELETE** `/course/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "secretaryId": "sec-001"
}
```

---

#### 1.5 Get Course Students

**GET** `/course/students/:id`

- **Params:** id (e.g., `course-003`)

---

#### 1.6 Get Course Instructor

**GET** `/course/instructor/:id`

- **Params:** id (e.g., `course-101`)

---

#### 1.7 Get Course Statistics

**GET** `/course/statistics/:id`

- **Params:** id (e.g., `course-003`)

---

## 2. Instructor Management

#### 2.1 Create Instructor

**POST** `/instructor`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "secretaryId": "sec-001"
}
```

---

#### 2.2 Get Instructor by ID

**GET** `/instructor/:id`

- **Params:** id (e.g., `inst-001`)

---

#### 2.3 Update Instructor Info

**PUT** `/instructor/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated.email@example.com",
  "password": "newpassword123",
  "secretaryId": "sec-001"
}
```

---

#### 2.4 Delete Instructor

**DELETE** `/instructor/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "secretaryId": "sec-001"
}
```

---

#### 2.5 Assign Instructor to Course

**POST** `/instructor/course/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "courseId": "course-002",
  "secretaryId": "sec-001"
}
```

---

#### 2.6 Unassign Instructor from Course

**DELETE** `/instructor/course/:id`

- **Content-Type:** application/json  
- **Request Body:**
```json
{
  "courseId": "course-002",
  "secretaryId": "sec-001"
}
```

---

#### 2.7 Get Instructor's Courses

**GET** `/instructor/courses/:id`

- **Params:** id (e.g., `inst-001`)

---

#### 2.8 Get Instructor's Courses with Details

**GET** `/instructor/c-details/:id`

- **Params:** id (e.g., `inst-001`)

---

#### 2.9 Create Resit Exam

**POST** `/instructor/r-exam/:id`

- **Params:** id (e.g., `inst-001`)

---

#### 2.10 Update Resit Exam

**PUT** `/instructor/r-exam/:id`

---

#### 2.11 Delete Resit Exam

**DELETE** `/instructor/r-exam/:id`

---

#### 2.12 Get Instructor's Resit Exams

**GET** `/instructor/r-exams/:id`

---

#### 2.13 Get Resit Exam by ID

**GET** `/r-exam/:id`

---

#### 2.14 Update Single Student's Resit Exam Results

**PUT** `/instructor/course/:courseId/student/:studentId`

---

#### 2.15 Update All Students' Resit Exam Results

**PUT** `/instructor/resit-results/all/:resitExamId`

---

#### 2.16 Get All Results for a Resit Exam

**GET** `/instructor/resit-results/exam/:resitExamId`

---

#### 2.17 Set Resit Exam Announcement

**PUT** `/instructor/r-announcement/:id`

---

#### 2.18 Set Student Course Grades

**POST** `/instructor/course/grades/:courseId`

---

## 3. Student Management

#### 3.1 Create Student

**POST** `/student/`

---

#### 3.2 Delete Student

**DELETE** `/student/:id`

---

#### 3.3 Update Student Info

**PUT** `/student/:id`

---

#### 3.4 Add Course to Student

**POST** `/student/:id`

---

#### 3.5 Get Student by ID

**GET** `/student/:id`

---

#### 3.6 Remove Student from Course

**DELETE** `/student-course/:id`

---

#### 3.7 Get Student's Courses

**GET** `/student/courses/:id`

---

#### 3.8 Get Student's Course Details

**GET** `/student/c-details/:id`

---

#### 3.9 Add Resit Exam to Student

**POST** `/student/resit-exam/:id`

---

#### 3.10 Remove Student from Resit Exam

**DELETE** `/student/resit-exam/:id`

---

#### 3.11 Get Student's Resit Exams

**GET** `/student/resitexams/:id`  
**GET** `/student/r-exams/:id`

---

#### 3.12 Get All Students

**GET** `/secretary/students`

---

#### 3.13 Get All Instructors

**GET** `/secretary/instructors`

---

#### 3.14 Get All Courses

**GET** `/secretary/courses`

---

#### 3.15 Get All Resit Exams

**GET** `/secretary/resit-exams`

---

#### 3.16 Confirm/Update Resit Exam by Secretary

**PUT** `/secretary/confirm/resit-exam/:id`

---

#### 3.17 Get Student All Resit Exam Results

**GET** `/instructor/resit-results/student/:studentId`

---

#### 3.18 Get Student Resit Exam Results

**GET** `/instructor/resit-results/:studentId/:resitExamId`

---

## 4. Miscellaneous

- All endpoints expect and return JSON unless otherwise specified.
- Authentication and authorization are required for most endpoints (see project for details).
- For request/response examples, see the handler implementations or ask for a specific endpoint example.

---