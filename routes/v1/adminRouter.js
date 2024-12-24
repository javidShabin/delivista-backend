import express from "express"
import { registerAdmin } from "../../controllers/adminController.js";

const router = express.Router();

router.post("/sigup-admin", registerAdmin)

export const adminRouter = router