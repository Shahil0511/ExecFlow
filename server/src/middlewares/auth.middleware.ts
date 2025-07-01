// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { config } from '@/config/env';
// import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[]; // Changed to string[] to match your middleware
      };
    }
  }
}

// src/middlewares/auth.middleware.ts
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new AppError('Authentication token missing', 401);
    }

    // 2. Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      userId(userId: any): unknown;
      id: string;
    };

    // 3. Check if user exists
    const currentUser = await User.findById(decoded.userId); // ✅ works!

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    // 4. Attach user to request
    req.user = {
      id: currentUser._id.toString(),
      email: currentUser.email,
      roles: currentUser.roles.map((role: any) => {
        if (mongoose.isValidObjectId(role)) return role.toString();
        if (typeof role === 'object' && role._id) return role._id.toString();
        return String(role);
      }),
    };

    next();
  } catch (err) {
    console.error('🔴 [authenticate] Error:', err);
    next(err);
  }
};

export const authorize = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role) => req.user?.roles.includes(role));

      if (!hasRequiredRole) {
        throw new AppError(`Required roles: ${requiredRoles.join(', ')}`, 403);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
