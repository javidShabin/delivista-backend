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
exports.ReviewController = void 0;
const review_model_1 = __importDefault(require("./review.model"));
const rest_model_1 = __importDefault(require("../restaurant/rest.model"));
const menu_model_1 = __importDefault(require("../menu/menu.model"));
const appError_1 = require("../../utils/appError");
class ReviewController {
    // Create a new review
    static createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { restaurantId, menuItemId, orderId, rating, reviewText, images } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new appError_1.AppError("User not authenticated", 401);
                }
                // Validate required fields
                if (!restaurantId || !orderId || !rating) {
                    throw new appError_1.AppError("Restaurant ID, Order ID, and rating are required", 400);
                }
                // Check if restaurant exists
                const restaurant = yield rest_model_1.default.findById(restaurantId);
                if (!restaurant) {
                    throw new appError_1.AppError("Restaurant not found", 404);
                }
                // Check if menu item exists (if provided)
                if (menuItemId) {
                    const menuItem = yield menu_model_1.default.findById(menuItemId);
                    if (!menuItem) {
                        throw new appError_1.AppError("Menu item not found", 404);
                    }
                }
                // Check if user has already reviewed this restaurant/order
                const existingReview = yield review_model_1.default.findOne(Object.assign({ userId,
                    restaurantId,
                    orderId }, (menuItemId && { menuItemId })));
                if (existingReview) {
                    throw new appError_1.AppError("You have already reviewed this order", 400);
                }
                // Create new review
                const review = new review_model_1.default({
                    userId,
                    restaurantId,
                    menuItemId: menuItemId || undefined,
                    orderId,
                    rating,
                    reviewText: reviewText || undefined,
                    images: images || []
                });
                yield review.save();
                // Update restaurant ratings
                yield this.updateRestaurantRatings(restaurantId);
                // Update menu item ratings if applicable
                if (menuItemId) {
                    yield this.updateMenuItemRatings(menuItemId);
                }
                const response = {
                    success: true,
                    message: "Review created successfully",
                    data: review
                };
                res.status(201).json(response);
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Get reviews with filters
    static getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId, menuItemId, userId, rating, minRating, maxRating, hasImages, sortBy = 'newest', page = 1, limit = 10 } = req.query;
                const filters = {};
                if (restaurantId)
                    filters.restaurantId = restaurantId;
                if (menuItemId)
                    filters.menuItemId = menuItemId;
                if (userId)
                    filters.userId = userId;
                if (rating)
                    filters.rating = rating;
                if (minRating || maxRating) {
                    filters.rating = {};
                    if (minRating)
                        filters.rating.$gte = minRating;
                    if (maxRating)
                        filters.rating.$lte = maxRating;
                }
                if (hasImages === 'true')
                    filters.images = { $exists: true, $not: { $size: 0 } };
                const sortOptions = {};
                switch (sortBy) {
                    case 'newest':
                        sortOptions.createdAt = -1;
                        break;
                    case 'oldest':
                        sortOptions.createdAt = 1;
                        break;
                    case 'highest_rating':
                        sortOptions.rating = -1;
                        break;
                    case 'lowest_rating':
                        sortOptions.rating = 1;
                        break;
                    default:
                        sortOptions.createdAt = -1;
                }
                const skip = (Number(page) - 1) * Number(limit);
                const reviews = yield review_model_1.default.find(filters)
                    .populate('userId', 'name email')
                    .populate('restaurantId', 'name')
                    .populate('menuItemId', 'productName')
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(Number(limit));
                const totalReviews = yield review_model_1.default.countDocuments(filters);
                const response = {
                    success: true,
                    message: "Reviews retrieved successfully",
                    data: reviews
                };
                res.status(200).json(Object.assign(Object.assign({}, response), { pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(totalReviews / Number(limit)),
                        totalReviews,
                        hasNext: skip + reviews.length < totalReviews,
                        hasPrev: Number(page) > 1
                    } }));
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Get review statistics
    static getReviewStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId, menuItemId } = req.params;
                if (!restaurantId && !menuItemId) {
                    throw new appError_1.AppError("Restaurant ID or Menu Item ID is required", 400);
                }
                const filters = {};
                if (restaurantId)
                    filters.restaurantId = restaurantId;
                if (menuItemId)
                    filters.menuItemId = menuItemId;
                const reviews = yield review_model_1.default.find(filters);
                if (reviews.length === 0) {
                    const stats = {
                        averageRating: 0,
                        totalReviews: 0,
                        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                        verifiedReviews: 0,
                        reviewsWithImages: 0
                    };
                    res.status(200).json({
                        success: true,
                        message: "Review statistics retrieved successfully",
                        data: stats
                    });
                    return;
                }
                const totalReviews = reviews.length;
                const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
                const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                reviews.forEach(review => {
                    ratingDistribution[review.rating]++;
                });
                const reviewsWithImages = reviews.filter(review => review.images && review.images.length > 0).length;
                const stats = {
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalReviews,
                    ratingDistribution,
                    verifiedReviews: totalReviews, // Assuming all reviews are verified for now
                    reviewsWithImages
                };
                res.status(200).json({
                    success: true,
                    message: "Review statistics retrieved successfully",
                    data: stats
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Update a review
    static updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { reviewId } = req.params;
                const { rating, reviewText, images } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new appError_1.AppError("User not authenticated", 401);
                }
                const review = yield review_model_1.default.findOne({ _id: reviewId, userId });
                if (!review) {
                    throw new appError_1.AppError("Review not found or you don't have permission to update it", 404);
                }
                // Update fields
                if (rating !== undefined)
                    review.rating = rating;
                if (reviewText !== undefined)
                    review.reviewText = reviewText;
                if (images !== undefined)
                    review.images = images;
                yield review.save();
                // Update ratings
                yield this.updateRestaurantRatings(review.restaurantId.toString());
                if (review.menuItemId) {
                    yield this.updateMenuItemRatings(review.menuItemId.toString());
                }
                const response = {
                    success: true,
                    message: "Review updated successfully",
                    data: review
                };
                res.status(200).json(response);
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Delete a review
    static deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { reviewId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new appError_1.AppError("User not authenticated", 401);
                }
                const review = yield review_model_1.default.findOne({ _id: reviewId, userId });
                if (!review) {
                    throw new appError_1.AppError("Review not found or you don't have permission to delete it", 404);
                }
                const restaurantId = review.restaurantId.toString();
                const menuItemId = (_b = review.menuItemId) === null || _b === void 0 ? void 0 : _b.toString();
                yield review_model_1.default.findByIdAndDelete(reviewId);
                // Update ratings
                yield this.updateRestaurantRatings(restaurantId);
                if (menuItemId) {
                    yield this.updateMenuItemRatings(menuItemId);
                }
                res.status(200).json({
                    success: true,
                    message: "Review deleted successfully"
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Get a single review
    static getReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                const review = yield review_model_1.default.findById(reviewId)
                    .populate('userId', 'name email')
                    .populate('restaurantId', 'name')
                    .populate('menuItemId', 'productName');
                if (!review) {
                    throw new appError_1.AppError("Review not found", 404);
                }
                const response = {
                    success: true,
                    message: "Review retrieved successfully",
                    data: review
                };
                res.status(200).json(response);
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Internal server error",
                    error: error.message
                });
            }
        });
    }
    // Helper method to update restaurant ratings
    static updateRestaurantRatings(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield review_model_1.default.find({ restaurantId });
            if (reviews.length === 0) {
                yield rest_model_1.default.findByIdAndUpdate(restaurantId, {
                    ratings: 0,
                    totalReviews: 0
                });
                return;
            }
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            yield rest_model_1.default.findByIdAndUpdate(restaurantId, {
                ratings: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            });
        });
    }
    // Helper method to update menu item ratings
    static updateMenuItemRatings(menuItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield review_model_1.default.find({ menuItemId });
            if (reviews.length === 0) {
                yield menu_model_1.default.findByIdAndUpdate(menuItemId, {
                    ratings: 0,
                    totalReviews: 0
                });
                return;
            }
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            yield menu_model_1.default.findByIdAndUpdate(menuItemId, {
                ratings: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            });
        });
    }
}
exports.ReviewController = ReviewController;
