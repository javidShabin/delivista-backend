import express from "express"
import { creatRestaurant } from "../../controllers/restaurantController.js"
import { sellerAuth } from "../../middlewares/sellerAuth.js"
const router = express.Router()

router.post("/creat-restaurant", sellerAuth, creatRestaurant)

export const restaurantRouter = router