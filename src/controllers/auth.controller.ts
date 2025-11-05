import { Request, Response } from 'express';
import User from '../models/user.model.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  role?: string;
  age?: number;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// 🧩 Register User
export const registerUser = asyncHandler(
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    console.log('>>>> Register user function called');

    const { username, email, password, role, age } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please fill all required fields' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
      age: age || null,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      age: user.age,
    });
  },
);

// 🧩 Login User
export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.username,
      admin: user.role === 'admin',
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email,
      token,
      role: user.role,
    });
  },
);
