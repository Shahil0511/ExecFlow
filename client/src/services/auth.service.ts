import axios from "axios";
import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";

// Define a type for the stored user data
interface StoredUser {
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

export const authService = {
  /**
   * Register a new user
   */
  async signUp(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.data) {
        this.storeAuthData(response.data.data);
      }

      return response.data.data;
    } catch (error) {
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
      const response = await api.post("/auth/login", credentials);
      const authData = response.data.data;

      this.storeAuthData(authData);
      return authData;
    } catch (error) {
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
      return response.data.data;
    } catch (error) {
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
   * Store authentication data (tokens + user info)
   */
  storeAuthData(authData: AuthResponse): void {
    if (!authData) return;

    // Store tokens
    if (authData.tokens) {
      this.storeTokens(authData.tokens);
    }

    // Store user data with type conversion
    if (authData.user) {
      this.storeUser({
        id: String(authData.user.id), // Ensure string conversion
        email: authData.user.email,
        firstName: authData.user.firstName,
        lastName: authData.user.lastName,
        roles: authData.user.roles.map((role) => String(role)), // Convert each role to string
      });
    }
  },

  /**
   * Store user data in localStorage
   */
  storeUser(user: StoredUser): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  /**
   * Get stored user data
   */
  getStoredUser(): StoredUser | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    const user = this.getStoredUser();
    return user?.roles || [];
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
   * Clear all authentication data
   */
  clearAuthData(): void {
    this.clearTokens();
    localStorage.removeItem("user");
  },

  /**
   * Store tokens in localStorage and set auth header
   */
  storeTokens(tokens: { access: string; refresh: string }): void {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    this.setAuthHeader(tokens.access);
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  /**
   * Clear tokens from storage and remove auth header
   */
  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
  },

  /**
   * Set authorization header for API requests
   */
  setAuthHeader(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
      const { access } = await this.refreshToken(refreshToken);
      this.storeTokens({ access, refresh: refreshToken });
      return true;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  },
};

// Initialize auth state when this module loads
authService.initializeAuth();
