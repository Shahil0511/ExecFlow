import { z } from 'zod';
import { PERMISSIONS } from './role.types';

const permissionValues = Object.values(PERMISSIONS) as [string, ...string[]];

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name cannot exceed 50 characters'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
  permissions: z.array(z.enum(permissionValues)).min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(50, 'Role name cannot exceed 50 characters')
    .optional(),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
  permissions: z
    .array(z.enum(permissionValues))
    .min(1, 'At least one permission is required')
    .optional(),
  isActive: z.boolean().optional(),
});

export const roleParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid role ID'),
});
