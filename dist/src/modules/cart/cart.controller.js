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
    try {
        // Validate the data from request body
        (0, cart_validation_1.validateCartCreation)(req.body);
        // Destructure data from request body
        const { sellerId, customerId, restaurantId, items } = req.body;
        console.log(sellerId);
        // Validate all items contain menuId
        for (const item of items) {
            if (!item.menuId) {
                throw new appError_1.AppError("Each item must include a valid menuId", 400);
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
            customerId,
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
        next(error);
    }
});
exports.addToCart = addToCart;
// Update the cart
const updateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
exports.updateCart = updateCart;
// Delete item from the cart
const deleteFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
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
