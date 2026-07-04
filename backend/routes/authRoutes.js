import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET  /api/auth/profile/:userId
router.get('/profile/:userId', getProfile);

// GET  /api/auth/users  (admin)
router.get('/users', getAllUsers);

export default router;
