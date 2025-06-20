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
exports.createMenu = void 0;
const menu_model_1 = __importDefault(require("./menu.model"));
const appError_1 = require("../../utils/appError");
const menu_validation_1 = require("./menu.validation");
// Create menu
const createMenu = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the details first
        (0, menu_validation_1.validateMenuCreation)(req.body);
        // Destructer data from request body after validation
        const { productName, description, category, price } = req.body;
        // Check the same item already in db
        const isMenuItem = yield menu_model_1.default.find({ productName });
        if (isMenuItem) {
            return next(new appError_1.AppError("The item already exists", 400));
        }
    }
    catch (error) { }
});
exports.createMenu = createMenu;
