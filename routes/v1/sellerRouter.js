import express from "express"
import { loginSeller, registerSeller } from "../../controllers/sellerController.js"

const router = express.Router()

router.post("/sign-up", registerSeller)
router.post("/log-in", loginSeller)

export const sellerRouter = router