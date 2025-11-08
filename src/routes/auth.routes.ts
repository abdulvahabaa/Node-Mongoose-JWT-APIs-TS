import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';

const authRoutes = Router({ mergeParams: true });

// POST /api/auth/register
authRoutes.post('/register', registerUser);

// POST /api/auth/login
authRoutes.post('/login', loginUser);

// POST /api/auth/logout
authRoutes.post('/logout', logoutUser);

export default authRoutes;
