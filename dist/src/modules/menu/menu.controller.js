"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMenus = exports.getNonVegMenus = exports.getVegMenus = exports.getRecommendedMenus = exports.getMenusByAvailability = exports.getMenusByTag = exports.getMenusByPriceRange = exports.getMenusByCategory = exports.getMenusBySeller = exports.getMenusByRestaurant = exports.deleteMenu = exports.updateMenu = exports.createMenu = void 0;
const menu_model_1 = __importDefault(require("./menu.model"));
const appError_1 = require("../../utils/appError");
const menu_validation_1 = require("./menu.validation");
const rest_model_1 = __importDefault(require("../restaurant/rest.model"));
const upload_file_1 = require("../../shared/cloudinary/upload.file");
// *************Main Menu CRUD Operations********************
// Create a new menu item
const createMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the details first
        (0, menu_validation_1.validateMenuCreation)(req.body);
        // Destructure the menu details from request body after validation
        const { productName, description, category, price, restaurantId, sellerId, isVeg, tags, } = req.body;
        // Check the same item already exists in the menu collection
        const isMenuItemExist = yield menu_model_1.default.findOne({
            productName,
            restaurantId,
        });
        if (isMenuItemExist) {
            return next(new appError_1.AppError("The item already exists", 400));
        }
        // Check the restarant is verified
        const isVerifiedRestaurant = yield rest_model_1.default.findById(restaurantId);
        if (!isVerifiedRestaurant) {
            return next(new appError_1.AppError("Restaurant not verified", 400));
        }
        let menuImage;
        // If any file is uploaded, handle the image upload and get the file path
        if (req.file) {
            const uploadImage = yield (0, upload_file_1.handleImageUpload)(req.file);
            menuImage = uploadImage;
        }
        // Create new menu item
        const newMenuItem = yield menu_model_1.default.create({
            productName,
            description,
            category,
            price,
            image: menuImage,
            sellerId,
            restaurantId,
            isVeg,
            tags,
        });
        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: newMenuItem,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createMenu = createMenu;
// updateMenu
const updateMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.updateMenu = updateMenu;
// deleteMenu
const deleteMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.deleteMenu = deleteMenu;
// ************Get menus by association**********************
// getMenusByRestaurant
// Get menus by pagination
const getMenusByRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        if (!restaurantId) {
            throw new appError_1.AppError("Restaurant not found", 400);
        }
        const skip = (page - 1) * limit;
        const [menus, total] = yield Promise.all([
            menu_model_1.default.find({ restaurantId }).skip(skip).limit(limit),
            menu_model_1.default.countDocuments({ restaurantId }),
        ]);
        res.status(200).json({
            success: true,
            message: "Menus fetched successfully",
            menus,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMenusByRestaurant = getMenusByRestaurant;
// getMenusBySeller
const getMenusBySeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getMenusBySeller = getMenusBySeller;
// ************Filtering functions for menus**********************
// getMenusByCategory
const getMenusByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getMenusByCategory = getMenusByCategory;
// getMenusByPriceRange
const getMenusByPriceRange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getMenusByPriceRange = getMenusByPriceRange;
// getMenusByTag
const getMenusByTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getMenusByTag = getMenusByTag;
// getMenusByAvailability
const getMenusByAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getMenusByAvailability = getMenusByAvailability;
// getRecommendedMenus
const getRecommendedMenus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getRecommendedMenus = getRecommendedMenus;
// getVegMenus
const getVegMenus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getVegMenus = getVegMenus;
// getNonVegMenus
const getNonVegMenus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getNonVegMenus = getNonVegMenus;
// get menus by search
const searchMenus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.searchMenus = searchMenus;
