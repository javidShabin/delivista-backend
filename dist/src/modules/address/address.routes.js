"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const address_controller_1 = require("./address.controller");
const router = express_1.default.Router();
router.post("/create-address", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.createAddress);
router.put("/update-address/:addressId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.updateAddress);
router.delete("/delete-address/:addressId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.deleteAddress);
router.put("/default-updating/:addressId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.setDefaultAddress);
router.get("/all-address", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.getAllAddresses);
router.get("/status-address", auth_middleware_1.authenticate, (0, authorize_1.authorize)("customer"), address_controller_1.getAddressByStatus);
exports.default = router;
