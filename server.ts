import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDb } from "./src/configs/connectDb";

const app = express();
const PORT = 5000; // Server listening port

// Rate limiter configuration: limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter); // Apply rate limiting middleware globally

// Enable CORS for specific origins and restrict allowed HTTP methods
app.use(
  cors({
    origin: true, // Only allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

app.use(cookieParser()); // Parse cookies attached to client requests
app.use(helmet()); // Secure HTTP headers to protect against common vulnerabilities
app.use(express.json()); // Parse incoming JSON payloads into JavaScript objects

// Root route for server health check
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Zippyzag!");
});

// Connect to MongoDB, then start the Express server
connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
