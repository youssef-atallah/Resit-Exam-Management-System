# ⚠️ Error Codes Reference

Complete reference for all error codes and responses in the Resit Exam Management System.

---

## HTTP Status Codes

### Success Codes (2xx)

| Code | Name | Description | Usage |
|------|------|-------------|-------|
| 200 | OK | Request successful | GET, PUT, DELETE requests |
| 201 | Created | Resource created successfully | POST requests |

---

### Client Error Codes (4xx)

| Code | Name | Description | Common Causes |
|------|------|-------------|---------------|
| 400 | Bad Request | Invalid request data | Missing fields, invalid format |
| 401 | Unauthorized | Authentication required | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions | Wrong role, not owner |
| 404 | Not Found | Resource doesn't exist | Invalid ID, deleted resource |

---

### Server Error Codes (5xx)

| Code | Name | Description | Common Causes |
|------|------|-------------|---------------|
| 500 | Internal Server Error | Server-side error | Database error, unhandled exception |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional information (optional)",
  "required": ["role1", "role2"] (optional),
  "current": "user's current role" (optional)
}
```

---

## Authentication Errors (401)

### No Token Provided

**Cause**: Missing `Authorization` header

**Response:**
```json
{
  "error": "No token provided"
}
```

**Solution:**
```bash
# Include Authorization header
curl -H "Authorization: Bearer <token>" http://localhost:3000/endpoint
```

---

### Invalid or Expired Token

**Cause**: Token is malformed, expired, or has invalid signature

**Response:**
```json
{
  "error": "Invalid or expired token"
}
```

**Solution:**
```bash
# Sign in again to get a new token
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"id": "stu-001", "password": "password123"}'
```

---

### No Role in Token

**Cause**: Token doesn't contain role information (shouldn't happen with current implementation)

**Response:**
```json
{
  "error": "Unauthorized - No role in token"
}
```

**Solution:**
- Sign in again
- Check JWT token generation code

---

### No User ID in Token

**Cause**: Token doesn't contain user ID (shouldn't happen with current implementation)

**Response:**
```json
{
  "error": "Unauthorized - No user ID in token"
}
```

**Solution:**
- Sign in again
- Check JWT token generation code

---

### Missing Authentication Data

**Cause**: Token missing userId or userRole

**Response:**
```json
{
  "error": "Unauthorized - Missing authentication data"
}
```

**Solution:**
- Sign in again with valid credentials

---

## Authorization Errors (403)

### Insufficient Permissions

**Cause**: User's role doesn't have access to this endpoint

**Response:**
```json
{
  "error": "Forbidden - Insufficient permissions",
  "required": ["secretary"],
  "current": "student"
}
```

**Example:**
```bash
# Student trying to create another student (secretary only)
curl -X POST http://localhost:3000/student/ \
  -H "Authorization: Bearer <student-token>" \
  -H "Content-Type: application/json" \
  -d '{"id": "stu-999", ...}'
```

**Solution:**
- Use an account with the required role
- Check endpoint permissions in documentation

---

### Not Owner

**Cause**: User trying to access another user's resource

**Response:**
```json
{
  "error": "Forbidden - You can only access your own resources"
}
```

**Example:**
```bash
# Student stu-001 trying to access stu-002's data
curl -X GET http://localhost:3000/student/stu-002 \
  -H "Authorization: Bearer <stu-001-token>"
```

**Solution:**
- Access only your own resources
- Use secretary account for full access

---

### Instructor Access Denied

**Cause**: Instructor trying to access student not in their courses

**Response:**
```json
{
  "error": "Forbidden - Student is not enrolled in any of your courses"
}
```

**Example:**
```bash
# Instructor trying to access student not in their courses
curl -X GET http://localhost:3000/student/stu-999 \
  -H "Authorization: Bearer <instructor-token>"
```

**Solution:**
- Only access students enrolled in your courses
- Use secretary account for full access

---

## Validation Errors (400)

### Missing Required Fields

**Cause**: Request missing required fields

**Response:**
```json
{
  "error": "Email or ID and password are required"
}
```

**Example:**
```bash
# Sign in without password
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"id": "stu-001"}'
```

**Solution:**
- Include all required fields
- Check API documentation for required fields

---

### Invalid Credentials

**Cause**: Wrong email/ID or password

**Response:**
```json
{
  "error": "Invalid credentials"
}
```

**Solution:**
- Check email/ID and password
- Verify account exists

---

### Missing Required Parameters

**Cause**: Missing URL parameters or request body fields

**Response:**
```json
{
  "error": "Bad request - Missing required parameters"
}
```

**Solution:**
- Check API documentation
- Include all required parameters

---

## Resource Errors (404)

### Resource Not Found

**Cause**: Requested resource doesn't exist

**Response:**
```json
{
  "error": "Student not found"
}
```

```json
{
  "error": "Instructor not found"
}
```

```json
{
  "error": "Course not found"
}
```

```json
{
  "error": "Resit exam not found"
}
```

**Solution:**
- Verify resource ID
- Check if resource was deleted

---

### Instructor or Student Not Found

**Cause**: User doesn't exist in database (for instructor access validation)

**Response:**
```json
{
  "error": "Instructor or student not found"
}
```

**Solution:**
- Verify both instructor and student exist
- Check IDs are correct

---

## Server Errors (500)

### General Server Error

**Cause**: Unhandled exception or database error

**Response:**
```json
{
  "error": "Failed to sign in user"
}
```

```json
{
  "error": "Failed to process request"
}
```

**Solution:**
- Check server logs
- Verify database is accessible
- Report to system administrator

---

### Authorization Check Failed

**Cause**: Error during instructor access validation

**Response:**
```json
{
  "error": "Authorization check failed",
  "details": "Database connection error"
}
```

**Solution:**
- Check server logs
- Verify database is accessible
- Try again later

---

## Common Error Scenarios

### Scenario 1: Student Accessing Another Student's Data

```bash
# Request
curl -X GET http://localhost:3000/student/stu-002 \
  -H "Authorization: Bearer <stu-001-token>"

# Response: 403 Forbidden
{
  "error": "Forbidden - Insufficient permissions",
  "required": ["secretary", "instructor"],
  "current": "student"
}
```

**Why?** Students can only access their own data via `/my/*` routes.

---

### Scenario 2: Instructor Creating a Course

```bash
# Request
curl -X POST http://localhost:3000/course \
  -H "Authorization: Bearer <instructor-token>" \
  -H "Content-Type: application/json" \
  -d '{"id": "CS999", "name": "Test", "department": "CS"}'

# Response: 403 Forbidden
{
  "error": "Forbidden - Insufficient permissions",
  "required": ["secretary"],
  "current": "instructor"
}
```

**Why?** Only secretaries can create courses.

---

### Scenario 3: Expired Token

```bash
# Request
curl -X GET http://localhost:3000/my/profile \
  -H "Authorization: Bearer <expired-token>"

# Response: 401 Unauthorized
{
  "error": "Invalid or expired token"
}
```

**Solution:** Sign in again to get a new token.

---

### Scenario 4: Missing Token

```bash
# Request
curl -X GET http://localhost:3000/my/profile

# Response: 401 Unauthorized
{
  "error": "No token provided"
}
```

**Solution:** Include `Authorization: Bearer <token>` header.

---

## Error Handling Best Practices

### Client-Side

```javascript
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Handle specific errors
      switch (response.status) {
        case 401:
          // Redirect to login
          redirectToLogin();
          break;
        case 403:
          // Show permission error
          showError(`Access denied: ${error.error}`);
          break;
        case 404:
          // Show not found error
          showError('Resource not found');
          break;
        case 500:
          // Show server error
          showError('Server error. Please try again later.');
          break;
        default:
          showError(error.error || 'An error occurred');
      }
      
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

### Server-Side (Adding New Errors)

```typescript
// Return consistent error format
res.status(400).json({
  error: 'Clear error message',
  details: 'Additional context (optional)'
});

// For authorization errors, include role information
res.status(403).json({
  error: 'Forbidden - Insufficient permissions',
  required: ['secretary'],
  current: userRole
});
```

---

## Debugging Errors

### Check Server Logs

```bash
# Server logs show detailed error information
[3:00:00 PM] POST /auth/signin 401 +5ms
 Body: { "id": "stu-001", "password": "wrong" }

# Look for error messages
Error signing in user: Invalid credentials
```

### Use Verbose Mode

```bash
# Add -v flag to curl for verbose output
curl -v -X GET http://localhost:3000/my/profile \
  -H "Authorization: Bearer <token>"
```

### Check Database

```bash
# Verify data exists
sqlite3 resit.db "SELECT * FROM users WHERE id = 'stu-001';"
```

---

## Error Code Summary

| Code | Count | Most Common |
|------|-------|-------------|
| 200 | - | Successful requests |
| 201 | - | Resource created |
| 400 | 3 | Missing fields, invalid data |
| 401 | 5 | Missing/invalid token |
| 403 | 3 | Wrong role, not owner |
| 404 | 5 | Resource not found |
| 500 | 2 | Server/database errors |

---

## Additional Resources

- **[Authentication Guide](./AUTH.md)** - Detailed auth documentation
- **[Quick Reference](./QUICK_REFERENCE.md)** - All endpoints
- **[Getting Started](./GETTING_STARTED.md)** - Troubleshooting guide

---

**Last Updated**: December 2024
