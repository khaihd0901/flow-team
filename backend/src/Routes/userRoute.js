import express from 'express';
import { authMe } from '../Controllers/userController.js';
import { protectedRoute } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me',protectedRoute, authMe);

export default router;