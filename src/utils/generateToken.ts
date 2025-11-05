import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  name: string;
  admin: boolean;
}

export const generateToken = (payload: JWTPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
