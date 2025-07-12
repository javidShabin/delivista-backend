import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";

import { restRouter } from "./modules/restaurant";
import { authRouter } from "./modules/authentication";
import { userRouter } from "./modules/user";
import { menuRouter } from "./modules/menu";

const app = express();

app.use("/authentication", authRouter);
app.use("/user", userRouter);
app.use("/restaurant", restRouter);
app.use("/menu", menuRouter)

// Global error handler
app.use(globalErrorHandler);
export default app;
