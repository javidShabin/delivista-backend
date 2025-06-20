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
exports.handleImageUpload = void 0;
const cloudinary_1 = __importDefault(require("../../configs/cloudinary"));
const appError_1 = require("../../utils/appError");
// Handles the restaurant image upload process using Cloudinary
const handleImageUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield cloudinary_1.default.uploader.upload(file.path);
        // Store the image url to update user data
        return uploadResult.secure_url;
    }
    catch (error) {
        throw new appError_1.AppError("Failed to upload avatar image", 500);
    }
});
exports.handleImageUpload = handleImageUpload;
