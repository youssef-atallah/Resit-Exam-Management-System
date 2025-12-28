# 🎓 Resit Exam Management System

> A comprehensive REST API system for managing university resit exams, built with Node.js, Express, TypeScript, and SQLite.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)](https://www.sqlite.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange.svg)](https://jwt.io/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

The Resit Exam Management System is a robust backend API designed to streamline the management of university resit examinations. It provides role-based access control for three user types: **Students**, **Instructors**, and **Secretaries**, each with specific permissions and capabilities.

### Key Capabilities

- **Student Management**: Enrollment, grade tracking, resit exam registration
- **Instructor Management**: Course assignments, resit exam creation, grading
- **Course Management**: CRUD operations, student enrollment, statistics
- **Resit Exam Management**: Scheduling, enrollment, grading, announcements
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Audit Trail**: Comprehensive logging and tracking of all operations

---

## ✨ Features

### For Students
- ✅ View personal profile and enrolled courses
- ✅ Check grades and resit exam eligibility
- ✅ Register for resit exams
- ✅ View resit exam schedules and announcements
- ✅ Track resit exam results

### For Instructors
- ✅ Manage assigned courses
- ✅ Create and schedule resit exams
- ✅ Set resit exam deadlines and locations
- ✅ Grade students (course grades and resit exams)
- ✅ Post announcements for resit exams
- ✅ View course statistics

### For Secretaries (Admin)
- ✅ Full CRUD operations for students, instructors, and courses
- ✅ Assign instructors to courses
- ✅ Enroll students in courses
- ✅ Confirm and modify resit exam details
- ✅ System-wide reporting and statistics
- ✅ User management and access control

---

## 🏗️ Architecture

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.18 |
| **Language** | TypeScript 5.0 |
| **Database** | SQLite 3 |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | Express Validator |
| **Logging** | Custom Middleware |

### Project Structure

```
server/
├── Auth/                    # Authentication & authorization
│   └── authHandler.ts      # JWT middleware, role guards
├── datastore/              # Data access layer
│   ├── dao/               # Data access objects
│   ├── sql/               # SQLite implementation
│   └── index.ts           # Database initialization
├── hundlers/              # Route handlers (controllers)
│   ├── studentHandler.ts
│   ├── instructorHandler.ts
│   ├── courseHandler.ts
│   └── secretaryHandler.ts
├── routes/                # API routes
│   ├── authRoutes.ts
│   ├── studentRoutes.ts
│   ├── instructorRoutes.ts
│   ├── courseRoutes.ts
│   └── secretaryRoutes.ts
├── middleware/            # Custom middleware
│   ├── loggerMiddleware.ts
│   └── errorMiddleware.ts
├── types.ts              # TypeScript type definitions
├── server.ts             # Application entry point
└── docs/                 # API documentation
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- SQLite 3

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Resit-Exam-Management-System/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set JWT_SECRET

# Initialize database
npm run init-db

# Start development server
npm run dev

# Or start production server
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./resit.db
```

> ⚠️ **Important**: Change `JWT_SECRET` to a strong, random string in production!

---

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication with role-based access control.

### Sign In

```bash
POST /auth/signin
Content-Type: application/json

{
  "id": "stu-001",           # Or use "email"
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "stu-001",
    "name": "John Doe",
    "email": "john@university.edu",
    "role": "student"
  }
}
```

### Using the Token

Include the JWT token in the `Authorization` header for all protected routes:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **student** | Enrolled students | View own data, register for resit exams |
| **instructor** | Teaching staff | Manage courses, create resit exams, grade students |
| **secretary** | Administrative staff | Full system access, user management |

---

## 📚 API Documentation

### Quick Reference

| Category | Endpoint | Method | Auth | Description |
|----------|----------|--------|------|-------------|
| **Auth** | `/auth/signin` | POST | ❌ | User authentication |
| **Students** | `/my/profile` | GET | ✅ Student | Get own profile |
| **Students** | `/student/:id` | GET | ✅ Owner/Admin | Get student details |
| **Instructors** | `/my/instructor/profile` | GET | ✅ Instructor | Get own profile |
| **Courses** | `/course/:id` | GET | ✅ All | Get course details |
| **Resit Exams** | `/r-exam/:id` | GET | ✅ All | Get resit exam details |

### Detailed Documentation

For comprehensive API documentation, see:

- **[Authentication Guide](./AUTH.md)** - JWT authentication and authorization
- **[Student API](./STUDENTS.md)** - Student management endpoints
- **[Instructor API](./INSTRUCTORS.md)** - Instructor management endpoints
- **[Course API](./COURSES.md)** - Course management endpoints
- **[Resit Exam API](./RESIT_EXAMS.md)** - Resit exam management endpoints
- **[Quick Reference](./QUICK_REFERENCE.md)** - All endpoints at a glance

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users (base table)
users (id, name, email, password)

-- User Types
students (id → users.id, created_at, created_by, updated_at)
instructors (id → users.id, created_at, created_by, updated_at)
secretaries (id → users.id)

-- Courses
courses (id, name, department, instructor_id, created_at, created_by)

-- Resit Exams
resit_exams (id, course_id, instructor_id, date, location, deadline, announcement)

-- Relationships
course_students (course_id, student_id)
resit_exam_students (resit_exam_id, student_id)
student_course_grades (student_id, course_id, grade, letter_grade)
```

For the complete schema, see [Database Schema Documentation](./DATABASE_SCHEMA.md).

---

## 🔒 Security

### Implemented Security Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Role-Based Access Control** - Fine-grained permissions  
✅ **Resource Ownership Validation** - Users can only access their own data  
✅ **SQL Injection Prevention** - Parameterized queries  
✅ **Error Handling** - Secure error messages (no sensitive data leakage)  
✅ **CORS Configuration** - Cross-origin resource sharing control  

### Security Best Practices

> ⚠️ **Production Checklist:**
> - [ ] Use strong `JWT_SECRET` (32+ random characters)
> - [ ] Enable HTTPS/TLS
> - [ ] Implement password hashing (bcrypt recommended)
> - [ ] Set up rate limiting
> - [ ] Enable request validation
> - [ ] Configure CORS properly
> - [ ] Use environment-specific configurations
> - [ ] Regular security audits

---

## 💻 Development

### Running in Development Mode

```bash
# Start with auto-reload
npm run dev

# Run TypeScript compiler in watch mode
npm run watch

# Check for TypeScript errors
npm run type-check
```

### Code Style

This project follows TypeScript best practices:

- **Strict mode enabled**
- **ESLint** for code quality
- **Prettier** for code formatting
- **Type safety** enforced

### Adding New Features

1. **Define types** in `types.ts`
2. **Create database methods** in `datastore/dao/`
3. **Implement handlers** in `hundlers/`
4. **Add routes** in `routes/`
5. **Apply authorization** using middleware
6. **Update documentation**

---

## 🧪 Testing

### Manual Testing with cURL

```bash
# Sign in
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"id": "stu-001", "password": "password123"}'

# Get student profile (with token)
curl -X GET http://localhost:3000/my/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing with Postman

Import the Postman collection from `docs/postman/` for pre-configured requests.

---

## 🚢 Deployment

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Configuration

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
PORT=3000
DB_PATH=./production.db
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up database backups
- [ ] Enable logging
- [ ] Configure monitoring
- [ ] Set up error tracking

---

## 📖 Additional Resources

- [API Quick Reference](./QUICK_REFERENCE.md)
- [Authentication Guide](./AUTH.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Error Codes](./ERROR_CODES.md)
- [Changelog](./CHANGELOG.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues, questions, or contributions:

- **Issues**: Open an issue on GitHub
- **Documentation**: Check the `/docs` directory
- **Email**: support@university.edu

---

**Built with ❤️ for efficient resit exam management**
