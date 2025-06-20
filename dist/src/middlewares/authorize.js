"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const appError_1 = require("../utils/appError");
const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return next(new appError_1.AppError("Access forbidden: insufficient permissions", 403));
    }
    next();
};
exports.authorize = authorize;
