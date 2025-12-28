# Route Organization by Dashboard

This document provides an overview of which routes are used by each user role/dashboard.

## 📊 Dashboard Overview

The system has three main user roles, each with their own dashboard:

1. **Secretary Dashboard** - Administrative operations
2. **Instructor Dashboard** - Teaching and grading operations
3. **Student Dashboard** - View own information

---

## 🔐 Secretary Dashboard Routes

Secretaries have full administrative access to manage all entities in the system.

### Student Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/student/` | Create a new student |
| GET | `/student/:id` | Get student information |
| PUT | `/student/:id` | Update student information |
| DELETE | `/student/:id` | Delete a student |
| POST | `/student/:id` | Enroll student in a course |
| DELETE | `/student-course/:id` | Remove student from a course |
| POST | `/student/resit-exam/:id` | Enroll student in resit exam |
| DELETE | `/student/resit-exam/:id` | Remove student from resit exam |

### Instructor Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/instructor` | Create a new instructor |
| GET | `/instructor/:id` | Get instructor information |
| PUT | `/instructor/:id` | Update instructor information |
| DELETE | `/instructor/:id` | Delete an instructor |
| POST | `/instructor/course/:id` | Assign instructor to course |
| DELETE | `/instructor/course/:id` | Unassign instructor from course |

### Course Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/course` | Create a new course |
| GET | `/course/:id` | Get course details |
| PUT | `/course/:id` | Update course details |
| DELETE | `/course/:id` | Delete a course |
| GET | `/course/students/:id` | Get course students |
| GET | `/course/instructor/:id` | Get course instructor |
| GET | `/course/statistics/:id` | Get course statistics |

### System-Wide Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/secretary/courses` | Get all courses |
| GET | `/secretary/students` | Get all students |
| GET | `/secretary/instructors` | Get all instructors |
| GET | `/secretary/resit-exams` | Get all resit exams |
| PUT | `/secretary/confirm/resit-exam/:id` | Confirm/update resit exam details |

---

## 👨‍🏫 Instructor Dashboard Routes

Instructors can view their courses, manage resit exams, and set grades.

### View Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instructor/:id` | Get instructor information |
| GET | `/instructor/courses/:id` | Get instructor's courses |
| GET | `/instructor/cdetails/:id` | Get detailed course information |
| GET | `/course/students/:id` | Get students in a course |
| GET | `/course/statistics/:id` | Get course statistics |

### Grade Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/instructor/course/grades/:courseId` | Set grades for multiple students |

### Resit Exam Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/instructor/r-exam/:id` | Create a resit exam |
| GET | `/instructor/r-exams/:id` | Get instructor's resit exams |
| GET | `/r-exam/:id` | Get resit exam details |
| PUT | `/instructor/r-exam/:id` | Update resit exam details |
| DELETE | `/instructor/r-exam/:id` | Delete a resit exam |
| PUT | `/instructor/r-announcement/:id` | Set resit exam announcement |

### Resit Exam Grading
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/instructor/course/:courseId/student/:studentId` | Update single student's resit grade |
| PUT | `/instructor/resit-results/all/:resitExamId` | Update all students' resit grades |
| GET | `/instructor/resit-results/exam/:resitExamId` | Get all resit exam results |
| GET | `/instructor/resit-results/student/:studentId` | Get student's all resit results |
| GET | `/instructor/resit-results/:studentId/:resitExamId` | Get specific resit result |

---

## 👨‍🎓 Student Dashboard Routes

Students can view their own information, courses, grades, and resit exams.

### View Own Information
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/:id` | Get own student information |
| GET | `/student/courses/:id` | Get enrolled courses |
| GET | `/student/c-details/:id` | Get course details with grades |
| GET | `/student/resitexams/:id` | Get enrolled resit exams |
| GET | `/student/r-exams/:id` | Get resit exams (alternative) |

### View Course Information
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/course/:id` | Get course details |
| GET | `/course/instructor/:id` | Get course instructor |

### View Resit Exam Information
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/r-exam/:id` | Get resit exam details |

---

## 🔓 Public/Shared Routes

These routes can be accessed by multiple user roles.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/course/:id` | All | Get course details |
| GET | `/course/instructor/:id` | All | Get course instructor |
| GET | `/r-exam/:id` | All | Get resit exam details |
| GET | `/student/:id` | Student, Secretary | Get student information |

---

## 📋 Route Files

All routes are organized in separate files:

- **`studentRoutes.ts`** - Student management and information
- **`instructorRoutes.ts`** - Instructor management and operations
- **`courseRoutes.ts`** - Course management and information
- **`secretaryRoutes.ts`** - Secretary administrative operations

---

## 🔑 Authorization

Most routes require a `secretaryId` in the request body for operations that modify data:

```json
{
  "secretaryId": "sec-001",
  // ... other fields
}
```

For instructor operations, an `instructorId` is required:

```json
{
  "instructorId": "inst-001",
  // ... other fields
}
```

---

## 📊 Route Statistics

| Dashboard | Total Routes | Create | Read | Update | Delete |
|-----------|--------------|--------|------|--------|--------|
| Secretary | 24 | 6 | 11 | 4 | 3 |
| Instructor | 15 | 1 | 7 | 5 | 2 |
| Student | 7 | 0 | 7 | 0 | 0 |
| **Total** | **46** | **7** | **25** | **9** | **5** |

---

## 🎯 Quick Reference

### Most Common Operations

**Secretary:**
- Create entities (students, instructors, courses)
- Enroll students in courses
- Assign instructors to courses
- View system-wide data

**Instructor:**
- View assigned courses and students
- Create and manage resit exams
- Set course grades
- Update resit exam grades

**Student:**
- View enrolled courses
- View grades
- View resit exam information
- Check resit exam announcements

---

[← Back to Documentation](./README.md)
