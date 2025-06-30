// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { JWT_SECRET } from '../config/env';
import { ApiError } from '@/utils/ApiError';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware – verifies JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.startsWith('Bearer ') ? authHeader.split(' ') : [];

    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
      return;
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+roles');
    if (!currentUser) {
      res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
      return;
    }

    // 4. Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      res.status(401).json({
        status: 'fail',
        message: 'User recently changed password. Please log in again.',
      });
      return;
    }

    // 5. Grant access to protected route
    req.user = {
      id: currentUser._id.toString(),
      email: currentUser.email,
      roles: currentUser.roles.map((r) => r.toString()),
    };

    next(); // success path
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
  }
};

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // 1. Check if user exists on request (must come after authenticate)
      if (!req.user) {
        throw new ApiError(403, 'You are not authorized to access this resource');
      }

      // 2. Check if user has any of the allowed roles
      const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        throw new ApiError(403, `Required roles: ${allowedRoles.join(', ')}`);
      }

      // 3. Grant access
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Authorization failed',
        });
      }
    }
  };
};
