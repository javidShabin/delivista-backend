import express from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";

import { restRouter } from "./modules/restaurant";
import { authRouter } from "./modules/authentication";
import { userRouter } from "./modules/user";
import { menuRouter } from "./modules/menu";
import { cartRouter } from "./modules/cart";
import { addressRouter } from "./modules/address";
import { wishlistRouter } from "./modules/wishlist";
import { pymentRouter } from "./modules/payment";

const app = express();

app.use("/authentication", authRouter);
app.use("/user", userRouter);
app.use("/restaurant", restRouter);
app.use("/menu", menuRouter)
app.use("/cart", cartRouter)
app.use("/address", addressRouter)
app.use("/wishlist", wishlistRouter)
app.use("/pyment", pymentRouter)

// Global error handler
app.use(globalErrorHandler);
export default app;
