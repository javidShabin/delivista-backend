import { Request, Response, NextFunction } from "express";

export const authorize =
  (...allowedRoles: ("customer" | "admin" | "seller")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
