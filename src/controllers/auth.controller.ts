import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { authService } from '../services/auth.service.js';

// 🧩 Register
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
});

// 🧩 Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

// 🧩 Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Token required' });

  await authService.logoutUser(token);
  res.status(200).json({ message: 'Logged out successfully' });
});
