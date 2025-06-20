import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { getAllCustomer, getCustomerProfile } from "./user.controller";

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

export default router;
