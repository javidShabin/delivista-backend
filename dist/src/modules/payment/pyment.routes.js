"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pyment_controller_1 = require("./pyment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post("/make-payment", auth_middleware_1.authenticate, (0, authorize_1.authorize)('customer'), pyment_controller_1.makePayment);
router.post("/verify-payment", auth_middleware_1.authenticate, (0, authorize_1.authorize)('customer'), pyment_controller_1.verifyPayment);
exports.default = router;
