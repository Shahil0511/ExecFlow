import { z } from 'zod';

// 🔐 Register Schema (already present)
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .transform((v) => v.trim()),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .transform((v) => v.trim()),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .transform((v) => v.trim().toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
});

// 🔐 Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .transform((v) => v.trim().toLowerCase()),

  password: z.string().min(1, 'Password is required'),
});

// 🔐 Refresh Token Schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
