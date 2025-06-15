# Resit Exam Management System

> ⚠ **Note:** This is an academic project developed for coursework purposes and not intended for production use.


> 📚 **This project is an academic submission for the Software Project Management course (SE302/1) at Üsküdar University.**

The **Resit Exam Management System** is a web-based platform designed to streamline and digitize the resit exam process at **Üsküdar University**. Built with a focus on **usability**, **scalability**, and **role-based access control**, the system supports three user types: **Students**, **Instructors**, and **Faculty Secretaries**, each with tailored features to manage their responsibilities effectively.

## 👥 User Roles & Functionalities

### 🎓 Students

Students can:

* View their grades and see which courses they are eligible to retake based on instructor-defined grade letters (e.g., DD, FF, CC).
* Apply for resit exams and receive confirmation.
* Cancel resit exam applications **before the cancellation deadline**.
* View **instructor announcements or messages** related to resit exams.
* Track the status of their applications in real time.

### 👨‍🏫 Instructors

Instructors can:

* Upload student grades (final/resit) via Excel files.
* Create resit exams for each course and define eligible grade letters.
* Download student application lists in **PDF or Excel** format.
* Send **announcements** for resit exams to inform students of updates or instructions.
* Monitor and manage student applications for their resit exams.

### 🗂️ Faculty Secretaries

Faculty Secretaries can:

* Create, edit, or delete student and instructor accounts.
* Enroll or unenroll students and instructors in courses.
* Schedule **resit exam dates and locations**.
* Oversee and coordinate resit exam processes across departments in line with academic policies.

## ✅ Key Features

* Secure **role-based login** system.
* Real-time eligibility checking based on instructor settings.
* Excel-based bulk grade uploads.
* PDF/Excel export for student application lists.
* Integrated announcements from instructors to students.
* Full admin control over users and course assignments.
-------------------------------------------
# ⚠ Disclaimer
This project was developed solely for academic purposes as part of the Software Project Management (SE302/1) course at Üsküdar University.
Important notes:

The system was not designed, tested, or reviewed for production-level security, performance, or compliance requirements.

It should not be used in any real-world or production environment without significant further development and security hardening.

The primary goal was to demonstrate project planning, team collaboration, and backend functionality for educational evaluation.
-------------------
# 🚀 Getting Started

This guide will help you set up and run the Resit Exam Management System locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 
- **npm** (usually comes with Node.js)
- **PostgreSQL** 



## 🚀 Running the Application

1. **Start the Backend Server**
```bash
cd server
npm start
```



## 📝 Default Accounts

The system comes with default test accounts:

- **Admin/Faculty Secretary**:
  - secretary id: ---
  - Password: ----

- **Instructor**:
  - instructor id: 12345611
  - Password: pass123ff

- **Student**:
  - student id: 20209958
  - Password: pass123Y2Uskudar!#@123

## 📚 Additional Resources

- [API Documentation](docs/api.md) | notion link: https://imaginary-methane-624.notion.site/API-Documentation-2137cfc12eeb80a7bce6dc7b96f0b3a9


- [Database Schema](docs/ERD.md)


