import type { ObjectSchema } from 'joi';
import Joi from 'joi';

/**
 * Validation schema for user registration
 */
export const registerValidation: ObjectSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[A-Za-z]+(\s[A-Za-z]+)*$/)
    .min(3)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 50 characters',
      'string.pattern.base': "Username can only contain letters and spaces (e.g., 'John Doe')",
      'any.required': 'Username is required',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
      'any.required': 'Password is required',
    }),

  role: Joi.string().valid('user', 'admin').default('user').optional().messages({
    'any.only': "Role must be either 'user' or 'admin'",
  }),

  age: Joi.number().integer().min(18).max(120).optional().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'You must be at least 18 years old',
    'number.max': 'Age cannot exceed 120',
  }),
}).options({
  abortEarly: false, // Return all errors, not just the first
  stripUnknown: true, // Remove unknown fields
});

/**
 * Validation schema for user login
 */
export const loginValidation: ObjectSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string().min(8).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required',
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

/**
 * Validation schema for logout (optional token validation)
 */
export const logoutValidation: ObjectSchema = Joi.object({
  refreshToken: Joi.string().optional().messages({
    'string.base': 'Refresh token must be a string',
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});
