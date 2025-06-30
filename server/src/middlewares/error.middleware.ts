import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/config/logger';
import { AppError } from '@/utils/app-error';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // Custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // MongoDB errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Database validation failed',
      errors: Object.values((error as any).errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      })),
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
    });
    return;
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
