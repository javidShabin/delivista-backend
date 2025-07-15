"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
router.post("/add-cart", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), cart_controller_1.addToCart);
exports.default = router;
