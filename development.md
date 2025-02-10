# Application Overview

Project Requirement Document

Project Title: Numerology Examination Web Application

1. Overview

The Numerology Examination Web Application is a web-based testing platform designed for students who have completed a numerology course. The platform enables students to take a test assessing their numerology knowledge without requiring login or data storage.

Upon test completion, students will receive a summary of their performance, and if they pass, a certificate will be generated and emailed to the course teacher/admin. Failed students can immediately retake the exam.

2. Application Components

The application consists of two main components:

Student Examination Interface – Where students take the test.

Admin Panel (Back Office) – Where administrators manage questions and test settings.

3. Detailed Feature Breakdown (Story Points)

3.1 Student Examination Flow

[x] Set up frontend structure for student examination interface using Nuxt 3.

[ ] Create a start page with instructions and a button to begin the exam.

[ ] Develop a question-fetching API to retrieve a predefined number of questions from Supabase.

[ ] Implement random question selection from the database.

[ ] Display one question at a time with multiple-choice options.

[ ] Implement next and previous navigation for answering questions.

[ ] Develop a submit button that finalizes answers and calculates the score.

[ ] Create a result page showing the number of correct and incorrect answers.

[ ] Implement Pass/Fail logic based on predefined scoring criteria.

[ ] Display detailed answer review for students (showing correct/incorrect responses).

[ ] Implement a retry button for failed students to retake the test immediately.

[ ] Ensure no login or data storage is required for examinees.

3.2 Admin Panel (Back Office)

[ ] Implement Supabase Auth for admin login.

[ ] Create an admin dashboard using Nuxt 3.

[ ] Develop CRUD operations for exam questions (create, read, update, delete).

[ ] Create a form interface for adding/editing questions.

[ ] Develop a database schema in Supabase for storing questions.

[ ] Implement pass/fail criteria settings in the admin panel.

[ ] Allow admins to set the number of questions per test dynamically.

[ ] Enable certificate template customization within the admin panel.

[ ] Develop an interface for email settings configuration.

[ ] Create an exam history log (optional) to store past exam results.

3.3 Email & Certificate Generation

[ ] Implement email sending logic using Supabase Functions or an external API.

[ ] Generate a PDF certificate using Puppeteer.

[ ] Design a certificate template with placeholders for student names and scores.

[ ] Store generated certificates in Supabase Storage.

[ ] Provide a certificate download link on the result page.

[ ] Ensure successful students' certificates are emailed to the teacher/admin.

4. Tech Stack

Feature

Technology

Frontend

Nuxt 3 (Vue.js 3)

State Management

Pinia

Backend

Nuxt 3 Server API

Database

Supabase (PostgreSQL)

ORM

Prisma

Authentication

Supabase Auth (Admin Panel Only)

File Storage (Certificates)

Supabase Storage

PDF Generation

Puppeteer

Email Sending

Supabase Functions / External API

Deployment (Frontend)

Netlify

Deployment (Backend)

Supabase

5. Development Considerations

5.1 Frontend UI/UX

[ ] Design a clean and intuitive interface for students.

[ ] Ensure a smooth exam flow with clear instructions.

5.2 Responsive Design

[ ] Make sure the application works seamlessly on desktop, tablet, and mobile devices.

5.3 Security

[ ] Secure admin panel access using Supabase Auth.

[ ] Protect exam question data stored in Supabase.

5.4 Performance Optimization

[ ] Optimize fast page loads using Nuxt’s rendering capabilities.

[ ] Implement real-time updates for seamless test-taking experience.

6. Deliverables

[ ] Fully functional examination platform deployed on Netlify.

[ ] Admin panel for managing test settings and questions.

[ ] Automated email system for successful candidates.

[ ] Certificate generation system using Puppeteer.

[ ] Comprehensive documentation for managing and deploying the application.

7. Additional Considerations

[ ] Scalability: Ensure the system allows easy expansion for more courses.

[ ] Customizable Test Settings: Admins can set different passing thresholds and question limits.

[ ] Future Enhancements: Add tracking for student attempts, more question types, and real-time analytics.

This breakdown provides a detailed, step-by-step development roadmap for the Numerology Examination Web Application, ensuring a smooth implementation process.

## Recommended file structure:

```bash
📂 numerology-certification-app
│── 📂 public                # Static assets (e.g., logos, favicons)
│── 📂 assets                # Styles, images, global SCSS
│── 📂 components            # Reusable Vue components
│   ├── 📂 ui                # Buttons, Inputs, Modals, Loaders
│   ├── 📂 auth              # Login, Register, Forgot Password
│   ├── 📂 test              # QuestionDisplay, Timer, TestResult
│   ├── 📂 admin             # Admin Dashboard, CRUD Forms
│── 📂 composables           # Custom hooks (useAuth, useTimer, useTest)
│── 📂 layouts               # Default, Auth, Admin Layouts
│── 📂 middleware            # AuthGuard, AdminGuard
│── 📂 pages                 # Page views
│   ├── 📂 auth              # Login, Register, Reset Password
│   ├── 📂 student           # Dashboard, Test Start, Results
│   ├── 📂 admin             # Admin Dashboard, Manage Questions, Analytics
│── 📂 plugins               # Third-party integrations (e.g., Supabase)
│── 📂 server                # API routes (Nuxt 3 Server API)
│   ├── 📂 auth              # Auth API (sign up, login, reset password)
│   ├── 📂 tests             # Test generation, submission, grading
│   ├── 📂 admin             # Admin API (CRUD operations)
│── 📂 store                 # Pinia stores (auth, test, admin)
│── 📂 types                 # TypeScript interfaces
│── 📂 utils                 # Helper functions (PDF generation, email notifications)
│── nuxt.config.ts           # Nuxt configuration
│── package.json             # Dependencies
│── tsconfig.json            # TypeScript configuration
│── .env                     # Environment variables
```
