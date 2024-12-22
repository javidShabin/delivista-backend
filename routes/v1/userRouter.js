import express from 'express';
import { userRegistration } from '../../controllers/userController.js'; // Import the userRegistration function

const router = express.Router();

router.post('/signup', userRegistration); // Use userRegistration as the handler for POST /signup

export const userRouter = router;
