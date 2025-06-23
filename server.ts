import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDb } from "./src/configs/connectDb";
import app from "./src/app";

const server = express();
const PORT = 5000; // Server listening port

// Rate limiter configuration: limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: "Too many requests from this IP, please try again later.",
});
server.use(limiter); // Apply rate limiting middleware globally

// Enable CORS for specific origins and restrict allowed HTTP methods
server.use(
 cors({
    origin:["https://delivista-customer-page-g86b.vercel.app"], // Only allow requests from this origin
    credentials: true,// Enable cookies & credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);


server.use(cookieParser()); // Parse cookies attached to client requests
server.use(helmet()); // Secure HTTP headers to protect against common vulnerabilities
server.use(express.json()); // Parse incoming JSON payloads into JavaScript objects

server.use("/app", app)

// Root route for server health check
server.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Delivista!");
});

// Connect to MongoDB, then start the Express server
connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
