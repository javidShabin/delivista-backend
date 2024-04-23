import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDb } from './src/configs/connectDb';

const app = express();
const PORT = 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Zippyzag!");
});

connectDb()
  .then(() => {
    console.log("Connected to MongoDB"); // First, connect to the database
    app.listen(PORT, () => {
      // Then, start the server
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
