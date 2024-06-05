import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_default_jwt_secret";
const JWT_EXPIRES_IN = "7d";

interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin" | "seller";
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
