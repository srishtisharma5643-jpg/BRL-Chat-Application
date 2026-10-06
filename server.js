const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// HTTP server
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "https://brl-chat-application-1.onrender.com",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("BRL Chat Backend is running");
});

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log("Joined conversation:", conversationId);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.conversationId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});