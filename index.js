import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";



const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env if available

connectDb()

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());



// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});



// Start the server
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
