import { Request, Response, NextFunction } from "express";
import restSchema from "./rest.model";
import { handleAvatarUpload } from "./rest.service";
import { AppError } from "../../utils/appError";
import { validateRestaurantCreation } from "./rest.validation";

// Get all restaurants
// Get verified restaurants
// Verification restaurant for admin
// Get restaurant by ID
// Get top reated restaurant
// Filter location based
// Get restaurant statitics
// Ge restarant by seller ID
// Filter restaurant by menu
// Toggle restaurant status for seller
// Create restaurant
// Update restaurant
// Delete restaurant