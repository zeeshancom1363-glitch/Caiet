# CAI&ET - Center for AI & Emerging Technologies Website

This is a complete, monolithic, locally-hosted full-stack web application designed for a modern academy.

## Tech Stack
*   **Database:** SQLite via Prisma ORM v5.22.0
*   **Backend:** Node.js, Express.js
*   **Storage:** Local via Multer (images uploaded to `backend/uploads`)
*   **Frontend:** React 18, Vite JS, Tailwind CSS
*   **Animations:** Framer Motion

## Features
1.  **Public Website**:
    *   Dynamic Home page, Animated UI.
    *   Course details and Student Admission portal.
    *   Service details, Blog posts, and Contact page.
2.  **Admin Panel**:
    *   Protected behind JWT Authentication.
    *   Dashboard with analytics and recent activity.
    *   Full CRUD control over Courses, Instructors, Students, Applications, Services, Blogs, FAQs, and Team Members.
    *   Control over site layouts via Singleton configuration forms (About section, Top Banner, Services page, generic site config).

## How to Run the Project (Local Development)

### 1. Backend Setup
1.  Navigate to `caiet-website/backend/`
2.  Install dependencies: `npm install`
3.  Configure your environment in `.env`.
    *   Typically you want `PORT=5000`
    *   The `DATABASE_URL` is already set to use SQLite `file:./dev.db`
4.  Run Prisma Setup & Seed:
    *   `npx prisma migrate dev --name init`
    *   `npm run seed` (Seeding is very important as it populates the default site settings and admin users. Check `prisma/seed.js` for default data)
5.  Start the backend server:
    *   `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1.  Navigate to `caiet-website/frontend/`
2.  Install dependencies: `npm install`
    *   Note: Ensure Vite is installed globally or rely on `npx vite`.
3.  Start the React frontend server:
    *   `npm run dev` (Runs on http://localhost:5173)

### Default Admin Credentials
*   **Email:** admin@caiet.com
*   **Password:** Admin@123

## Configuration Notes
The project is built specifically to operate without external cloud storage dependencies like AWS/Cloudinary, or container orchestration like Docker. Everything runs fully out of the local folder system.
