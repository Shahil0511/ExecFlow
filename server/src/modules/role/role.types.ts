import { Document, Types } from 'mongoose';

// Base interface for role properties (without Document properties)
export interface IRole {
  _id?: Types.ObjectId | string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Document interface that properly extends Mongoose Document
export interface RoleDocument extends Document<Types.ObjectId>, IRole {
  // Mongoose adds these automatically:
  _id: Types.ObjectId;
  __v?: number;
}

// For creating new roles (request DTO)
export interface CreateRoleRequest extends Omit<IRole, 'createdAt' | 'updatedAt'> {
  _id?: Types.ObjectId | string;
}

// For updating roles (request DTO)
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

// Permission constants
export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Role permissions
  ROLE_READ: 'role:read',
  ROLE_WRITE: 'role:write',
  ROLE_DELETE: 'role:delete',
  ROLE_MANAGE: 'role:manage',

  // Todo permissions
  TODO_READ: 'todo:read',
  TODO_WRITE: 'todo:write',
  TODO_DELETE: 'todo:delete',
  TODO_MANAGE: 'todo:manage',

  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_CONFIG: 'system:config',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Additional utility types
export type RoleWithPermissions = RoleDocument & {
  permissions: Permission[];
};
