"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/user-signup", auth_controller_1.singupUser);
router.post("/verify-user-otp", auth_controller_1.verifyOtpandCreateUser);
router.post("/user-login", auth_controller_1.loginUser);
router.get("/verify-auth", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer", "seller"), auth_controller_1.checkUser);
router.delete("/user-logout", auth_controller_1.logoutUser);
router.post("/forgot-password", auth_controller_1.sendForgotPasswordOtp);
router.patch("/update-password", auth_controller_1.verifyOtpAndUpdatePassword);
exports.default = router;
