import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginValidation, registerValidation } from '../validations/auth.validation.js';

const authRoutes = Router({ mergeParams: true });

// POST /api/auth/register
authRoutes.post('/register', validate(registerValidation), registerUser);

// POST /api/auth/login
authRoutes.post('/login', validate(loginValidation), loginUser);

// POST /api/auth/logout
authRoutes.post('/logout', logoutUser);

export default authRoutes;
