import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
} from '../controllers/user.controller.js';

const userRoutes = Router({ mergeParams: true });

userRoutes.post('/', createUser);

userRoutes.get('/', getUsers);

userRoutes.get('/:id', getUserById);

userRoutes.patch('/:id', updateUser);

userRoutes.post('/:id', deleteUser);

export default userRoutes;
