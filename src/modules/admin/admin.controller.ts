import { Request, Response, NextFunction } from "express";
import tempAdminSchema from "./admin.tempModel";
import adminSchema from "./admin.model";
import { comparePassword, hashPassword, sendOtpEmail } from "./admin.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import cloudinary from "../../configs/cloudinary";