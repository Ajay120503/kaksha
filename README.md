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
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables
- **Create a** .env **file in backend**:
```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
### 4. Run the Backend
```bash
npm run dev
```
---

- **File Uploads**

- Allowed file types: images (jpeg, png, jpg), audio (mp3), PDF, DOC, PPT
- Max file size: 10MB
- Uploaded to Cloudinary

---

- **Real-Time Updates (Socket.io)**
- joinClass → Join classroom room
- newPost → Refresh posts in classroom
- commentAdded → Refresh comments on a post
- assignmentAdded → Refresh assignments in classroom
- submissionAdded → Refresh submissions for assignments
  
---

- **🔧 Folder Structure (Backend)**
```bash
backend
├── package.json
├── package-lock.json
├── README.md
├── routeTesting.text
├── server.js
└── src
    ├── app.js
    ├── config
    │   ├── cloudinary.js
    │   └── db.js
    ├── controllers
    │   ├── assignmentController.js
    │   ├── authController.js
    │   ├── classroomController.js
    │   ├── commentController.js
    │   ├── materialController.js
    │   ├── postController.js
    │   ├── submissionController.js
    │   └── uploadController.js
    ├── middleware
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    ├── models
    │   ├── Assignment.js
    │   ├── Classroom.js
    │   ├── Comment.js
    │   ├── Material.js
    │   ├── Notification.js
    │   ├── Post.js
    │   ├── Submission.js
    │   └── User.js
    ├── routes
    │   ├── assignmentRoutes.js
    │   ├── authRoutes.js
    │   ├── classroomRoutes.js
    │   ├── commentRoutes.js
    │   ├── materialRoutes.js
    │   ├── notificationRoutes.js
    │   ├── postRoutes.js
    │   ├── submissionRoutes.js
    │   └── uploadRoutes.js
    └── utils
        ├── generateCode.js
        ├── sendNotification.js
        └── upload.js
```
---

### **Routes**
```bash
POST http://localhost:5001/api/auth/register

Authorization: Bearer <token> 
Content-Type: application/json

POST http://localhost:5001/api/auth/login
GET  http://localhost:5001/api/auth/me

// register

{ 
    "name": "Ajay Kandhare", 
    "email": "ajaykandhare12@gmail.com", 
    "password": "ajay@#1205", 
    "role": "student" 
}

// login

{ 
    "email": "ajaykandhare12@gmail.com", 
    "password": "ajay@#1205"
 }

// me

{}


POST http://localhost:5001/api/classroom/create
POST http://localhost:5001/api/classroom/join
GET  http://localhost:5001/api/classroom/my

// classroom/create

 { 
    "name": "MSC.CA", 
    "description": "Computer Application" 
 }

// classroom/join

 { 
    "code": "Z8SHBD" 
 }


POST http://localhost:5001/api/posts/class/:classId
GET  http://localhost:5001/api/posts/class/:classId

// posts/class/:classId

{ 
     "classId": "694ac4e505dc962832fa6bfb", 
     "text": "Welcome to class!" 
 }


POST http://localhost:5001/api/comments/add
GET  http://localhost:5001/api/comments/:postId
DELETE http://localhost:5001/api/comments/:id

// comments/add

{ 
     "postId": "694ac4e505dc962832fa6bfb", 
     "text": "Great post!"
    // "parentComment" : "Hi Ajay"
}

// delete 

{}


POST http://localhost:5001/api/assignments/create
GET  http://localhost:5001/api/assignments/:id

POST http://localhost:5001/api/submissions/submit
PUT  http://localhost:5001/api/submissions/grade/:id

POST http://localhost:5001/api/materials/upload
GET  http://localhost:5001/api/materials/:id
```
---

- **📌 Author**

- Ajay Ganesh Kandhare
- Email: ajaykandhare12@gmail.com

---
