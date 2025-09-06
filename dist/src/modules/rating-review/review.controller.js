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
exports.ratingRestaurant = void 0;
const review_model_1 = __importDefault(require("./review.model"));
const rest_model_1 = __importDefault(require("../restaurant/rest.model"));
const auth_model_1 = __importDefault(require("../authentication/auth.model"));
const order_model_1 = __importDefault(require("../payment/order.model"));
const appError_1 = require("../../utils/appError");
// Add review and rating for the restaurants
const ratingRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get customer id from authentication
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Destructure the details from request body
        const { sellerId, orderId, rating, review } = req.body;
        if (!sellerId || !orderId || rating === undefined || !review) {
            return next(new appError_1.AppError("All fields are required", 404));
        }
        const user = yield auth_model_1.default.findById(customerId);
        // Find the restaurant by seller id
        const restaurant = yield rest_model_1.default.findOne({ sellerId });
        if (!restaurant) {
            return next(new appError_1.AppError("Restaurant not found", 404));
        }
        // Update restaurant ratings and total reviews
        restaurant.ratings = rating;
        restaurant.totalReviews = (restaurant.totalReviews || 0) + 1;
        yield restaurant.save();
        // Find the current order
        const currentOrder = yield order_model_1.default.findById(orderId);
        if (!currentOrder) {
            return next(new appError_1.AppError("Order not found", 404));
        }
        // Safely assign and save
        currentOrder.isReviewed = true;
        yield currentOrder.save();
        // Create and save new review
        const newReview = new review_model_1.default({
            customerId,
            restaurantId: restaurant._id,
            orderId,
            rating,
            review,
            avatar: user === null || user === void 0 ? void 0 : user.avatar,
        });
        yield newReview.save();
        res.status(201).json({
            status: "success",
            message: "Review added successfully",
            data: newReview,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ratingRestaurant = ratingRestaurant;
