import express from "express";
import {  loginUser, signupUser, verifyOtpAndCreateUser } from "./user.controller";
const api = express();

// User signup
api.post("/user-signup", signupUser)
// User OTP verification
api.post("/verify-token", verifyOtpAndCreateUser)
// User login
api.post("/user-login", loginUser)


export default api;