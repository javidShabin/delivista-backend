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
exports.searchMenus = exports.getNonVegMenus = exports.getVegMenus = exports.getRecommendedMenus = exports.getMenusByAvailability = exports.getMenusByTag = exports.getMenusByCategory = exports.getMenusByRestaurant = exports.deleteMenu = exports.updateMenu = exports.createMenu = void 0;
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
// Update menu
const updateMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Destructure fields from request body
        const { productName, description, category, price, isVeg, isAvailable, isRecommended, tags, } = req.body;
        // Check if the menu item exists
        const existingMenu = yield menu_model_1.default.findById(id);
        if (!existingMenu) {
            return next(new appError_1.AppError("Menu item not found", 404));
        }
        // Handle image update if a file is uploaded
        let updatedImage = existingMenu.image;
        if (req.file) {
            const uploadResult = yield (0, upload_file_1.handleImageUpload)(req.file);
            updatedImage = uploadResult;
        }
        // Prepare updated data
        const updatedData = {
            productName,
            description,
            category,
            price,
            isVeg,
            isAvailable,
            isRecommended,
            tags,
            image: updatedImage,
        };
        // Update menu
        const updatedMenu = yield menu_model_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: updatedMenu,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateMenu = updateMenu;
// Delete a menu item by its id
const deleteMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get menu id from request parameters
        const { id } = req.params;
        // Check if the menu item exists in the database
        const menuItem = yield menu_model_1.default.findById(id);
        if (!menuItem) {
            return next(new appError_1.AppError("Menu item not found", 404));
        }
        // If found, delete the menu item
        yield menu_model_1.default.findByIdAndDelete(id);
        // Send success response
        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });
    }
    catch (error) {
        // Forward error to global error handler
        next(error);
    }
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
// ************Filtering functions for menus**********************
// getMenusByCategory
const getMenusByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructer the category and restaurant id from params and query
        const { category } = req.params;
        const { restaurantId } = req.query;
        // Set the pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        // Check the category and restaurant id is present or not
        if (!category || !restaurantId) {
            throw new appError_1.AppError("RestaurantId or category is required", 404);
        }
        // Find the menu by category and restaurant id, then make pagination
        // Find paginated menus
        const menus = yield menu_model_1.default
            .find({ category, restaurantId })
            .skip(skip)
            .limit(limit);
        const totalMenus = yield menu_model_1.default.countDocuments({
            category,
            restaurantId,
        });
        if (!menus || menus.length === 0) {
            res.status(404).json({
                success: false,
                message: "No menus found for this category and restaurant.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            count: menus.length,
            currentPage: page,
            totalPages: Math.ceil(totalMenus / limit),
            data: menus,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMenusByCategory = getMenusByCategory;
// getMenusByTag
const getMenusByTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const { restaurantId, tag } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        // Check if required parameters are present
        if (!restaurantId || !tag) {
            return next(new appError_1.AppError("restaurantId and tag are required", 400));
        }
        // Find menu items that match the tag under the given restaurant
        const menus = yield menu_model_1.default
            .find({
            restaurantId,
            tags: tag, // exact match within the tags array
        })
            .skip(skip)
            .limit(limit);
        // Count total matching items for pagination
        const totalMenus = yield menu_model_1.default.countDocuments({
            restaurantId,
            tags: tag,
        });
        const totalPages = Math.ceil(totalMenus / limit);
        // Send the response
        res.status(200).json({
            success: true,
            totalMenus,
            totalPages,
            currentPage: page,
            data: menus,
        });
    }
    catch (error) {
        next(error);
    }
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
        // Get restaurant id and keyword
        const { restaurantId, keyword } = req.query;
        // Set page code
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        // Check the restaurant id and keyword (search word) is present or not
        if (!restaurantId || !keyword) {
            throw new appError_1.AppError("RestaurantId and keyword are required", 400);
        }
        // Regular expression
        const searchRegex = new RegExp(keyword, "i");
        // regular MongoDB query filter using the query language
        const filter = {
            restaurantId,
            $or: [
                { productName: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
            ],
        };
        // Count and find the menu items by keywords from request
        const total = yield menu_model_1.default.countDocuments(filter);
        const results = yield menu_model_1.default.find(filter).skip(skip).limit(limit);
        res.status(200).json({
            // send the response
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchMenus = searchMenus;
