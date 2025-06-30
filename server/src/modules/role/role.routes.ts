// src/modules/role/role.routes.ts
import { Router } from 'express';
import { RoleController } from './role.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireRole, requirePermission } from '@/middlewares/rbac.middleware';
import { validateBody, validateParams } from '@/middlewares/validation.middleware';
import { createRoleSchema, updateRoleSchema, roleParamsSchema } from './role.validation';

const router = Router();
const roleController = new RoleController();

// 🔐 All role routes require authentication
router.use(authenticate);

// 🌐 GET all roles (paginated) | POST create role
router
  .route('/')
  .get(requirePermission(['role:read']), roleController.getRoles)
  .post(
    requirePermission(['role:write']),
    validateBody(createRoleSchema),
    roleController.createRole
  );

// 🌐 GET all roles (no pagination) — Admins only
router.get('/all', requireRole('Admin'), roleController.getAllRoles);

// 🌐 GET | PUT | DELETE specific role by ID
router
  .route('/:id')
  .get(
    requirePermission(['role:read']),
    validateParams(roleParamsSchema),
    roleController.getRoleById
  )
  .put(
    requirePermission(['role:write']),
    validateParams(roleParamsSchema),
    validateBody(updateRoleSchema),
    roleController.updateRole
  )
  .delete(
    requirePermission(['role:delete']),
    validateParams(roleParamsSchema),
    roleController.deleteRole
  );

// 📦 Export as named route
export { router as roleRoutes };
