import { Request, Response, NextFunction } from "express";
import tempAuthSchema from "./auth.tempModel";
import authSchema from "./auth.model";
import { AppError } from "../../utils/appError";
import { validateSignupUser, validateUserLogin, validateUserOTP } from "./auth.validation";