import express from 'express';
import { loginMember, registerMember } from '../controllers/authController.js';

const router = express.Router();

// Register a new member
// POST /api/auth/register
router.post('/register', registerMember);

// Login and receive JWT token
// POST /api/auth/login
router.post('/login', loginMember);

export default router;
