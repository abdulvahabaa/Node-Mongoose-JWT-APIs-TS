/**
 * Custom API Error class for handling application errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Array<{ field: string; message: string }>;

  /**
   * Creates an instance of ApiError
   * @param statusCode - HTTP status code
   * @param message - Error message
   * @param errors - Optional validation errors array
   * @param isOperational - Whether error is operational (true) or programming error (false)
   * @param stack - Optional stack trace
   */
  constructor(
    statusCode: number,
    message: string,
    errors?: Array<{ field: string; message: string }>,
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Factory method for 400 Bad Request errors
   */
  static badRequest(message: string, errors?: Array<{ field: string; message: string }>): ApiError {
    return new ApiError(400, message, errors);
  }

  /**
   * Factory method for 401 Unauthorized errors
   */
  static unauthorized(message = 'Unauthorized access'): ApiError {
    return new ApiError(401, message);
  }

  /**
   * Factory method for 403 Forbidden errors
   */
  static forbidden(message = 'Access forbidden'): ApiError {
    return new ApiError(403, message);
  }

  /**
   * Factory method for 404 Not Found errors
   */
  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  /**
   * Factory method for 409 Conflict errors
   */
  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  /**
   * Factory method for 422 Unprocessable Entity errors
   */
  static unprocessableEntity(
    message: string,
    errors?: Array<{ field: string; message: string }>,
  ): ApiError {
    return new ApiError(422, message, errors);
  }

  /**
   * Factory method for 429 Too Many Requests errors
   */
  static tooManyRequests(message = 'Too many requests, please try again later'): ApiError {
    return new ApiError(429, message);
  }

  /**
   * Factory method for 500 Internal Server errors
   */
  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, undefined, false);
  }

  /**
   * Convert error to JSON format
   */
  toJSON(): {
    success: false;
    statusCode: number;
    message: string;
    errors?: Array<{ field: string; message: string }>;
    stack?: string;
  } {
    const response: {
      success: false;
      statusCode: number;
      message: string;
      errors?: Array<{ field: string; message: string }>;
      stack?: string;
    } = {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
    };

    if (this.errors && this.errors.length > 0) {
      response.errors = this.errors;
    }

    // Include stack trace in development mode
    if (process.env.NODE_ENV !== 'production' && this.stack) {
      response.stack = this.stack;
    }

    return response;
  }
}
