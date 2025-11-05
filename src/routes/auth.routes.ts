import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const authRoutes = Router({ mergeParams: true });

// ✅ POST /api/auth/register
authRoutes.post('/register', registerUser);

// ✅ POST /api/auth/login
authRoutes.post('/login', loginUser);

export default authRoutes;
