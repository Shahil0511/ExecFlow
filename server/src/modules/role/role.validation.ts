// src/modules/role/role.validation.ts
import { z } from 'zod';

// Common validation strings
const nameValidation = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .transform((v) => v.trim());

const descriptionValidation = z
  .string()
  .max(255, 'Description cannot exceed 255 characters')
  .optional();

// Schema for role ID params
export const roleParamsSchema = z.object({
  id: z.string().uuid('Invalid role ID format'),
});

// Schema for creating a role
export const createRoleSchema = z.object({
  name: nameValidation,
  description: descriptionValidation,
  permissions: z
    .array(z.string().min(1, 'Permission cannot be empty'))
    .min(1, 'At least one permission is required'),
});

// Schema for updating a role
export const updateRoleSchema = z
  .object({
    name: nameValidation.optional(),
    description: descriptionValidation,
    permissions: z
      .array(z.string().min(1, 'Permission cannot be empty'))
      .min(1, 'At least one permission is required')
      .optional(),
  })
  .refine(
    (data) => data.name || data.description || data.permissions,
    'At least one field must be provided for update'
  );

// Type exports for TypeScript usage
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type RoleParamsInput = z.infer<typeof roleParamsSchema>;
