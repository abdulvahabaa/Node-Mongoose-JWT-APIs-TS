import { Request, Response } from 'express';
import { userService } from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role, age } = req.body;
  const newUser = await userService.createUser({ username, email, password, role, age });
  res.status(201).json(newUser);
});
