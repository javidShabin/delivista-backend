import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression"; // Import compression
import { connectDb } from "./config/db.js";
import { apiRouter } from "./routes/index.js";

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env if available

connectDb();

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

// Api router
app.use("/api", apiRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
