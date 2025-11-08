import User from '../models/user.model.js';
import { cacheService } from './cache.service.js';
import { generateToken } from '../utils/generateToken.js';

export class AuthService {
  async registerUser(data: {
    username: string;
    email: string;
    password: string;
    role?: string;
    age?: number;
  }) {
    const { username, email, password, role, age } = data;

    const cachedUser = await cacheService.getCachedUser(email);
    if (cachedUser) {
      throw new Error('User already exists (cached)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
      age: age || null,
    });

    await cacheService.cacheUser(user._id.toString(), user); // Cache new user
    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.username,
      admin: user.role === 'admin',
    });

    // Cache session in Redis
    await cacheService.createSession(token, user._id.toString(), 86400);

    return { user, token };
  }

  async logoutUser(token: string) {
    await cacheService.blacklistToken(token, 86400);
  }
}

export const authService = new AuthService();
