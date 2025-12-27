# Sample Data Summary

The database has been populated with sample data for testing purposes.

## 📊 Data Overview

- **2 Secretaries**
- **4 Instructors**
- **6 Students**
- **5 Courses**
- **17 Course Enrollments**
- **2 Resit Exams**

## 🔑 Login Credentials

All users have the password: `password123`

### Secretaries
- **Sarah Johnson**: `sarah.johnson@uskudar.edu.tr`
- **Michael Chen**: `michael.chen@uskudar.edu.tr`

### Instructors
- **Dr. Youssef Atallah** (ID: `inst-001`): `youssef.atallah@uskudar.edu.tr`
- **Prof. Emily Watson** (ID: `inst-002`): `emily.watson@uskudar.edu.tr`
- **Dr. Ahmed Hassan** (ID: `inst-003`): `ahmed.hassan@uskudar.edu.tr`
- **Dr. Maria Garcia** (ID: `inst-004`): `maria.garcia@uskudar.edu.tr`

### Students
- **Ali Yilmaz** (ID: `stu-001`): `ali.yilmaz@student.uskudar.edu.tr`
- **Ayşe Demir** (ID: `stu-002`): `ayse.demir@student.uskudar.edu.tr`
- **Mehmet Kaya** (ID: `stu-003`): `mehmet.kaya@student.uskudar.edu.tr`
- **Fatma Özdemir** (ID: `stu-004`): `fatma.ozdemir@student.uskudar.edu.tr`
- **Can Arslan** (ID: `stu-005`): `can.arslan@student.uskudar.edu.tr`
- **Zeynep Şahin** (ID: `stu-006`): `zeynep.sahin@student.uskudar.edu.tr`

## 📚 Courses

### SE302 - Software Project Management
- **Department**: Software Engineering
- **Instructor**: Dr. Youssef Atallah (`inst-001`)
- **Students**:
  - Ali Yilmaz: 45 (F) - Enrolled in resit
  - Ayşe Demir: 72 (B)
  - Mehmet Kaya: 38 (F) - Enrolled in resit
  - Fatma Özdemir: 85 (A)

### CS101 - Introduction to Computer Science
- **Department**: Computer Science
- **Instructor**: Prof. Emily Watson (`inst-002`)
- **Students**:
  - Ali Yilmaz: 68 (C)
  - Ayşe Demir: 42 (F) - Enrolled in resit
  - Can Arslan: 78 (B)
  - Zeynep Şahin: 90 (A)

### MATH201 - Calculus II
- **Department**: Mathematics
- **Instructor**: Dr. Ahmed Hassan (`inst-003`)
- **Students**:
  - Mehmet Kaya: 55 (D)
  - Fatma Özdemir: 48 (F)
  - Can Arslan: 82 (A)

### DS205 - Data Structures and Algorithms
- **Department**: Computer Science
- **Instructor**: Prof. Emily Watson (`inst-002`)
- **Students**:
  - Ali Yilmaz: 75 (B)
  - Mehmet Kaya: 40 (F)
  - Zeynep Şahin: 88 (A)

### DB301 - Database Management Systems
- **Department**: Software Engineering
- **Instructor**: Dr. Maria Garcia (`inst-004`)
- **Students**:
  - Ayşe Demir: 65 (C)
  - Fatma Özdemir: 92 (A)
  - Can Arslan: 44 (F)

## 📝 Resit Exams

### SE302 Resit Exam
- **Course**: Software Project Management
- **Instructor**: Dr. Youssef Atallah
- **Allowed Grades**: F, D
- **Enrolled Students**:
  - Ali Yilmaz (stu-001)
  - Mehmet Kaya (stu-003)

### CS101 Resit Exam
- **Course**: Introduction to Computer Science
- **Instructor**: Prof. Emily Watson
- **Allowed Grades**: F
- **Enrolled Students**:
  - Ayşe Demir (stu-002)

## 🔄 Re-seeding the Database

To reset and re-seed the database:

```bash
# Delete the database file
rm datastore/sql/uskudar.sqlite

# Run the seed script
npm run seed
```

Or simply run:
```bash
npm run seed
```

The seed script will automatically handle the database initialization.
