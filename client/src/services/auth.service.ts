import axios from "axios";
import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types"; // Assuming you have these types defined
// Assuming you have these types defined

export const authService = {
  async signUp(userData: RegisterRequest): Promise<AuthResponse> {
    console.group("[AUTH] Registration Debug");
    try {
      // Log the payload being sent
      console.log("Sending registration data:", {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: "***", // Mask password in logs
      });

      const response = await api.post("/auth/register", userData);
      console.log("Registration successful, response:", response.data);
      console.groupEnd();
      return response.data.data;
    } catch (error) {
      console.error("Registration failed:");

      if (axios.isAxiosError(error)) {
        // Enhanced error logging
        console.error("HTTP Status:", error.response?.status);
        console.error("Response Data:", error.response?.data);
        console.error("Validation Errors:", error.response?.data?.errors);
        console.error("Request Config:", {
          url: error.config?.url,
          data: error.config?.data,
        });

        // Format better error message
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

        console.groupEnd();
        throw new Error(errorMessage);
      }

      console.groupEnd();
      throw new Error("Registration failed. Please try again later.");
    }
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, tokens } = response.data.data;
      return {
        user,
        tokens,
      };
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

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await api.post("/auth/refresh-token", { refreshToken });
      return response.data;
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

  storeTokens(tokens: { access: string; refresh: string }): void {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    this.setAuthHeader(tokens.access);
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
  },

  setAuthHeader(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
};
