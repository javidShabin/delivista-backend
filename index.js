import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from 'helmet';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import { apiRouter } from "./routes/index.js";



const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env if available

connectDb()

// Middleware
app.use(helmet())
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Api router
app.use("/api",apiRouter)

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});



// Start the server
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
