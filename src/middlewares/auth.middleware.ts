import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "default_dev_secret";

interface TokenPayload {
  id: string;
  email: string;
  role: "customer" | "admin" | "seller";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  // Get token from Bearer header or cookie
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.userToken;

  if (!token) {
    return next(new AppError("Authentication token missing or invalid", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    // Optional: console.error(err);
    return next(new AppError("Invalid or expired token", 401));
  }
};
