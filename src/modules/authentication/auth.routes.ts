import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { singupUser } from "./auth.controller";

const router = express.Router();

router.post("/user-signup", singupUser)

export default router;
