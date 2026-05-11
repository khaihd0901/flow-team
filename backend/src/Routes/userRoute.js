import express from 'express';
import { authMe, forgotPasswordOTP, resetPassword, verifyOTP } from '../Controllers/userController.js';
import { protectedRoute } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me',protectedRoute, authMe);
router.post('/forgot-password', forgotPasswordOTP);
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword );


export default router;