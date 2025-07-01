// src/utils/app-error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Captures the current stack trace
    Error.captureStackTrace?.(this);
  }

  // Common error types as static methods for easy reuse
  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message = "Not Found") {
    return new AppError(message, 404);
  }

  static conflict(message = "Conflict") {
    return new AppError(message, 409);
  }

  static internalError(message = "Internal Server Error") {
    return new AppError(message, 500);
  }

  static validationError(message = "Validation Error") {
    return new AppError(message, 422);
  }

  // Convert any error to AppError
  static fromError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 500);
    }

    return new AppError("An unknown error occurred", 500);
  }
}

// Type guard for AppError
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
