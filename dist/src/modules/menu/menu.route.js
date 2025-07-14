"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_1 = require("../../middlewares/authorize");
const multer_1 = require("../../middlewares/multer");
const menu_controller_1 = require("./menu.controller");
const router = express_1.default.Router();
router.post("/create-menu", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), multer_1.upload.single("image"), menu_controller_1.createMenu);
router.put("/update-menu/:id", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), multer_1.upload.single("image"), menu_controller_1.updateMenu);
router.delete("/remove-menu/:id", auth_middleware_1.authenticate, (0, authorize_1.authorize)("seller"), menu_controller_1.deleteMenu);
router.get("/get-all-menus/:restaurantId", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer"), menu_controller_1.getMenusByRestaurant);
router.get("/get-menu-by-catagory/:category", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer"), menu_controller_1.getMenusByCategory);
router.get("/menu-by-tag", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer"), menu_controller_1.getMenusByTag);
router.get("/search-menu", auth_middleware_1.authenticate, (0, authorize_1.authorize)("admin", "customer"), menu_controller_1.searchMenus);
exports.default = router;
