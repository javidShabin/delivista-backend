import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { getAllCustomer } from "./user.controller";

const router = express.Router();

router.get(
  "/users-list",
  authenticate,
  authorize("admin", "seller"),
  getAllCustomer
);

export default router;
