import { Request, Response, NextFunction } from "express";
import restSchema from "./rest.model";
import { handleAvatarUpload } from "./rest.service";
import { AppError } from "../../utils/appError";
import { validateRestaurantCreation } from "./rest.validation";