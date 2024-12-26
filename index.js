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

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env if available

// Connect to the database
connectDb();

// Create HTTP server with Express
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = new Server(server);

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

  // Handle message from client
  socket.on("send_message", (message) => {
    console.log("Received message:", message);
    // Broadcast the message to all connected clients
    io.emit("receive_message", message);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
