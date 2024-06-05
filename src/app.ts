import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";
import api from "./modules/user";

const app = express();

app.use("/api",api)


// Global error handler
app.use(globalErrorHandler);
export default app;