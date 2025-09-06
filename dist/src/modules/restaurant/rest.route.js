"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const multer_1 = require("../../middlewares/multer");
const rest_controller_1 = require("./rest.controller");
const router = express_1.default.Router();
// Create restaurant for seller
router.post("/create-restaurant", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), multer_1.upload.single("image"), rest_controller_1.createRestaurant);
// Get all restaurant list
router.get("/get-all-restaurants", rest_controller_1.getAllRestaurants);
// Get admin verified restaurant list
router.get("/verified-restaurants", rest_controller_1.getVerifiedRestaurants);
// Admin restaurant verification
router.patch("/verification-restaurant/:restaurantId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin"), rest_controller_1.adminVerifyingRestaurant);
// Get restaurant by id
router.get("/restaurant-byId/:restaurantId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer", "seller"), rest_controller_1.getRestaurant);
// Get restaurant by seller
router.get("/get-restaurant-sellerId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), rest_controller_1.getRestaurantBySeller);
// Toggle restaurant status (Open and Close)
router.patch("/restaurant-toggle", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), rest_controller_1.toggleRestaurantStatus);
// Update restaurant by id
router.put("/update-restaurant/:restaurantId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), multer_1.upload.single("image"), rest_controller_1.updateRestaurant);
// Remove restauratn
router.delete("/remove-restaurant/:restaurantId", rest_controller_1.deleteRestaurant);
exports.default = router;
