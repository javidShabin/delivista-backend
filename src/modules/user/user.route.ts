import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  getAllCustomer,
  getCustomerProfile,
  updateCustomerProfile,
} from "./user.controller";

const router = express.Router();

router.get(
  "/users-list",
  authenticate,
  authorize("admin", "seller"),
  getAllCustomer
);

router.get(
  "/customer-profile",
  authenticate,
  authorize("customer"),
  getCustomerProfile
);

router.put(
  "/update-customer-profile",
  authenticate,
  authorize("customer"),
  upload.single("avatar"),
  updateCustomerProfile
);

export default router;
