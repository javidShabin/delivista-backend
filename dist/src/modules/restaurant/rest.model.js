"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const restaurantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sellerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    cuisine: [
        {
            type: String,
            required: true,
        },
    ],
    pinCode: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    openTime: {
        type: String,
        default: "09:00",
    },
    closeTime: {
        type: String,
        default: "23:00",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Restaurant", restaurantSchema);
