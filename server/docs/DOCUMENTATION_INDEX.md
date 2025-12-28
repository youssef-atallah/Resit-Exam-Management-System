# 📚 Documentation Index

Complete guide to the Resit Exam Management System documentation.

---

## 🚀 Getting Started

Perfect for first-time users and developers setting up the system.

### [Getting Started Guide](./GETTING_STARTED.md)
**Start here!** Complete installation, setup, and first API call guide.

**Topics:**
- Prerequisites and installation
- Environment configuration
- Database initialization
- Running the server
- Making your first API call
- Troubleshooting

**Time to complete:** 15-20 minutes

---

## 📖 Core Documentation

### [Main README](./README.md)
Comprehensive overview of the entire system.

**Topics:**
- System overview and features
- Architecture and technology stack
- Project structure
- Quick start guide
- Security overview
- Deployment guide

**Best for:** Understanding the big picture

---

### [API Quick Reference](./QUICK_REFERENCE.md)
All API endpoints at a glance.

**Topics:**
- Complete endpoint list (55 endpoints)
- Request/response examples
- Status codes and error handling
- cURL examples
- Testing guide

**Best for:** Quick lookup while developing

---

### [Authentication & Authorization](./AUTH.md)
Complete guide to JWT authentication and role-based access control.

**Topics:**
- Authentication flow
- JWT token structure
- Authorization strategies (RBAC, ownership, instructor access)
- Middleware documentation
- Security best practices
- Testing examples

**Best for:** Implementing authentication and understanding permissions

---

### [Database Schema](./DATABASE_SCHEMA.md)
Complete database structure and relationships.

**Topics:**
- Entity relationship diagram
- Table definitions
- Relationships and foreign keys
- Indexes
- Sample data and queries
- Migration guide

**Best for:** Understanding data model and writing queries

---

## 📋 API Documentation by Entity

Detailed documentation for each entity type.

### [Student API](./STUDENTS.md)
All student-related endpoints.

**Topics:**
- JWT-based student routes
- Secretary student management
- Student information by ID
- Instructor student access
- Request/response examples

**Endpoints:** 19

---

### [Instructor API](./INSTRUCTORS.md)
All instructor-related endpoints.

**Topics:**
- JWT-based instructor routes
- Secretary instructor management
- Course management
- Resit exam creation and management
- Grading operations

**Endpoints:** 24

---

### [Course API](./COURSES.md)
All course-related endpoints.

**Topics:**
- Course CRUD operations
- Student enrollment
- Course statistics
- Instructor assignments

**Endpoints:** 7

---

### [Resit Exam API](./RESIT_EXAMS.md)
All resit exam-related endpoints.

**Topics:**
- Resit exam creation
- Student enrollment
- Grading
- Announcements
- Secretary confirmation

**Endpoints:** Multiple (distributed across instructor/secretary routes)

---

## 🔧 Additional Resources

### [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md)
Endpoints organized by user dashboard (Student, Instructor, Secretary).

**Best for:** Understanding what each user type can do

---

### [Error Codes](./ERROR_CODES.md)
Complete list of error codes and their meanings.

**Topics:**
- HTTP status codes
- Error response formats
- Common errors and solutions

**Best for:** Debugging and error handling

---

### [Changelog](./CHANGELOG.md)
Version history and changes.

**Topics:**
- Version releases
- New features
- Bug fixes
- Breaking changes

**Best for:** Tracking system evolution

---

## 📊 Documentation by Use Case

### For New Developers

1. **[Getting Started](./GETTING_STARTED.md)** - Set up your environment
2. **[Main README](./README.md)** - Understand the system
3. **[Database Schema](./DATABASE_SCHEMA.md)** - Learn the data model
4. **[Authentication Guide](./AUTH.md)** - Implement auth
5. **[Quick Reference](./QUICK_REFERENCE.md)** - Start coding

**Estimated time:** 1-2 hours

---

### For API Consumers

1. **[Authentication Guide](./AUTH.md)** - Get your JWT token
2. **[Quick Reference](./QUICK_REFERENCE.md)** - Find endpoints
3. **[Student/Instructor/Course API](./STUDENTS.md)** - Detailed docs
4. **[Error Codes](./ERROR_CODES.md)** - Handle errors

**Estimated time:** 30-45 minutes

---

### For System Administrators

1. **[Getting Started](./GETTING_STARTED.md)** - Deploy the system
2. **[Main README](./README.md)** - Security and deployment
3. **[Database Schema](./DATABASE_SCHEMA.md)** - Backup and maintenance
4. **[Authentication Guide](./AUTH.md)** - Security configuration

**Estimated time:** 1 hour

---

### For Database Administrators

1. **[Database Schema](./DATABASE_SCHEMA.md)** - Complete schema
2. **[Getting Started](./GETTING_STARTED.md)** - Migrations
3. **[Main README](./README.md)** - Backup strategy

**Estimated time:** 30 minutes

---

## 🎯 Quick Links

### Common Tasks

| Task | Documentation |
|------|---------------|
| Install and run | [Getting Started](./GETTING_STARTED.md#installation) |
| Sign in and get token | [Auth Guide](./AUTH.md#sign-in) |
| Create a student | [Student API](./STUDENTS.md#create-student) |
| Create a course | [Course API](./COURSES.md#create-course) |
| Create resit exam | [Instructor API](./INSTRUCTORS.md#create-resit-exam) |
| Set grades | [Instructor API](./INSTRUCTORS.md#grading) |
| View all endpoints | [Quick Reference](./QUICK_REFERENCE.md) |
| Understand permissions | [Auth Guide](./AUTH.md#authorization) |
| Database structure | [Database Schema](./DATABASE_SCHEMA.md#tables) |
| Troubleshooting | [Getting Started](./GETTING_STARTED.md#troubleshooting) |

---

## 📝 Documentation Standards

All documentation follows these standards:

✅ **Clear Structure** - Table of contents, sections, subsections  
✅ **Code Examples** - Real, working examples with expected output  
✅ **Visual Aids** - Diagrams, tables, and formatted code blocks  
✅ **Cross-References** - Links to related documentation  
✅ **Practical Focus** - Real-world use cases and scenarios  
✅ **Up-to-Date** - Reflects current system implementation

---

## 🔄 Documentation Updates

### How to Contribute

1. Identify outdated or missing information
2. Create/update documentation
3. Follow existing format and style
4. Add to this index if creating new docs
5. Submit pull request

### Recent Updates

- **Dec 2024**: Added role-based authorization documentation
- **Dec 2024**: Created comprehensive authentication guide
- **Dec 2024**: Added database schema with ERD
- **Dec 2024**: Reorganized documentation structure

---

## 📞 Support

### Documentation Issues

Found an error or unclear section?

- **GitHub Issues**: Report documentation bugs
- **Pull Requests**: Submit improvements
- **Email**: docs@university.edu

### Getting Help

- **Quick Questions**: Check [Quick Reference](./QUICK_REFERENCE.md)
- **Setup Issues**: See [Getting Started](./GETTING_STARTED.md#troubleshooting)
- **API Questions**: See entity-specific docs
- **General Support**: support@university.edu

---

## 📦 Documentation Files

```
docs/
├── README.md                    # Main documentation (you are here)
├── GETTING_STARTED.md          # Installation and setup guide
├── QUICK_REFERENCE.md          # All endpoints at a glance
├── AUTH.md                     # Authentication & authorization
├── DATABASE_SCHEMA.md          # Database structure
├── STUDENTS.md                 # Student API documentation
├── INSTRUCTORS.md              # Instructor API documentation
├── COURSES.md                  # Course API documentation
├── RESIT_EXAMS.md             # Resit exam API documentation
├── ROUTES_BY_DASHBOARD.md     # Routes by user type
├── ERROR_CODES.md             # Error reference
├── CHANGELOG.md               # Version history
└── DOCUMENTATION_INDEX.md     # This file
```

---

## 🎓 Learning Path

### Beginner Path

1. Read [Main README](./README.md) overview
2. Follow [Getting Started](./GETTING_STARTED.md)
3. Try examples from [Quick Reference](./QUICK_REFERENCE.md)
4. Explore [Student API](./STUDENTS.md)

### Intermediate Path

1. Study [Authentication Guide](./AUTH.md)
2. Learn [Database Schema](./DATABASE_SCHEMA.md)
3. Explore [Instructor API](./INSTRUCTORS.md)
4. Understand [Course API](./COURSES.md)

### Advanced Path

1. Deep dive into [Database Schema](./DATABASE_SCHEMA.md)
2. Master [Authentication & Authorization](./AUTH.md)
3. Study all entity APIs
4. Review [Routes by Dashboard](./ROUTES_BY_DASHBOARD.md)

---

**Total Documentation Pages**: 13  
**Total API Endpoints Documented**: 55  
**Last Updated**: December 2024

---

**Happy learning! 📚**
