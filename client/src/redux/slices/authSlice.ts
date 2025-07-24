import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialState = (): AuthState => {
  // Use consistent keys with authService
  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");
  const storedRefreshToken = localStorage.getItem("refreshToken");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccessToken || null,
    refreshToken: storedRefreshToken || null,
    isAuthenticated: !!(storedUser && storedAccessToken),
    isLoading: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: {
          access: string;
          refresh: string;
        };
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.access;
      state.refreshToken = action.payload.tokens.refresh;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store in localStorage with consistent keys
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.tokens.access);
      localStorage.setItem("refreshToken", action.payload.tokens.refresh);
    },
    loginFailure: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ access: string; refresh?: string }>
    ) => {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
        localStorage.setItem("refreshToken", action.payload.refresh);
      }
      localStorage.setItem("accessToken", action.payload.access);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRoles = (state: { auth: AuthState }) =>
  state.auth.user?.roles || [];
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.roles?.includes("admin") || false;
export const selectIsEA = (state: { auth: AuthState }) =>
  state.auth.user?.roles?.includes("ea") || false;
