import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import { connectDb } from './src/configs/connectDb';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Weclo"Welcome to Delivista!"');
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