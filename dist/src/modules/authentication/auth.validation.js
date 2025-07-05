"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUserPassword = exports.validateUserLogin = exports.validateUserOTPandEmail = exports.validateSignupUser = void 0;
const appError_1 = require("../../utils/appError");
// Validation for user signupn
const validateSignupUser = (data) => {
    // Destructer the user details as data from interface
    const { name, email, password, confirmPassword, phone } = data;
    // Check the required fields are present or not
    if (!name || !email || !password || !confirmPassword || !phone) {
        throw new appError_1.AppError("All fields are required", 400);
    }
    // Compare the password and conform password
    if (password !== confirmPassword) {
        throw new appError_1.AppError("Passwords do not match", 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new appError_1.AppError("Invalid email format", 400);
    }
    if (password.length < 6) {
        throw new appError_1.AppError("Password must be at least 6 characters", 400);
    }
};
exports.validateSignupUser = validateSignupUser;
// Validation for user OTP verification
const validateUserOTPandEmail = (data) => {
    // Destructer the user email and otp
    const { email, otp } = data;
    // Check the otp and email is present or not
    if (!email || !otp) {
        throw new appError_1.AppError("OTP and email is required", 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new appError_1.AppError("Invalid email format", 400);
    }
    if (otp.length < 6) {
        throw new appError_1.AppError("OTP must have 6 number", 400);
    }
};
exports.validateUserOTPandEmail = validateUserOTPandEmail;
// Validation for user login
const validateUserLogin = (data) => {
    // Destructer the user email and password
    const { email, password } = data;
    // Check the email and password is present
    if (!email || !password) {
        throw new appError_1.AppError("Email and password is required", 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new appError_1.AppError("Invalid email format", 400);
    }
    if (password.length < 6) {
        throw new appError_1.AppError("Password must be at least 6 characters", 400);
    }
};
exports.validateUserLogin = validateUserLogin;
// Validation for update user password
const validateUpdateUserPassword = (data) => {
    // Destructer the user email, otp, password and confirm password
    const { email, otp, password, confirmPassword } = data;
    // Check the required fields are present or not
    if (!email || !otp || !password || !confirmPassword) {
        throw new appError_1.AppError("All fields are required", 400);
    }
    // Compare the password and conform password
    if (password !== confirmPassword) {
        throw new appError_1.AppError("Passwords do not match", 400);
    }
};
exports.validateUpdateUserPassword = validateUpdateUserPassword;
