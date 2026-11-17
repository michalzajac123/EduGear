import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegister, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me (Protected)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
