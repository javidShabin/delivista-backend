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

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});


// Enable CORS for deployed frontend
server.use(
  cors({
    origin: "https://delivista-customer-page.vercel.app", // Your Vercel frontend
    credentials: true, // Allow cookies & sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Optional: Allow headers
  })
);

// Other security and parsing middleware
server.use(cookieParser());
server.use(helmet());
server.use(express.json());
server.use(limiter);
// Use app routes under /app
server.use("/app", app);

// Root route
server.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Delivista!");
});

// Connect DB and start server
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
