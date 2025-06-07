import { Request, Response, NextFunction } from "express";
import sellerTempModel from "./seller.tempModel";
import sellerModel from "./seller.model";
import {
  comparePassword,
  sendOtpEmail,
  hashPassword,
  handleAvatarUpload,
} from "./seller.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import {
  validateSignupSeller,
  validateSellerOTP,
  validateSellerLogin,
  validateSellerPassword,
} from "./seller.validation";
