import { logger } from '@/config/logger';
import { AppError } from '@/utils/app-error';
import { NextFunction } from 'express';
import { ZodError } from 'zod';
import { Request, Response } from 'express';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 🔥 FULL ERROR logging (message, stack, and extra context)
  logger.error({
    msg: '🔴 Unhandled Error',
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ...(error instanceof AppError && { statusCode: error.statusCode }),
    ...(error instanceof ZodError && { zodErrors: error.errors }),
  });

  // 🔎 Zod validation error
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    res.status(400).json({ status: 'error', message: 'Validation failed', errors });
    return;
  }

  // 🔎 Your AppError class
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // 🔎 Mongoose ValidationError
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

  // 🔎 Mongoose CastError (e.g., invalid ObjectId)
  if (error.name === 'CastError') {
    res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
    });
    return;
  }

  // 🔴 Default fallback
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
