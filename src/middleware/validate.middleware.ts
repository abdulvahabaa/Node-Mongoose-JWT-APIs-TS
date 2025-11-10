import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validation target types
 */
type ValidationSource = 'body' | 'query' | 'params';

/**
 * Middleware factory to validate request data using Joi schemas
 * @param schema - Joi validation schema
 * @param source - Where to validate from (body, query, or params)
 * @returns Express middleware function
 */
export const validate = (schema: ObjectSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get the data to validate based on source
      const dataToValidate = req[source];

      // Validate the data
      const { error, value } = schema.validate(dataToValidate);

      if (error) {
        // Extract all error messages
        const errorMessages = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        // Create a formatted error message
        const formattedMessage = errorMessages.map((err) => err.message).join(', ');

        // Throw ApiError with validation details
        throw new ApiError(400, formattedMessage, errorMessages);
      }

      // Replace request data with validated and sanitized data
      req[source] = value;

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate multiple sources at once (body, query, params)
 * @param schemas - Object with schemas for different sources
 * @returns Express middleware function
 */
export const validateMultiple = (schemas: {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const errors: Array<{ field: string; message: string }> = [];

      // Validate body if schema provided
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body);
        if (error) {
          errors.push(
            ...error.details.map((detail) => ({
              field: `body.${detail.path.join('.')}`,
              message: detail.message,
            })),
          );
        } else {
          req.body = value;
        }
      }

      // Validate query if schema provided
      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query);
        if (error) {
          errors.push(
            ...error.details.map((detail) => ({
              field: `query.${detail.path.join('.')}`,
              message: detail.message,
            })),
          );
        } else {
          req.query = value;
        }
      }

      // Validate params if schema provided
      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params);
        if (error) {
          errors.push(
            ...error.details.map((detail) => ({
              field: `params.${detail.path.join('.')}`,
              message: detail.message,
            })),
          );
        } else {
          req.params = value;
        }
      }

      // If there are any errors, throw ApiError
      if (errors.length > 0) {
        const formattedMessage = errors.map((err) => err.message).join(', ');
        throw new ApiError(400, formattedMessage, errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate with custom error handler
 * @param schema - Joi validation schema
 * @param source - Where to validate from
 * @param onError - Custom error handler function
 * @returns Express middleware function
 */
export const validateWithCustomError = (
  schema: ObjectSchema,
  source: ValidationSource = 'body',
  onError?: (errors: Array<{ field: string; message: string }>) => void,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[source];
      const { error, value } = schema.validate(dataToValidate);

      if (error) {
        const errorMessages = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        // Call custom error handler if provided
        if (onError) {
          onError(errorMessages);
        }

        const formattedMessage = errorMessages.map((err) => err.message).join(', ');
        throw new ApiError(400, formattedMessage, errorMessages);
      }

      req[source] = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};
