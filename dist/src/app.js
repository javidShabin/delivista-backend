"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const restaurant_1 = require("./modules/restaurant");
const authentication_1 = require("./modules/authentication");
const user_1 = require("./modules/user");
const menu_1 = require("./modules/menu");
const cart_1 = require("./modules/cart");
const address_1 = require("./modules/address");
const wishlist_1 = require("./modules/wishlist");
const payment_1 = require("./modules/payment");
const app = (0, express_1.default)();
app.use("/authentication", authentication_1.authRouter);
app.use("/user", user_1.userRouter);
app.use("/restaurant", restaurant_1.restRouter);
app.use("/menu", menu_1.menuRouter);
app.use("/cart", cart_1.cartRouter);
app.use("/address", address_1.addressRouter);
app.use("/wishlist", wishlist_1.wishlistRouter);
app.use("/pyment", payment_1.pymentRouter);
// Global error handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
