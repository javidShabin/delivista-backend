import express from 'express';
import { userRegistration, verifyOtpAndCreateUser } from '../../controllers/userController.js'; // Import the userRegistration function

const router = express.Router();

router.post('/signup', userRegistration); // Use userRegistration as the handler for POST /signup
router.post('/verify-otp', verifyOtpAndCreateUser)

export const userRouter = router;
