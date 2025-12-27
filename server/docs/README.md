# 🎓 Resit Exam Management System - API Documentation

<div align="center">

![Server Status](https://img.shields.io/badge/server-running-success?style=flat-square)
![API Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Node](https://img.shields.io/badge/node-v18+-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square)
![License](https://img.shields.io/badge/license-ISC-lightgrey?style=flat-square)

**Complete API documentation for the Resit Exam Management System at Üsküdar University**

[Quick Start](#-quick-start) • [API Reference](#-api-categories) • [Sample Data](#-sample-data) • [Documentation](#-documentation-structure)

</div>

---

## 📚 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🔐 Authentication](#-authentication)
- [📖 API Categories](#-api-categories)
- [📊 Common Responses](#-common-responses)
- [🎯 Sample Data](#-sample-data)
- [📝 Documentation Structure](#-documentation-structure)
- [💡 Quick Examples](#-quick-examples)

---

## 🚀 Quick Start

### Base URL
```
http://localhost:3000
```

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- SQLite3

### Installation & Setup

```bash
# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the development server
npm start
```

The server will start on **port 3000** and the frontend will be available at:
```
http://localhost:3000/index.html
```

---

## 🔐 Authentication

Currently, the system uses **secretary ID-based authorization**. Include the `secretaryId` in the request body for operations that modify data.

### Example Request
```json
{
  "secretaryId": "sec-001",
  // ... other fields
}
```

### Authorization Levels

| Role | Access Level | Description |
|------|-------------|-------------|
| 🔐 **Secretary** | Full Admin | Create, read, update, delete all entities |
| 👨‍🏫 **Instructor** | Teaching | Manage courses, set grades, create resit exams |
| 👨‍🎓 **Student** | Read-Only | View own information, courses, and grades |

---

## 📖 API Categories

<details>
<summary><b>📘 Course Management</b> - 7 endpoints</summary>

Manage courses, assign instructors, and view course statistics.

**Key Operations:**
- Create, read, update, delete courses
- Assign instructors to courses
- View course statistics and enrollments

📄 **[View Full Documentation →](./COURSES.md)**

</details>

<details>
<summary><b>👨‍🎓 Student Management</b> - 10 endpoints</summary>

Manage students, enrollments, and view academic records.

**Key Operations:**
- Create, read, update, delete students
- Enroll students in courses
- View grades and course details
- Manage resit exam enrollments

📄 **[View Full Documentation →](./STUDENTS.md)**

</details>

<details>
<summary><b>👨‍🏫 Instructor Management</b> - 8 endpoints</summary>

Manage instructors, course assignments, and grading.

**Key Operations:**
- Create, read, update, delete instructors
- Assign instructors to courses
- View course details and student lists
- Set student grades

📄 **[View Full Documentation →](./INSTRUCTORS.md)**

</details>

<details>
<summary><b>📝 Resit Exam Management</b> - 9 endpoints</summary>

Create and manage resit exams, set grades, and view results.

**Key Operations:**
- Create and manage resit exams
- Enroll students in resit exams
- Set and update resit exam grades
- View resit exam results

📄 **[View Full Documentation →](./RESIT_EXAMS.md)**

</details>

---

## 📊 Common Responses

### ✅ Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* relevant data */ }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error details"
}
```

### HTTP Status Codes

| Code | Status | Usage | Example |
|------|--------|-------|---------|
| <span style="color: green">**200**</span> | ✅ OK | Successful GET, PUT, DELETE | Resource retrieved/updated |
| <span style="color: green">**201**</span> | ✅ Created | Successful POST | Resource created |
| <span style="color: orange">**400**</span> | ⚠️ Bad Request | Invalid parameters | Missing required fields |
| <span style="color: orange">**403**</span> | 🚫 Forbidden | Unauthorized | Invalid secretary ID |
| <span style="color: orange">**404**</span> | 🔍 Not Found | Resource missing | Student not found |
| <span style="color: orange">**409**</span> | ⚡ Conflict | Duplicate resource | Course ID already exists |
| <span style="color: red">**500**</span> | ❌ Server Error | Internal error | Database connection failed |

---

## 🎯 Sample Data

The system comes pre-populated with sample data for immediate testing.

### 🔐 Secretaries
| ID | Name | Email |
|----|------|-------|
| `sec-001` | Sarah Johnson | sarah.johnson@uskudar.edu.tr |
| `sec-002` | Michael Chen | michael.chen@uskudar.edu.tr |

### 👨‍🏫 Instructors
| ID | Name | Email | Department |
|----|------|-------|------------|
| `inst-001` | Dr. Youssef Atallah | youssef.atallah@uskudar.edu.tr | Software Engineering |
| `inst-002` | Prof. Emily Watson | emily.watson@uskudar.edu.tr | Computer Science |
| `inst-003` | Dr. Ahmed Hassan | ahmed.hassan@uskudar.edu.tr | Mathematics |
| `inst-004` | Dr. Maria Garcia | maria.garcia@uskudar.edu.tr | Software Engineering |

### 👨‍🎓 Students
| ID | Name | Email |
|----|------|-------|
| `stu-001` | Ali Yilmaz | ali.yilmaz@student.uskudar.edu.tr |
| `stu-002` | Ayşe Demir | ayse.demir@student.uskudar.edu.tr |
| `stu-003` | Mehmet Kaya | mehmet.kaya@student.uskudar.edu.tr |
| `stu-004` | Fatma Özdemir | fatma.ozdemir@student.uskudar.edu.tr |
| `stu-005` | Can Arslan | can.arslan@student.uskudar.edu.tr |
| `stu-006` | Zeynep Şahin | zeynep.sahin@student.uskudar.edu.tr |

### 📚 Courses
| ID | Course Name | Department | Instructor |
|----|-------------|------------|------------|
| `SE302` | Software Project Management | Software Engineering | Dr. Youssef Atallah |
| `CS101` | Introduction to Computer Science | Computer Science | Prof. Emily Watson |
| `MATH201` | Calculus II | Mathematics | Dr. Ahmed Hassan |
| `DS205` | Data Structures and Algorithms | Computer Science | Prof. Emily Watson |
| `DB301` | Database Management Systems | Software Engineering | Dr. Maria Garcia |

> 🔑 **Default Password:** All users have the password `password123`

📄 **[View Complete Sample Data →](./SAMPLE_DATA.md)**

---

## 📝 Documentation Structure

### 📚 Complete Documentation

| Document | Description | Endpoints |
|----------|-------------|-----------|
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick lookup table of all endpoints | 46 |
| **[COURSES.md](./COURSES.md)** | Course management operations | 7 |
| **[STUDENTS.md](./STUDENTS.md)** | Student management operations | 10 |
| **[INSTRUCTORS.md](./INSTRUCTORS.md)** | Instructor management operations | 8 |
| **[RESIT_EXAMS.md](./RESIT_EXAMS.md)** | Resit exam management operations | 9 |
| **[ROUTES_BY_DASHBOARD.md](./ROUTES_BY_DASHBOARD.md)** | Routes organized by user dashboard | - |
| **[SAMPLE_DATA.md](./SAMPLE_DATA.md)** | Pre-populated sample data reference | - |

---

## 💡 Quick Examples

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

---

## 🛠️ Development

### Running the Server
```bash
npm start
```
Server runs on port **3000** with hot-reload enabled.

### Seeding the Database
```bash
npm run seed
```
Populates the database with sample data (2 secretaries, 4 instructors, 6 students, 5 courses, 2 resit exams).

### Re-seeding
```bash
# Delete database and re-seed
rm datastore/sql/uskudar.sqlite
npm run seed
```

---

## 📞 Support & Resources

### 📖 Documentation
- [Quick Reference](./QUICK_REFERENCE.md) - Fast endpoint lookup
- [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md) - Organized by user role
- [Sample Data](./SAMPLE_DATA.md) - Test credentials and data

### 🔗 Quick Links
- Frontend: http://localhost:3000/index.html
- API Base: http://localhost:3000

### 📊 Statistics
- **Total Endpoints:** 46
- **User Roles:** 3 (Secretary, Instructor, Student)
- **Sample Users:** 12 (2 secretaries, 4 instructors, 6 students)
- **Sample Courses:** 5
- **Sample Resit Exams:** 2

---

<div align="center">

**Built with ❤️ for Üsküdar University**

Last Updated: December 27, 2025

[⬆ Back to Top](#-resit-exam-management-system---api-documentation)

</div>
