import express from "express";
import { signupUser, verifyOtpAndCreateUser } from "./user.controller";
const api = express();

// User signup
api.post("/user-signup", signupUser)
api.post("/verify-token", verifyOtpAndCreateUser)

export default api;