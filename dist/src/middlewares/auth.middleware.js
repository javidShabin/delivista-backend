"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const JWT_SECRET = process.env.JWT_SECRET_KEY || "default_dev_secret";
const authenticate = (req, res, next) => {
    var _a;
    const authHeader = req.headers.authorization;
    // Get token from Bearer header or cookie
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.userToken;
    if (!token) {
        return next(new appError_1.AppError("Authentication token missing or invalid", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        // Optional: console.error(err);
        return next(new appError_1.AppError("Invalid or expired token", 401));
    }
};
exports.authenticate = authenticate;
