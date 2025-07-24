// src/services/authService.ts
import axios from "axios";
import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";
import { store } from "@/redux/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  refreshTokenSuccess,
} from "@/redux/slices/authSlice";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// Token refresh response type
interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}
const ROLE_MAP: Record<string, string> = {
  "6862b12fde5bf9d99af341a4": "admin",
  "6862b12fde5bf9d99af341a5": "ea",
  // Add more role ID => role name pairs as needed
};

export const authService = {
  /**
   * Register a new user
   */
  async signUp(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      store.dispatch(loginStart());
      const response = await api.post("/auth/register", userData);

      if (response.data.data) {
        const user = response.data.data.user;
        const tokens = response.data.data.tokens;

        // Normalize role IDs to role names
        const mappedRoles = user.roles.map(
          (roleId: string) => ROLE_MAP[roleId] || roleId
        );

        // Dispatch to Redux store
        store.dispatch(
          loginSuccess({
            user: {
              id: String(user.id),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              roles: mappedRoles,
            },
            tokens,
          })
        );

        // Set auth header
        this.setAuthHeader(tokens.access);
      }

      return response.data.data;
    } catch (error) {
      store.dispatch(loginFailure());

      if (axios.isAxiosError(error)) {
        let errorMessage = "Registration failed";

        if (error.response?.data?.errors) {
          errorMessage = Object.entries(error.response.data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join("\n");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        throw new Error(errorMessage);
      }

      throw new Error("Registration failed. Please try again later.");
    }
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      store.dispatch(loginStart());
      const response = await api.post("/auth/login", credentials);
      const authData = response.data.data;

      // Dispatch to Redux store
      store.dispatch(
        loginSuccess({
          user: {
            id: String(authData.user.id),
            email: authData.user.email,
            firstName: authData.user.firstName,
            lastName: authData.user.lastName,
            roles: authData.user.roles.map((id: string) => ROLE_MAP[id] || id),
          },
          tokens: authData.tokens,
        })
      );

      // Set auth header
      this.setAuthHeader(authData.tokens.access);

      return authData;
    } catch (error) {
      store.dispatch(loginFailure());

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
      throw new Error("Login failed. Please try again later.");
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post("/auth/refresh-token", { refreshToken });
      const tokenData = response.data.data;

      // Update Redux store
      store.dispatch(refreshTokenSuccess(tokenData));

      // Update auth header
      this.setAuthHeader(tokenData.access);

      return tokenData;
    } catch (error) {
      // If refresh fails, logout user
      store.dispatch(logoutAction());
      this.clearAuthHeader();

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Token refresh failed. Please login again."
        );
      }
      throw new Error("Token refresh failed. Please try again later.");
    }
  },

  /**
   * Get stored access token from Redux state
   */
  getAccessToken(): string | null {
    const state = store.getState();
    return state.auth.accessToken || localStorage.getItem("accessToken");
  },

  /**
   * Get stored refresh token from Redux state
   */
  getRefreshToken(): string | null {
    const state = store.getState();
    return state.auth.refreshToken || localStorage.getItem("refreshToken");
  },

  /**
   * Get current user from Redux state
   */
  getCurrentUser(): User | null {
    const state = store.getState();
    return state.auth.user;
  },

  /**
   * Get user roles from Redux state
   */
  getUserRoles(): string[] {
    const state = store.getState();
    return state.auth.user?.roles || [];
  },

  /**
   * Check if user has a specific role
   */
  hasRole(roleId: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(roleId);
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.some((role) => userRoles.includes(role));
  },

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole("admin");
  },

  /**
   * Check if user is EA
   */
  isEA(): boolean {
    return this.hasRole("ea");
  },

  /**
   * Check if user is admin or EA
   */
  isAdminOrEA(): boolean {
    return this.hasAnyRole(["admin", "ea"]);
  },

  /**
   * Set authorization header for API requests
   */
  setAuthHeader(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  /**
   * Clear authorization header
   */
  clearAuthHeader(): void {
    delete api.defaults.headers.common["Authorization"];
  },

  /**
   * Initialize auth state when app loads
   */
  initializeAuth(): void {
    const token = this.getAccessToken();
    if (token) {
      this.setAuthHeader(token);
    }
  },

  /**
   * Attempt to refresh the access token automatically
   */
  async attemptAutoRefresh(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      await this.refreshToken(refreshToken);
      return true;
    } catch (error) {
      console.error("Auto refresh failed:", error);
      return false;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed", error);
    } finally {
      // Dispatch logout action to Redux
      store.dispatch(logoutAction());
      // Clear auth header
      this.clearAuthHeader();
    }
  },
};

// Initialize auth state when this module loads
authService.initializeAuth();
