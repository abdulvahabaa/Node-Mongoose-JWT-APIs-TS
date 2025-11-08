import mongoose, { Document, Model, Schema } from 'mongoose';
import argon2 from 'argon2';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: string;
  age?: number | null;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
  matchPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    age: { type: Number, default: null },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});

userSchema.methods.matchPassword = async function (candidatePassword: string): Promise<boolean> {
  return argon2.verify(this.password, candidatePassword);
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);
export default User;
