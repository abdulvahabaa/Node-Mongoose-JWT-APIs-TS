import { Router } from 'express';
import { getUsers, createUser } from '../controllers/user.controller.js';

const userRoutes = Router({ mergeParams: true });

userRoutes.get('/', getUsers);

userRoutes.post('/', createUser);

export default userRoutes;
