import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

/**
 * JWT payload interface
 */
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate user using JWT token
 * Extracts token from Authorization header (Bearer token)
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required. Please provide a valid token.');
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      throw ApiError.unauthorized('Access token is missing');
    }

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw ApiError.internal('JWT secret is not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Fetch user from database (exclude password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw ApiError.unauthorized('User not found. Token is invalid.');
      }

      // Check if user is active (if you have an isActive field)
      // if (!user.isActive) {
      //   throw ApiError.forbidden('Your account has been deactivated');
      // }

      // Attach user to request object
      req.user = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Access token has expired. Please login again.');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid access token. Please login again.');
      }

      if (error instanceof jwt.NotBeforeError) {
        throw ApiError.unauthorized('Token not active yet');
      }

      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }

      // For any other errors
      throw ApiError.unauthorized('Authentication failed');
    }
  },
);

/**
 * Middleware to authorize user based on roles
 * Must be used after authenticate middleware
 * @param roles - Array of allowed roles
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user exists on request (should be set by authenticate middleware)
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied. This resource requires one of the following roles: ${roles.join(', ')}`,
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is accessing their own resource
 * Admins can access any resource
 * @param userIdParam - The name of the route parameter containing the user ID (default: 'id')
 */
export const authorizeOwnerOrAdmin = (userIdParam = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const resourceUserId = req.params[userIdParam];
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Allow if user is admin or accessing their own resource
    if (!isAdmin && resourceUserId !== currentUserId) {
      throw ApiError.forbidden('You can only access your own resources');
    }

    next();
  };
};
