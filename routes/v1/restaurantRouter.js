import express from "express"
import { sellerAuth } from "../../middlewares/sellerAuth.js"
import { upload } from "../../middlewares/multer.js"
import { createRestaurant } from "../../controllers/restaurantController.js"
const router = express.Router()

router.post("/creat-restaurant", upload.single("image"), sellerAuth, createRestaurant)

export const restaurantRouter = router