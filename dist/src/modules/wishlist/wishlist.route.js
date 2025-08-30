"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const wishlist_controller_1 = require("./wishlist.controller");
const router = express_1.default.Router();
// Add item to wishlist
router.post("/add", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), wishlist_controller_1.addToWishlist);
// Get all list of wishlist
router.get("/get-list", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), wishlist_controller_1.getFavListbyUserId);
// Remove item from wishlist
router.delete("/remove", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), wishlist_controller_1.removeFavItem);
// Clear all list form wishlist
router.delete("/clear-all", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), wishlist_controller_1.clearAllItems);
exports.default = router;
