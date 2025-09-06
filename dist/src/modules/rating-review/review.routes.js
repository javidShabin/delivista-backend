"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/restaurant-review", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), review_controller_1.ratingRestaurant);
exports.default = router;
