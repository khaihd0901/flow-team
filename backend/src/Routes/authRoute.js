import express from 'express';
import { login, logout, refreshToken, register,authGitHub,authGithubCallback } from '../Controllers/authController.js';

const router = express.Router();

router.get('/github',authGitHub)
router.get('/github/callback',authGithubCallback)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post(`/refresh-token`, refreshToken);

export default router