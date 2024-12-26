import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; // Import compression
import { connectDb } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import http from "http";
import { Server } from "socket.io"; // Correct named import for socket.io
import { storeMessage, storeReply } from "./controllers/chatController.js"; // Import chat controller

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env if available

// Connect to the database
connectDb();

// Create HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = new Server(server);

let users = {}; // Store connected users and their socket IDs

// Middleware
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
    level: 6, // Compression level (1-9)
  })
);

// API router
app.use("/api", apiRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Register the user
  socket.on("register_user", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  // Handle message from user
  socket.on("send_message", async (data) => {
    const { userId, message } = data;
    console.log(`Message from user ${userId}: ${message}`);

    // Store the message in the database
    await storeMessage(userId, message);

    // Send message to admin (or all admins)
    if (users["adminSocketId"]) {
      // Replace with actual admin socket ID
      io.to(users["adminSocketId"]).emit("receive_message", {
        userId,
        message,
      });
    }
  });

  // Handle reply from admin
  socket.on("send_reply", async (data) => {
    const { userId, replyMessage } = data;
    console.log(`Reply from admin to user ${userId}: ${replyMessage}`);

    // Store the reply in the database
    await storeReply(userId, replyMessage, "adminId"); // Replace "adminId" with the actual admin ID

    // Send reply to the user
    if (users[userId]) {
      io.to(users[userId]).emit("receive_reply", { replyMessage });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Remove user from the users object
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
