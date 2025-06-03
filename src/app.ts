import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./modules/user";

const app = express();

app.use("/api", userRouter);

// Global error handler
app.use(globalErrorHandler);
export default app;
