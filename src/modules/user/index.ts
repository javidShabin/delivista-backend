import express from "express";
import { signupUser } from "./user.controller";
const api = express();

// User signup
api.post("/user-signup", signupUser)

export default api;