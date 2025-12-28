# 📝 Changelog

All notable changes to the Resit Exam Management System.

---

## [2.0.0] - 2024-12-27

### 🎉 Major Release - Role-Based Authentication & Authorization

This release introduces comprehensive JWT-based authentication with role-based access control.

### ✨ Added

#### Authentication & Authorization
- **JWT Authentication** - Token-based authentication for all protected routes
- **Role-Based Access Control (RBAC)** - Fine-grained permissions for students, instructors, and secretaries
- **Resource Ownership Validation** - Users can only access their own data
- **Instructor Course Access** - Instructors can only access students in their courses
- **Authorization Middleware**:
  - `authMiddleware` - JWT token verification
  - `requireRole()` - Role-based route protection
  - `requireOwnResource()` - Resource ownership validation
  - `requireOwnerOrRole()` - Combined ownership and role validation
  - `requireInstructorAccess()` - Instructor-student relationship validation

#### New API Endpoints
- **Student JWT Routes** (5 endpoints):
  - `GET /my/profile` - Get own profile
  - `PUT /my/profile` - Update own profile
  - `GET /my/courses` - Get own courses
  - `GET /my/course-details` - Get own course details
  - `GET /my/resit-exams` - Get own resit exams

- **Instructor JWT Routes** (5 endpoints):
  - `GET /my/instructor/profile` - Get own profile
  - `PUT /my/instructor/profile` - Update own profile
  - `GET /my/instructor/courses` - Get own courses
  - `GET /my/instructor/course-details` - Get own course details
  - `GET /my/instructor/resit-exams` - Get own resit exams

#### Database Changes
- Added `getUserWithRole()` method for role detection during sign-in
- Enhanced user queries to include role information

#### Documentation
- **NEW**: [Getting Started Guide](./GETTING_STARTED.md)
- **NEW**: [Authentication & Authorization Guide](./AUTH.md)
- **NEW**: [Database Schema Documentation](./DATABASE_SCHEMA.md)
- **NEW**: [Documentation Index](./DOCUMENTATION_INDEX.md)
- **UPDATED**: [Main README](./README.md) - Complete rewrite with professional structure
- **UPDATED**: [Quick Reference](./QUICK_REFERENCE.md) - All endpoints with auth requirements
- **UPDATED**: All API documentation with authorization details

### 🔒 Security

- **JWT Token Expiration** - 24-hour token lifetime
- **Secure Error Messages** - No sensitive data leakage in error responses
- **Role Validation** - All protected routes now validate user roles
- **Resource Access Control** - Students cannot access other students' data
- **Instructor Boundaries** - Instructors can only access their own students

### 🔄 Changed

#### Breaking Changes
- **All routes now require authentication** (except `/auth/signin`)
- **Authorization header required**: `Authorization: Bearer <token>`
- **Role-based access** - Routes restricted by user role
- **Error response format** - Standardized error messages

#### Route Changes
- Added `authMiddleware` to all protected routes
- Added role guards (`requireRole`, `requireOwnerOrRole`) to routes
- Reorganized routes for better clarity and security

#### Code Quality
- **Cleaned up route comments** - Concise inline comments instead of verbose JSDoc
- **Improved code organization** - Better separation of concerns
- **Type safety** - Enhanced TypeScript types for JWT and auth

### 🐛 Fixed

- **Auth route path** - Fixed double `/auth` prefix issue
- **TypeScript compilation** - Fixed middleware return type errors
- **Database queries** - Fixed `getUserWithRole` to properly JOIN with users table

### ⚠️ Security Recommendations

> **Important**: The following security improvements are recommended for production:

1. **Password Hashing** - Currently using plain text passwords
   - Implement bcrypt hashing
   - See [AUTH.md](./AUTH.md#security-best-practices)

2. **Strong JWT Secret** - Use a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **HTTPS** - Always use HTTPS in production

4. **Rate Limiting** - Implement rate limiting on `/auth/signin`

5. **Token Refresh** - Consider implementing refresh tokens

---

## [1.0.0] - 2024-12-26

### 🎉 Initial Release

First stable release of the Resit Exam Management System.

### ✨ Features

#### Core Functionality
- **Student Management** - CRUD operations for students
- **Instructor Management** - CRUD operations for instructors
- **Course Management** - CRUD operations for courses
- **Resit Exam Management** - Create, update, delete resit exams
- **Enrollment Management** - Enroll students in courses and resit exams
- **Grading System** - Set and manage student grades

#### API Endpoints
- **Student Routes** (14 endpoints)
- **Instructor Routes** (19 endpoints)
- **Course Routes** (7 endpoints)
- **Secretary Routes** (5 endpoints)

#### Database
- **SQLite Database** - Lightweight, file-based database
- **Normalized Schema** - Efficient data structure
- **Foreign Key Constraints** - Data integrity
- **Audit Trail** - Created/updated timestamps

#### Documentation
- API documentation for all endpoints
- Database schema documentation
- Quick reference guide
- Routes organized by dashboard

### 🏗️ Technical Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.0
- **Database**: SQLite 3
- **Logging**: Custom middleware

---

## [0.1.0] - 2024-12-20

### 🚧 Beta Release

Initial beta release for testing.

### ✨ Added

- Basic CRUD operations
- Database schema
- API routes
- Error handling
- Logging middleware

### 🐛 Known Issues

- No authentication
- No authorization
- Plain text passwords
- Limited error handling

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards-compatible)
- **PATCH** version for backwards-compatible bug fixes

---

## Upgrade Guide

### From 1.0.0 to 2.0.0

#### Breaking Changes

1. **Authentication Required**
   - All routes now require JWT token
   - Update API clients to include `Authorization` header

2. **Sign In Response Changed**
   ```javascript
   // Old (1.0.0)
   { "success": true, "user": {...} }
   
   // New (2.0.0)
   { "message": "Sign in successful", "token": "...", "user": {...} }
   ```

3. **Error Response Format**
   ```javascript
   // Old (1.0.0)
   { "success": false, "message": "Error" }
   
   // New (2.0.0)
   { "error": "Error message", "required": [...], "current": "..." }
   ```

#### Migration Steps

1. **Update Environment Variables**
   ```env
   # Add JWT_SECRET to .env
   JWT_SECRET=your-secret-key-here
   ```

2. **Update API Clients**
   ```javascript
   // Add authentication header to all requests
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

3. **Handle New Error Responses**
   ```javascript
   // Check for 401/403 errors
   if (response.status === 401) {
     // Redirect to login
   }
   ```

4. **Update Frontend**
   - Implement sign-in flow
   - Store JWT token
   - Add token to all API requests
   - Handle token expiration

---

## Roadmap

### Planned for 2.1.0

- [ ] Password hashing with bcrypt
- [ ] Rate limiting
- [ ] Request validation
- [ ] Pagination for list endpoints
- [ ] Filtering and sorting
- [ ] Bulk operations

### Planned for 3.0.0

- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Advanced reporting

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Reporting bugs
- Suggesting features
- Submitting pull requests
- Code style
- Testing requirements

---

## Support

For questions or issues:

- **Documentation**: Check `/docs` directory
- **Issues**: Open an issue on GitHub
- **Email**: support@university.edu

---

**Format**: Based on [Keep a Changelog](https://keepachangelog.com/)  
**Last Updated**: December 27, 2024
