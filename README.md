# BRL Chat Application

A simple real-time chat application developed as part of the BRL internship Task 3.

## Features

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- View registered users
- Create conversations
- Send and receive messages
- Real-time messaging using Socket.IO
- Previous messages stored in MongoDB
- Protected API routes
- Basic authorization
- MongoDB Atlas database

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- CORS

### Frontend
- React
- Vite
- Socket.IO Client

## Project Structure

```text
BRL-Chat-Application/
│
├── models/
│   ├── user.js
│   ├── conversation.js
│   └── message.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── conversationRoutes.js
│   └── messageRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── chat-frontend/
│
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md