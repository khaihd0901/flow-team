import express from 'express';
import { login, logout, refreshToken, register,authGitHub,authGithubCallback, authGoogleCallback, authGoogle } from '../Controllers/authController.js';

const router = express.Router();

router.get('/github',authGitHub)
router.get('/github/callback',authGithubCallback)
router.get('/google',authGoogle)
router.get('/google/callback',authGoogleCallback)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post(`/refresh-token`, refreshToken);

export default router