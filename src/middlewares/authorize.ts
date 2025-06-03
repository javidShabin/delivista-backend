import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const authorize =
  (...allowedRoles: ("customer" | "admin" | "seller")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access forbidden: insufficient permissions", 403)
      );
    }
    next();
  };
