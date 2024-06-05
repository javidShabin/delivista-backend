import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();



// Global error handler
app.use(globalErrorHandler);
export default app;