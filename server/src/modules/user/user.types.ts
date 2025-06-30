// src/modules/user/user.types.ts
import { Document, Types } from 'mongoose';
import { IRole } from '@/modules/role/role.types';
import { HydratedDocument } from 'mongoose';

export type IUserDoc = HydratedDocument<IUser>;

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Types.ObjectId[] | IRole[];
  isActive: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date; // ✅ Add this field
  createdAt: Date;
  updatedAt: Date;

  // ✅ Add required instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  getFullName(): string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: Types.ObjectId[] | string[];
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserQueryParams {
  page?: string;
  limit?: string;
  isActive?: string;
  role?: string;
  search?: string;
}
