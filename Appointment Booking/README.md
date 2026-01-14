# Appointment Booking System

A full-stack web application for booking and managing doctor appointments, featuring separate user and admin portals.

## Features

- **User Portal (Frontend)**
  - Browse doctors by specialty
  - Book, view, and manage appointments
  - User authentication and profile management
  - Responsive UI built with React, Vite, and Tailwind CSS

- **Admin Panel**
  - Secure admin login
  - Dashboard for managing doctors, patients, and appointments
  - Add/edit/delete doctors and view all appointments
  - Built with React, Vite, and Tailwind CSS

- **Backend API**
  - Node.js, Express.js, and MongoDB (Mongoose)
  - RESTful API for users, doctors, and appointments
  - JWT authentication for users and admins
  - Role-based access control
  - File uploads with Multer and Cloudinary

## Project Structure

```
admin/      # Admin dashboard (React)
backend/    # API server (Node.js, Express, MongoDB)
frontend/   # User portal (React)
```

## Tech Stack

- **Frontend & Admin**: React, Vite, Tailwind CSS, Context API
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, role-based middleware
- **File Uploads**: Multer, Cloudinary
- **Other Tools**: ESLint, PostCSS, Git

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB instance

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/MarcuSS002/Appointment-Booking.git
   cd Appointment-Booking
   ```

2. **Install dependencies:**
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   cd ../admin && npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the `backend/` and `admin/` folders and fill in the required values.

4. **Start the backend server:**
   ```sh
   cd backend
   npm start
   ```

5. **Start the frontend and admin apps (in separate terminals):**
   ```sh
   cd frontend
   npm run dev
   
   cd ../admin
   npm run dev
   ```

## License

This project is for educational and demonstration purposes.
