import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js'; // make sure path is correct

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Detect known ApiError with custom status
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
