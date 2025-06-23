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
exports.getCustomerProfile = exports.getAllCustomer = void 0;
const auth_model_1 = __importDefault(require("../authentication/auth.model"));
const appError_1 = require("../../utils/appError");
// Get all customers list for admin and seller
const getAllCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract pagination and search query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit; // Calculate how many documents to skip for pagination
        // Build filter condition
        const filter = {
            role: "customer",
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        };
        // Fetch total count for pagination
        const totalCustomers = yield auth_model_1.default.countDocuments(filter);
        // Fetch filtered and paginated customers without passwords
        const customers = yield auth_model_1.default
            .find(filter)
            .select("-password")
            .skip(skip)
            .limit(limit);
        // Send the list with pagination info
        res.status(200).json({
            success: true,
            count: customers.length,
            totalPages: Math.ceil(totalCustomers / limit),
            currentPage: page,
            totalCustomers,
            customers,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCustomer = getAllCustomer;
// Get customer profile using id from user authentication
const getCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get customer id from user authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Find the user by id and also check role is customer
        const customer = yield auth_model_1.default
            .findOne({ _id: userId, role: "customer" })
            .select("-password");
        // Check the user is present or not
        if (!customer) {
            throw new appError_1.AppError("Customer not found", 404);
        }
        // Id have to find any user return as a response
        res.status(200).json({
            success: true,
            customer,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomerProfile = getCustomerProfile;
