import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  getAllCustomer,
  getUsererProfile,
  updateUsererProfile,
  
} from "./user.controller";

const router = express.Router();

router.get(
  "/users-list",
  authenticate,
  authorize("admin", "seller"),
  getAllCustomer
);

router.get(
  "/user-profile",
  authenticate,
  authorize("customer", "seller", "admin"),
  getUsererProfile
);

router.put(
  "/update-user-profile",
  authenticate,
  authorize("customer", "seller", "admin"),
  upload.single("avatar"),
  updateUsererProfile
);

export default router;
