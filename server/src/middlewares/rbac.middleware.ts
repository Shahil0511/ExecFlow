// src/middlewares/rbac.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Role } from '@/modules/role/role.model';

/**
 * Middleware: Requires at least one of the specified roles
 */
export const requireRole = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Temporary type assertion for req.user
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          status: 'fail',
          message: 'Unauthorized',
        });
      }

      const userRoles = await Role.find({
        _id: { $in: user.roles },
      });

      const hasRole = userRoles.some((role) => requiredRoles.includes(role.name));

      if (!hasRole) {
        res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to perform this action',
        });
      }

      next(); // ✅ Access granted
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
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Temporary type assertion for req.user
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          status: 'fail',
          message: 'Unauthorized',
        });
      }

      const userRoles = await Role.find({ _id: { $in: user.roles } });
      const allPermissions = userRoles.flatMap((role) => role.permissions ?? []);

      const hasPermission = requiredPermissions.some((permission) =>
        allPermissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({
          status: 'fail',
          message: 'You do not have the required permissions',
        });
      }

      next(); // ✅ Access granted
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error checking permissions',
      });
    }
  };
};
