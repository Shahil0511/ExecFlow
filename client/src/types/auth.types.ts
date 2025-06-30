// src/types/auth.types.ts
import { Types } from "mongoose";

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Response Types
export interface AuthUserResponse {
  id: Types.ObjectId | string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Types.ObjectId[] | string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: AuthUserResponse;
  tokens: Tokens;
}

export interface RefreshTokenResponse {
  access: string;
}

// Token Payload (for decoding JWT)
export interface TokenPayload {
  userId: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Error Response
export interface AuthErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

// Form Data Types (for UI forms)
export interface LoginFormData extends LoginRequest {
  rememberMe?: boolean;
}

export interface RegisterFormData extends RegisterRequest {
  confirmPassword?: string;
}

// Service Types
export interface AuthService {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  refreshToken: (refreshToken: string) => Promise<RefreshTokenResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUserResponse>;
}

// Context/Store Types
export interface AuthState {
  user: AuthUserResponse | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
