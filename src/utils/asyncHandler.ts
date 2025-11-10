import type { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async route handlers
 */
type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | Promise<any>;

/**
 * Wrapper function to handle async route handlers
 * Catches any errors and passes them to the next middleware (error handler)
 *
 * @param fn - Async function to wrap
 * @returns Express middleware function
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
