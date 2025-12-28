# 🚀 Getting Started Guide

Quick start guide to get the Resit Exam Management System up and running.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **SQLite** 3 ([Download](https://www.sqlite.org/download.html))
- **Git** (optional, for cloning)

### Verify Installation

```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
sqlite3 --version # Should be 3.x.x
```

---

## Installation

### Step 1: Get the Code

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd Resit-Exam-Management-System/server

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- typescript
- sqlite3
- jsonwebtoken
- dotenv
- and more...

### Step 3: Set Up Environment Variables

Create a `.env` file in the `server` directory:

```bash
# Copy the example file
cp .env.example .env

# Or create manually
touch .env
```

Add the following to `.env`:

```env
# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./resit.db
```

> ⚠️ **Important**: Generate a strong JWT secret for production!

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Initialize Database

```bash
# Run database migrations
npm run migrate

# Or manually
sqlite3 resit.db < datastore/sql/migrations/001-initial.sql
```

### Step 5: (Optional) Seed Sample Data

```bash
# Add sample users and data for testing
npm run seed
```

This creates:
- 2 students (stu-001, stu-002)
- 2 instructors (inst-001, inst-002)
- 1 secretary (sec-001)
- 3 courses
- 2 resit exams

All with password: `password123`

---

## Running the Server

### Development Mode

```bash
npm run dev
```

This starts the server with:
- Auto-reload on file changes (nodemon)
- TypeScript compilation
- Detailed logging

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Verify Server is Running

```bash
# Check server health
curl http://localhost:3000/

# Or open in browser
open http://localhost:3000/index.html
```

---

## First API Call

### 1. Sign In

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "id": "stu-001",
    "password": "password123"
  }'
```

**Expected Response:**
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

### 2. Save the Token

```bash
# Save token to environment variable
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Make Authenticated Request

```bash
curl -X GET http://localhost:3000/my/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "student": {
    "id": "stu-001",
    "name": "John Doe",
    "email": "john@university.edu",
    "courses": ["CS101", "CS102"],
    "resitExams": ["resit-CS101-001"]
  }
}
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `docs/postman/Resit-Exam-API.postman_collection.json`
4. Collection will be imported with all endpoints

### Set Up Environment

1. Create new environment: **Resit Exam - Dev**
2. Add variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set automatically after sign-in)

### Test Flow

1. **Auth** → Sign In (Student)
2. **Students** → Get My Profile
3. **Students** → Get My Courses
4. Try other endpoints!

---

## Common Tasks

### View Database

```bash
# Open SQLite CLI
sqlite3 resit.db

# List tables
.tables

# View students
SELECT * FROM students;

# Exit
.quit
```

### Check Logs

```bash
# Server logs are printed to console
# Look for:
[3:00:00 PM] GET /my/profile 200 +5ms
```

### Reset Database

```bash
# Delete database
rm resit.db

# Recreate
npm run migrate
npm run seed
```

### Update Dependencies

```bash
npm update
```

---

## Project Structure

```
server/
├── Auth/                   # Authentication & authorization
│   └── authHandler.ts
├── datastore/             # Database layer
│   ├── dao/              # Data access objects
│   ├── sql/              # SQLite implementation
│   │   ├── migrations/   # Database migrations
│   │   └── index.ts
│   └── index.ts
├── hundlers/             # Route handlers
│   ├── studentHandler.ts
│   ├── instructorHandler.ts
│   ├── courseHandler.ts
│   └── secretaryHandler.ts
├── routes/               # API routes
│   ├── authRoutes.ts
│   ├── studentRoutes.ts
│   ├── instructorRoutes.ts
│   ├── courseRoutes.ts
│   └── secretaryRoutes.ts
├── middleware/           # Custom middleware
│   ├── loggerMiddleware.ts
│   └── errorMiddleware.ts
├── docs/                 # Documentation
├── web/                  # Frontend files
├── types.ts              # TypeScript types
├── server.ts             # Entry point
├── package.json
├── tsconfig.json
└── .env                  # Environment variables
```

---

## Troubleshooting

### Port Already in Use

```bash
# Error: EADDRINUSE: address already in use :::3000

# Solution 1: Change port in .env
PORT=3001

# Solution 2: Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Locked

```bash
# Error: SQLITE_BUSY: database is locked

# Solution: Close all SQLite connections
pkill sqlite3

# Or delete lock file
rm resit.db-journal
```

### TypeScript Errors

```bash
# Check for errors
npm run type-check

# Rebuild
npm run build
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

Now that you have the server running:

1. **Explore the API**
   - Read [API Documentation](./README.md)
   - Try different endpoints with Postman
   - Check [Quick Reference](./QUICK_REFERENCE.md)

2. **Understand Authentication**
   - Read [Authentication Guide](./AUTH.md)
   - Test role-based access control
   - Try different user roles

3. **Learn the Database**
   - Read [Database Schema](./DATABASE_SCHEMA.md)
   - Explore tables with SQLite
   - Run sample queries

4. **Start Development**
   - Add new features
   - Customize for your needs
   - Deploy to production

---

## Quick Reference

### Default Users

| ID | Role | Email | Password |
|----|------|-------|----------|
| stu-001 | Student | john@university.edu | password123 |
| stu-002 | Student | jane@university.edu | password123 |
| inst-001 | Instructor | alice@university.edu | password123 |
| inst-002 | Instructor | bob@university.edu | password123 |
| sec-001 | Secretary | admin@university.edu | password123 |

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Check TypeScript
npm run build            # Build for production

# Database
npm run migrate          # Run migrations
npm run seed             # Seed sample data
sqlite3 resit.db         # Open database

# Testing
npm test                 # Run tests (if configured)
```

### Important URLs

- **API Base**: `http://localhost:3000`
- **Frontend**: `http://localhost:3000/index.html`
- **Health Check**: `http://localhost:3000/`

---

## Support

Need help?

- **Documentation**: Check `/docs` directory
- **Issues**: Open an issue on GitHub
- **Email**: support@university.edu

---

**Happy coding! 🎉**
