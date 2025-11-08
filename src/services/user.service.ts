import User from '../models/user.model.js';
import { IUser } from '../models/user.model.js';

export const userService = {
  async getAllUsers() {
    return User.find().select('-password');
  },

  async createUser(data: IUser) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    return User.create(data);
  },

  async getUserById(id: string) {
    return User.findById(id).select('-password');
  },

  async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  },
};
