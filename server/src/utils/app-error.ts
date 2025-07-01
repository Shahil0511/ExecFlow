// src/utils/app-error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Common error types as static methods
  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Not Found') {
    return new AppError(message, 404);
  }
}
