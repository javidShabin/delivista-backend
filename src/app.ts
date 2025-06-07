import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./modules/user";
import { adminRouter } from "./modules/admin";
import { sellerRouter } from "./modules/seller";

const app = express();

app.use("/user", userRouter);
app.use("/admin", adminRouter)
app.use("/seller", sellerRouter)

// Global error handler
app.use(globalErrorHandler);
export default app;
