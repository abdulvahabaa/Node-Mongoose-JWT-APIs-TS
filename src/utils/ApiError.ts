export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Properly capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}
