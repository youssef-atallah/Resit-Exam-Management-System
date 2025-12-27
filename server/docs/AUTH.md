# 🔐 Authentication API

## Overview

Complete JWT (JSON Web Token) authentication system for the Resit Exam Management System. This implementation provides secure user authentication with token-based authorization.

## Features

✅ **Sign-in endpoint** with email/ID and password authentication  
✅ **JWT token generation** with 24-hour expiration  
✅ **Authentication middleware** for protecting routes  
✅ **Flexible login** - Use either email or user ID  
✅ **Type-safe** implementation with TypeScript

---

## 📡 API Endpoints

### POST `/auth/signin`

Authenticate a user and receive a JWT token. You can sign in with either **email** or **ID**.

#### Request Body (with email):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Request Body (with ID):
```json
{
  "id": "stu-001",
  "password": "password123"
}
```

#### Success Response (200):
```json
{
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "stu-001",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Error Responses:
| Status | Description |
|--------|-------------|
| `400` | Missing email/id or password |
| `401` | Invalid credentials |
| `500` | Server error |

---

## 💡 Usage Examples

### Sign In with Email

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Sign In with ID

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "id": "stu-001",
    "password": "password123"
  }'
```

### Use Token in Protected Routes

```bash
curl -X GET http://localhost:3000/student/stu-001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🛡️ Protecting Routes with Authentication

To protect a route, add the `authMiddleware` to your route handlers:

### Protect a Single Route
```typescript
import { authMiddleware } from '../Auth/authHandler';

router.get('/protected-route', authMiddleware, (req, res) => {
  const userId = (req as any).userId; // Access authenticated user ID
  // Your route logic here
});
```

### Protect All Routes in a Router
```typescript
import { authMiddleware } from '../Auth/authHandler';

// Protect all student routes
router.use(authMiddleware);

// Now all routes below require authentication
router.get('/student/:id', getStudentHandler);
router.put('/student/:id', updateStudentHandler);
```

---

## 🔧 Implementation Details

### JWT Token Structure

```typescript
{
  id: string;  // User ID
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp (24 hours from issue)
}
```

### Authentication Middleware Flow

1. Extract `Authorization` header from request
2. Verify it starts with `Bearer `
3. Extract and verify JWT token
4. Decode token to get user ID
5. Attach `userId` to request object
6. Call `next()` to continue to route handler

### Database Methods

**`getUserByEmail(email: string)`**
- Queries users table by email
- Returns user object or undefined

**`signInHandler(id: string, password: string)`**
- Queries users table by ID and password
- Returns user object or null

---

## ⚠️ Security Considerations

### 1. Password Storage
Currently using **plain text** password comparison. 

> **⚠️ For production, implement bcrypt hashing:**

```typescript
import bcrypt from 'bcrypt';

// When creating user
const hashedPassword = await bcrypt.hash(password, 10);

// When verifying
const isValid = await bcrypt.compare(password, user.password);
```

### 2. JWT Secret
Change the `JWT_SECRET` in `.env` to a strong, random value in production:

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. HTTPS
Always use HTTPS in production to prevent token interception.

### 4. Token Expiration
Tokens expire after 24 hours. Consider implementing refresh tokens for better UX.

---

## 🌍 Environment Variables

Required in `.env`:

```env
JWT_SECRET=your_secret_key_here
```

---

## 🧪 Testing the Implementation

### Test Sign In with Email
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "student123"
  }'
```

### Test Sign In with ID
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "id": "stu-002",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
# First, get a token from sign-in
TOKEN="your_token_here"

# Then use it to access protected routes
curl -X GET http://localhost:3000/student/stu-001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Files Modified/Created

### Created Files
- `/Auth/authHandler.ts` - Authentication handlers and JWT utilities
- `/routes/authRoutes.ts` - Authentication routes

### Modified Files
- `/datastore/dao/userDao.ts` - Added `getUserByEmail` method
- `/datastore/index.ts` - Extended Datastore with UserDao
- `/datastore/sql/index.ts` - Implemented UserDao methods
- `/server.ts` - Added auth routes
- `/types.ts` - Added JWTObject interface
- `/.env` - Contains JWT_SECRET

---

## 🚀 Next Steps

To fully integrate authentication:

1. **Add `authMiddleware` to protected routes** in:
   - `studentRoutes.ts`
   - `instructorRoutes.ts`
   - `courseRoutes.ts`
   - `secretaryRoutes.ts`

2. **Implement password hashing** with bcrypt

3. **Add refresh token mechanism** for better UX

4. **Create sign-up endpoint** if needed

5. **Add role-based authorization** to restrict access based on user type (student/instructor/secretary)

---

## 📚 Related Documentation

- [Students API](./STUDENTS.md)
- [Instructors API](./INSTRUCTORS.md)
- [Courses API](./COURSES.md)
- [Resit Exams API](./RESIT_EXAMS.md)
