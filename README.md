# 🎓 Resit Exam Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-Academic-yellow.svg)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](http://167.71.15.239:3000/)

**A comprehensive web-based platform for managing resit examinations at Üsküdar University**

[Live Demo](#-live-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Test Accounts](#-test-accounts)

</div>

---



## 📋 Overview

The Resit Exam Management System streamlines the resit examination process with role-based access for **Students**, **Instructors**, and **Faculty Secretaries**. Each role has tailored features to manage their responsibilities effectively.

## 🌐 Live Demo

Experience the system in action on our live demo server:

### 👉 [http://167.71.15.239:3000/](http://167.71.15.239:3000/)

Use the [Test Accounts](#-test-accounts) below to explore different roles and functionalities.

## ✨ Features

### 🎓 Students
- View grades and check resit eligibility based on instructor-defined grade letters
- Apply for resit exams and receive real-time confirmation
- Cancel applications before the deadline
- View instructor announcements for resit exams
- Track application status in real-time
- Receive notifications when resit exams are confirmed

### 👨‍🏫 Instructors
- Create resit exams and define eligible grade letters (e.g., F, D, DD)
- Upload student grades via Excel files
- Send announcements to inform students
- Download application lists in PDF/Excel format
- Monitor and manage student applications
- Receive notifications when resit dates are scheduled

### 🗂️ Faculty Secretaries
- Manage student and instructor accounts
- Enroll/unenroll users in courses
- **Confirm resit exams** with date, time, and location
- Oversee all resit exam processes
- View system-wide statistics

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Resit-Exam-Management-System.git
cd Resit-Exam-Management-System

# Install backend dependencies
cd server
npm install

# Start the server
npm start
```

The server will start at `http://localhost:3000`

### Seed Database (Optional)

To populate the database with test data:

```bash
cd server
npm run seed
```

## 🔑 Test Accounts

All test accounts use the password: **`password123`**

### Secretaries & Instructors
| Role | ID | Email |
|------|-----|-------|
| Secretary | `sec-001` | sarah.johnson@uskudar.edu.tr |
| Secretary | `sec-002` | michael.chen@uskudar.edu.tr |
| Instructor | `inst-001` | youssef.atallah@uskudar.edu.tr |
| Instructor | `inst-002` | emily.watson@uskudar.edu.tr |
| Instructor | `inst-003` | ahmed.hassan@uskudar.edu.tr |
| Instructor | `inst-004` | maria.garcia@uskudar.edu.tr |
| Instructor | `inst-005` | john.smith@uskudar.edu.tr |

### Students
| ID | Name | Has Failing Grades |
|----|------|-------------------|
| `stu-001` | Ali Yilmaz | ✅ SE302(F), SE201(D) |
| `stu-002` | Ayşe Demir | ✅ CS101(F), SE401(F) |
| `stu-003` | Mehmet Kaya | ✅ SE302(F), DS205(F), CS301(D) |
| `stu-004` | Fatma Özdemir | ✅ MATH201(F), CS301(F) |
| `stu-005` | Can Arslan | ✅ DB301(F) |
| `stu-006` | Zeynep Şahin | ✅ SE201(F) |
| `stu-007` | Emre Çelik | ✅ SE302(D), MATH201(F), SE401(F) |
| `stu-008` | Elif Yıldız | ✅ DB301(F) |
| `stu-009` | Burak Koç | ✅ CS101(F), DS205(F), SE201(F) |
| `stu-010` | Selin Aktaş | ✅ CS101(D), CS301(F) |

> 💡 **Tip**: Login as `stu-001` to test a student with multiple failing grades across different courses.

## 📊 Sample Data

The seed script creates:

| Entity | Count | Details |
|--------|-------|---------|
| Secretaries | 2 | Admin users |
| Instructors | 5 | Course teachers |
| Students | 10 | Enrolled in various courses |
| Courses | 8 | SE302, CS101, MATH201, DS205, DB301, SE201, CS301, SE401 |
| Enrollments | 40 | Student-course registrations with grades |
| Resit Exams | 8 | All pending secretary confirmation |
| Notifications | 10+ | Sample system and resit notifications |

### Courses

| Code | Name | Department | Instructor |
|------|------|------------|------------|
| SE302 | Software Project Management | Software Engineering | Dr. Youssef Atallah |
| CS101 | Introduction to Computer Science | Computer Science | Prof. Emily Watson |
| MATH201 | Calculus II | Mathematics | Dr. Ahmed Hassan |
| DS205 | Data Structures and Algorithms | Computer Science | Prof. Emily Watson |
| DB301 | Database Management Systems | Software Engineering | Dr. Maria Garcia |
| SE201 | Object Oriented Programming | Software Engineering | Dr. Youssef Atallah |
| CS301 | Operating Systems | Computer Science | Prof. John Smith |
| SE401 | Software Architecture | Software Engineering | Dr. Maria Garcia |

## 🏗️ Project Structure

```
Resit-Exam-Management-System/
├── server/                    # Backend (Node.js + Express + TypeScript)
│   ├── Auth/                  # Authentication handlers
│   ├── datastore/             # Database layer
│   │   ├── dao/               # Data Access Objects
│   │   ├── sql/               # SQLite implementation
│   │   │   └── migrations/    # Database migrations
│   │   └── seed.ts            # Database seeding script
│   ├── handlers/              # Request handlers
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   ├── types.ts               # TypeScript types
│   └── server.ts              # Entry point
│
├── web/                       # Frontend (Vanilla JS + HTML + CSS)
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript modules
│   │   ├── pages/             # Page-specific scripts
│   │   └── utils/             # Shared utilities
│   └── pages/                 # HTML pages
│       ├── student/           # Student portal
│       ├── instructor/        # Instructor portal
│       └── secretary/         # Secretary portal
│
└── docs/                      # Documentation
```

## 📚 API Documentation

Comprehensive API documentation is available:

- **[API Reference](server/docs/README.md)** - Full endpoint documentation
- **[Database Schema](server/docs/DATABASE_SCHEMA.md)** - ERD and table structures

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signin` | User authentication |
| GET | `/student/:id` | Get student profile |
| GET | `/instructor/:id` | Get instructor profile |
| GET | `/secretary/resit-exams` | List all resit exams |
| PUT | `/secretary/confirm/resit-exam/:id` | Confirm resit exam |

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT Authentication

**Frontend:**
- Vanilla JavaScript (ES6 Modules)
- HTML5 + CSS3
- Font Awesome Icons

## 👥 Team & Contribution

This project was developed as a team effort for the SE302 Software Project Management course. 

**My Contribution:** Backend development including:
- RESTful API design and implementation
- Database schema design
- Authentication & authorization system
- Secretary resit confirmation with notifications

## ⚠️ Disclaimer

This project was developed **solely for academic purposes**. It has not been tested for production-level security, performance, or compliance. **Do not use in a real-world environment** without significant development and security hardening.

---

<div align="center">

📚 **Üsküdar University** | Software Engineering Department | 2024-2025

</div>
