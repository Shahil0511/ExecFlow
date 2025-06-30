// src/middlewares/rbac.middleware.ts
import { Response, NextFunction } from 'express';
import { Role } from '@/modules/role/role.model';
import { AuthenticatedRequest } from './auth.middleware';

/**
 * Middleware: Requires at least one of the specified roles
 */
export const requireRole = (...requiredRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'fail',
          message: 'Unauthorized',
        });
        return;
      }

      const userRoles = await Role.find({
        _id: { $in: req.user.roles },
      });

      const hasRole = userRoles.some((role) => requiredRoles.includes(role.name));

      if (!hasRole) {
        res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to perform this action',
        });
        return;
      }

      return next(); // ✅ Access granted
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error checking roles',
      });
    }
  };
};

/**
 * Middleware: Requires at least one of the specified permissions
 */
export const requirePermission = (requiredPermissions: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'fail',
          message: 'Unauthorized',
        });
        return;
      }

      const userRoles = await Role.find({ _id: { $in: req.user.roles } });

      const allPermissions = userRoles.flatMap((role) => role.permissions ?? []);

      const hasPermission = requiredPermissions.some((permission) =>
        allPermissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({
          status: 'fail',
          message: 'You do not have the required permissions',
        });
        return;
      }

      return next(); // ✅ Access granted
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error checking permissions',
      });
    }
  };
};
