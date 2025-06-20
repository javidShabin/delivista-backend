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
const app = (0, express_1.default)();
app.use("/authentication", authentication_1.authRouter);
app.use("/user", user_1.userRouter);
app.use("/restaurant", restaurant_1.restRouter);
// Global error handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
