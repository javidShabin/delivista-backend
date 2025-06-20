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
exports.checkUser = exports.logoutUser = exports.loginUser = exports.verifyOtpandCreateUser = exports.singupUser = void 0;
const auth_tempModel_1 = __importDefault(require("./auth.tempModel"));
const auth_model_1 = __importDefault(require("./auth.model"));
const appError_1 = require("../../utils/appError");
const auth_validation_1 = require("./auth.validation");
const auth_service_1 = require("./auth.service");
const send_mail_1 = require("../../shared/email/send.mail");
const generateToken_1 = require("../../utils/generateToken");
// Generate and send OTP to user email
// Send OTP using node mailer to user email
const singupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the user details in validate function
        (0, auth_validation_1.validateSignupUser)(req.body);
        // Destructer the details from request body
        const { name, email, password, phone, role } = req.body;
        // Validate the role
        const validRoles = ["admin", "seller", "customer"];
        if (!validRoles.includes(role)) {
            return next(new appError_1.AppError("Invalid role specified", 400));
        }
        // Check if the user is already exist or not
        const isUserExist = yield auth_model_1.default.findOne({ email });
        if (isUserExist) {
            throw new appError_1.AppError("User already exists", 400);
        }
        // Hash the user password
        const hashedPassword = yield (0, auth_service_1.hashPassword)(password);
        // Generate a random 6-digit OTP
        const otp = (0, auth_service_1.generateOTP)();
        // Create a temporary user record with the OTP and OTP expiring
        const temUser = yield auth_tempModel_1.default.findOneAndUpdate({ email }, {
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            otp,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
        }, { upsert: true, new: true });
        // Send the OTP to the user's emial
        yield (0, send_mail_1.sendOtpEmail)(email, otp);
        let user = auth_tempModel_1.default.find({ email });
        // Respond with a success message
        res.status(200).json({
            status: "success",
            message: "OTP sent to your email. Please verify to complete signup.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.singupUser = singupUser;
// verify the user OTP and create new user
const verifyOtpandCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate OTP and email
        (0, auth_validation_1.validateUserOTPandEmail)(req.body);
        // Destructer OTP and email from request body
        const { otp, email } = req.body;
        console.log(otp);
        // Check if the user exists as a temporary user
        const tempUser = yield auth_tempModel_1.default.findOne({ email });
        if (!tempUser) {
            throw new appError_1.AppError("User not found", 400);
        }
        // Compare the OTP with tmepuser OTP
        if (tempUser.otp !== otp) {
            throw new appError_1.AppError("Invalid OTP", 400);
        }
        // Check the OTP is expire or not
        if (tempUser.otpExpires.getTime() < Date.now()) {
            throw new appError_1.AppError("OTP has expired", 400);
        }
        // Create the new user and save database
        const newUser = new auth_model_1.default({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password,
            phone: tempUser.phone,
            role: tempUser.role,
            avatar: tempUser.avatar,
        });
        yield newUser.save();
        //Token creation
        const token = (0, generateToken_1.generateToken)({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        yield auth_tempModel_1.default.deleteOne({ email });
        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOtpandCreateUser = verifyOtpandCreateUser;
// Login user , compare hashed password
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the user details
        (0, auth_validation_1.validateUserLogin)(req.body);
        // Destructer email and password
        const { email, password } = req.body;
        // FInd the user by email
        const isUser = yield auth_model_1.default.findOne({ email });
        if (!isUser) {
            throw new appError_1.AppError("User does not exist with this email", 400);
        }
        // Compare password
        const isMatch = yield (0, auth_service_1.comparePassword)(password, isUser.password);
        // If password does not match, throw an error
        if (!isMatch) {
            throw new appError_1.AppError("Invalid password", 401);
        }
        // Token creation
        const token = (0, generateToken_1.generateToken)({
            id: isUser.id,
            email: isUser.email,
            role: isUser.role,
        });
        // Send the token to cookie
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "User logged in successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// Logout the user , clear cookie
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the token from cookie
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutUser = logoutUser;
// Verifying the user is authonticaed or not
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user first from user authontication
        // And chekc is the user is authonticate or not
        const user = req.user;
        if (!user) {
            return next(new appError_1.AppError("User not authorized", 401));
        }
        // If find the user by authentication send as a reaponxe
        res.status(200).json({
            success: true,
            message: "User is authorized",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.checkUser = checkUser;
