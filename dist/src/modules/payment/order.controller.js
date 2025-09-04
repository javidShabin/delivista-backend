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
exports.orderListBySeller = exports.orderCancel = exports.singleOrder = exports.orderListByCustomer = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const appError_1 = require("../../utils/appError");
const orderListByCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get customer id from authentication
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("Customer not authenticated", 401));
        }
        // Find all orders by customer
        const orderList = yield order_model_1.default.find({ customerId });
        if (!orderList || orderList.length === 0) {
            return next(new appError_1.AppError("No orders found", 404));
        }
        // Send response
        res.status(200).json({
            message: "Fetched all orders for the customer",
            data: orderList,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderListByCustomer = orderListByCustomer;
// Get the single order by id
const singleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the order id form request params
        const { orderId } = req.params;
        if (!orderId) {
            return next(new appError_1.AppError("Order ID is required", 400));
        }
        // Find the order by id
        const order = yield order_model_1.default.findById(orderId);
        if (!order) {
            return next(new appError_1.AppError("Order not found", 404));
        }
        // Send response to client
        res.status(200).json({
            message: "Fetched single order",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.singleOrder = singleOrder;
// Cancel the order
const orderCancel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get order id from params
        const { orderId } = req.params;
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("Customer not authenticated", 401));
        }
        if (!orderId) {
            return next(new appError_1.AppError("Order ID is required", 400));
        }
        // Find the order
        const order = yield order_model_1.default.findById(orderId);
        if (!order) {
            return next(new appError_1.AppError("Order not found", 404));
        }
        // Ensure the order belongs to the customer
        if (order.customerId.toString() !== customerId.toString()) {
            return next(new appError_1.AppError("You are not authorized to cancel this order", 403));
        }
        // Prevent cancelling if already cancelled or delivered
        if (order.orderStatus === "cancelled") {
            return next(new appError_1.AppError("Order is already cancelled", 400));
        }
        if (order.orderStatus === "delivered") {
            return next(new appError_1.AppError("Delivered orders cannot be cancelled", 400));
        }
        // Update status
        const updatedOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { orderStatus: "cancelled" }, { new: true, runValidators: false });
        res.status(200).json({
            message: "Order cancelled successfully",
            data: updatedOrder,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderCancel = orderCancel;
// Get orders for restaurants (seller)
const orderListBySeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get seller id from authentication
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!sellerId) {
            return next(new appError_1.AppError("Seller not authenticated", 401));
        }
        // Find all orders for this seller
        const orderList = yield order_model_1.default.find({ sellerId });
        if (!orderList || orderList.length === 0) {
            return next(new appError_1.AppError("No orders found for this seller", 404));
        }
        // Send response
        res.status(200).json({
            message: "Fetched all orders for the seller",
            data: orderList,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderListBySeller = orderListBySeller;
