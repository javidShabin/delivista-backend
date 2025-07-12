"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const multer_1 = require("../../middlewares/multer");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/users-list", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "seller"), user_controller_1.getAllCustomer);
router.get("/customer-profile", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), user_controller_1.getCustomerProfile);
router.put("/update-customer-profile", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), multer_1.upload.single("avatar"), user_controller_1.updateCustomerProfile);
exports.default = router;
