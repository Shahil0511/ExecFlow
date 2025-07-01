// import { useEffect, useState } from "react";
// import { authService } from "../services/auth.service";

// export const useAuth = () => {
//   const [user, setUser] = useState(authService.getStoredUser());
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!authService.getAccessToken()
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       try {
//         const token = authService.getAccessToken();
//         if (token) {
//           // Here you could add an API call to validate the token
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         authService.clearAuthData();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyAuth();
//   }, []);

//   const login = async (credentials: LoginRequest) => {
//     const authData = await authService.login(credentials);
//     setUser(authData.user);
//     setIsAuthenticated(true);
//     return authData;
//   };

//   const register = async (userData: RegisterRequest) => {
//     const authData = await authService.signUp(userData);
//     setUser(authData.user);
//     setIsAuthenticated(true);
//     return authData;
//   };

//   const logout = () => {
//     authService.clearAuthData();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const hasRole = (role: string) => authService.hasRole(role);
//   const hasAnyRole = (roles: string[]) => authService.hasAnyRole(roles);

//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     login,
//     register,
//     logout,
//     hasRole,
//     hasAnyRole,
//   };
// };
