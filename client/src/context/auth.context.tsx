// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authService } from '../services/auth.service';
// import { useNavigate } from 'react-router-dom';

// interface AuthContextType {
//     user: { id: string; email: string; firstName: string; lastName: string; roles: string[] } | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     login: (credentials: { email: string; password: string }) => Promise<void>;
//     register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
//     logout: () => void;
//     hasRole: (role: string) => boolean;
//     hasAnyRole: (roles: string[]) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState(authService.getStoredUser());
//     const [isAuthenticated, setIsAuthenticated] = useState(!!authService.getAccessToken());
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const verifyToken = async () => {
//             try {
//                 const token = authService.getAccessToken();
//                 if (token) {
//                     // Here you might want to add an API call to validate the token
//                     setIsAuthenticated(true);
//                 }
//             } catch (error) {
//                 authService.clearAuthData();
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         verifyToken();
//     }, []);

//     const login = async (credentials: { email: string; password: string }) => {
//         try {
//             const authData = await authService.login(credentials);
//             setUser(authData.user);
//             setIsAuthenticated(true);
//             navigate('/dashboard');
//         } catch (error) {
//             throw error;
//         }
//     };

//     const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
//         try {
//             const authData = await authService.signUp(userData);
//             setUser(authData.user);
//             setIsAuthenticated(true);
//             navigate('/dashboard');
//         } catch (error) {
//             throw error;
//         }
//     };

//     const logout = () => {
//         authService.clearAuthData();
//         setUser(null);
//         setIsAuthenticated(false);
//         navigate('/login');
//     };

//     const hasRole = (role: string) => {
//         return user?.roles.includes(role) || false;
//     };

//     const hasAnyRole = (roles: string[]) => {
//         return roles.some(role => user?.roles.includes(role)) || false;
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 isAuthenticated,
//                 isLoading,
//                 login,
//                 register,
//                 logout,
//                 hasRole,
//                 hasAnyRole
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };