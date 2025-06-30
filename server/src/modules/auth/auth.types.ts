import { Types } from 'mongoose';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Types.ObjectId[]; // Explicitly use ObjectId[]
}

export interface AuthResponse {
  user: AuthUserResponse;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface TokenPayload {
  userId: string;
  roles: string[]; // Store role IDs as strings in token
  iat: number;
  exp: number;
}
