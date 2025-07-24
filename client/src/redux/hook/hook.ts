import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth hooks
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () =>
  useAppSelector((state) => state.auth.isAuthenticated);
export const useUserRoles = () =>
  useAppSelector((state) => state.auth.user?.roles || []);
export const useIsAdmin = () =>
  useAppSelector((state) => state.auth.user?.roles?.includes("admin") || false);
export const useIsEA = () =>
  useAppSelector((state) => state.auth.user?.roles?.includes("ea") || false);
export const useIsAdminOrEA = () => {
  const roles = useUserRoles();
  return roles.includes("admin") || roles.includes("ea");
};
