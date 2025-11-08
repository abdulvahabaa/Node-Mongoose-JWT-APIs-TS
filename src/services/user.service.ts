import User from '../models/user.model.js';
import { IUser } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
  async getAllUsers() {
    return User.find().select('-password');
  },

  async createUser(data: IUser) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ApiError('Email already exists', 409);
    }
    return User.create(data);
  },

  async getUserById(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  },

  async deleteUser(id: string) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new ApiError('User not found', 404);
    }
    return deletedUser;
  },

  async updateUser(id: string, data: Partial<IUser>) {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      throw new ApiError('User not found', 404);
    }
    return updatedUser;
  },
};
