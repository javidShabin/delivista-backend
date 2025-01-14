import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { createAddress, deleteAddress, getAddressByStatus, getAllAddresses, setDefaultAddress, updateAddress } from "./address.controller";

const router = express.Router()

router.post("/create-address", authenticate, authorize("customer"), createAddress)
router.put("/update-address/:addressId", authenticate, authorize("customer"), updateAddress)
router.delete("/delete-address/:addressId", authenticate,authorize("customer"), deleteAddress)
router.put("/default-updating/:addressId", authenticate, authorize("customer"), setDefaultAddress)
router.get("/all-address", authenticate, authorize("customer"), getAllAddresses)
router.get("/status-address", authenticate, authorize("customer"), getAddressByStatus)

export default router;
