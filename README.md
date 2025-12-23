# 🏫 Kaksha - Web-based Classroom Platform (MERN Stack)

Kaksha is a **Google Classroom-like platform** built with the **MERN stack** (MongoDB, Express, React, Node.js).  
It provides a centralized space for teachers and students to manage classes, posts, assignments, submissions, materials, and comments, with **role-based access**, **real-time updates**, and **file uploads**.

---

## 🌟 Features

### Core Features
- ✅ **Authentication & Authorization**
  - Secure JWT-based login/register
  - Role-based access (`teacher`, `student`)
- ✅ **Classroom Management**
  - Create and join classrooms via unique codes
  - View classrooms created/joined
- ✅ **Posts / Announcements**
  - Teachers can post announcements
  - Students can view classroom stream
- ✅ **Comments**
  - Students & teachers can comment on posts
  - Support for threaded comments (replies)
  - Delete comment (owner or teacher)
- ✅ **Assignments**
  - Teachers can create assignments with deadlines
  - Students can view assignments
- ✅ **Submissions & Grading**
  - Students can submit assignment files
  - Teachers can grade submissions
- ✅ **Materials / Resources**
  - Upload and share files (PDF, Docs, PPT, Images, Audio)
  - Downloadable classroom resources
- ✅ **Realtime Updates**
  - Socket.io powered updates for posts, comments, assignments, and submissions
- ✅ **Notifications**
  - Notifications for new posts, comments, assignments, and grades

### Additional Features
- File uploads with **Cloudinary**
- Global error handling for invalid routes, invalid files, and server errors
- Structured MVC architecture for maintainable code
- Fully extendable for future features like quizzes, leaderboards, or live sessions

---

## ⚙️ Tech Stack

- **Frontend**: React (Vite) + Tailwind / Chakra UI  
- **Backend**: Node.js, Express  
- **Database**: MongoDB (Mongoose)  
- **Authentication**: JWT  
- **File Storage**: Cloudinary  
- **Realtime**: Socket.io  
- **Deployment**: Vercel (frontend), Render/Heroku (backend)  

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/kaksha.git
cd kaksha/backend
