import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./modules/user";
import { adminRouter } from "./modules/admin";
import { sellerRouter } from "./modules/seller";
import { restRouter } from "./modules/restaurant";

const app = express();

app.use("/user", userRouter);
app.use("/admin", adminRouter)
app.use("/seller", sellerRouter)
app.use("/restaurant", restRouter)

// Global error handler
app.use(globalErrorHandler);
export default app;
