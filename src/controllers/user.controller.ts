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

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await userService.deleteUser(id);
  res.status(200).json(deletedUser);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password, role, age } = req.body;
  const updatedUser = await userService.updateUser(id, { username, email, password, role, age });
  res.status(200).json(updatedUser);
});
