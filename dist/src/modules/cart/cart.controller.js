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
exports.getCartBySellerId = exports.getCartByUserId = exports.deleteFromCart = exports.updateCart = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("./cart.model"));
const appError_1 = require("../../utils/appError");
const cart_validation_1 = require("./cart.validation");
// *************Main Cart CRUD Operations********************
// Add item to the cart
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure customerId comes from the authenticated user
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Force the customerId to match the authenticated user to keep cart retrieval consistent
        req.body.customerId = userId;
        // Validate the data from request body
        (0, cart_validation_1.validateCartCreation)(req.body);
        // Destructure data from request body
        const { sellerId, customerId, restaurantId, items } = req.body;
        // Validate all items contain menuId
        for (const item of items) {
            if (!item.menuId) {
                return next(new appError_1.AppError("Each item must include a valid menuId", 400));
            }
        }
        // Extract menuIds safely
        const incomingMenuIds = items
            .filter((item) => item.menuId)
            .map((item) => item.menuId.toString());
        // Find existing cart
        const existingCart = yield cart_model_1.default.findOne({
            sellerId,
            customerId,
            restaurantId,
        });
        if (existingCart) {
            const existingMenuIds = existingCart.items
                .filter((item) => item.menuId)
                .map((item) => item.menuId.toString());
            const duplicateIds = incomingMenuIds.filter((id) => existingMenuIds.includes(id));
            if (duplicateIds.length > 0) {
                res.status(400).json({
                    status: "error",
                    message: "One or more menu items already exist in the cart",
                });
                return;
            }
            // No duplicates — add new items
            existingCart.items.push(...items);
            // Update total price
            existingCart.totalPrice += items.reduce((total, item) => total + item.price * item.quantity, 0);
            const updatedCart = yield existingCart.save();
            res.status(200).json({
                message: "Items added to existing cart",
                cart: updatedCart,
            });
            return;
        }
        // No existing cart — create new
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const newCart = yield cart_model_1.default.create({
            sellerId,
            customerId: userId,
            restaurantId,
            totalPrice,
            items,
        });
        res.status(201).json({
            message: "Cart created and items added",
            cart: newCart,
        });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});
exports.addToCart = addToCart;
// Update the cart
const updateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Get the menu id and action from request body
        const { menuId, action } = req.body;
        // Check if menu id and action are present
        if (!menuId) {
            return next(new appError_1.AppError("Menu ID is required", 400));
        }
        if (!action || !['increment', 'decrement'].includes(action)) {
            return next(new appError_1.AppError("Action must be 'increment' or 'decrement'", 400));
        }
        // Find the user's cart
        const cart = yield cart_model_1.default.findOne({ customerId: userId });
        if (!cart) {
            return next(new appError_1.AppError("Cart not found", 404));
        }
        // Check if the item exists in the cart
        const itemIndex = cart.items.findIndex((item) => item.menuId.toString() === menuId.toString());
        if (itemIndex === -1) {
            return next(new appError_1.AppError("Menu item not found in cart", 404));
        }
        const item = cart.items[itemIndex];
        const oldTotal = item.price * item.quantity;
        // Update quantity based on action
        if (action === 'increment') {
            item.quantity += 1;
        }
        else if (action === 'decrement') {
            if (item.quantity <= 1) {
                return next(new appError_1.AppError("Quantity cannot be less than 1", 400));
            }
            item.quantity -= 1;
        }
        // Calculate new total for this item
        const newTotal = item.price * item.quantity;
        // Update cart total price
        cart.totalPrice = cart.totalPrice - oldTotal + newTotal;
        // Ensure totalPrice doesn't go negative
        if (cart.totalPrice < 0) {
            cart.totalPrice = 0;
        }
        // Save updated cart
        const updatedCart = yield cart.save();
        res.status(200).json({
            message: `Item quantity ${action === 'increment' ? 'increased' : 'decreased'} successfully`,
            cart: updatedCart,
        });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});
exports.updateCart = updateCart;
// Delete item from the cart
const deleteFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authenticaton
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Get the menu id from request body
        const { menuId } = req.body;
        // Check the menu id is present
        if (!menuId) {
            return next(new appError_1.AppError("Menu ID is required", 400));
        }
        // Find the user's cart
        const cart = yield cart_model_1.default.findOne({ customerId: userId });
        if (!cart) {
            return next(new appError_1.AppError("Cart not found", 404));
        }
        // Check if the item exists in the cart
        const itemIndex = cart.items.findIndex((item) => item.menuId.toString() === menuId.toString());
        if (itemIndex === -1) {
            return next(new appError_1.AppError("Menu item not found in cart", 404));
        }
        // Remove the item
        const removedItem = cart.items.splice(itemIndex, 1)[0];
        // Update total price
        cart.totalPrice -= removedItem.price * removedItem.quantity;
        // Ensure totalPrice doesn't go negative
        if (cart.totalPrice < 0) {
            cart.totalPrice = 0;
        }
        // Save updated cart
        const updatedCart = yield cart.save();
        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: updatedCart,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteFromCart = deleteFromCart;
// ************Get menus by association**********************
// Get the cart by user id
const getCartByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get customer id from user authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Find the cart by customer id
        const cart = yield cart_model_1.default.findOne({ customerId: userId });
        // If not find the cart return error
        if (!cart) {
            throw new appError_1.AppError("Cart not found", 404);
        }
        // Send as a response
        res.status(200).json(cart);
    }
    catch (error) {
        next(error);
    }
});
exports.getCartByUserId = getCartByUserId;
// Get the cart by seller id
const getCartBySellerId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.getCartBySellerId = getCartBySellerId;
