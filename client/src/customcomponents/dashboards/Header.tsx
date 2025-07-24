import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, List, Menu, User, Shield, Settings } from 'lucide-react';
import { selectUser, selectIsAdmin, selectIsEA } from '@/redux/slices/authSlice';
import { authService } from '@/services/auth.service';

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const isEA = useSelector(selectIsEA);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getRoleDisplayName = () => {
        if (isAdmin) return 'Admin';
        if (isEA) return 'EA';
        return 'User';
    };

    const getRoleIcon = () => {
        if (isAdmin) return <Shield className="w-4 h-4" />;
        if (isEA) return <Settings className="w-4 h-4" />;
        return <User className="w-4 h-4" />;
    };

    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <List className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden sm:inline">TaskFlow Dashboard</span>
                        <span className="sm:hidden">TaskFlow</span>
                    </h1>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4">
                        {/* User Info */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
                            >
                                {getRoleIcon()}
                                <div className="text-left">
                                    <div className="text-sm font-medium">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className="text-xs opacity-80">{getRoleDisplayName()}</div>
                                </div>
                            </button>

                            {/* Desktop User Dropdown */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border"
                                    >
                                        <div className="p-3 border-b">
                                            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                                            <div className="text-sm text-gray-600">{user?.email}</div>
                                            <div className="text-xs text-purple-600 font-medium mt-1">
                                                {getRoleDisplayName()}
                                            </div>
                                        </div>

                                        {/* Admin/EA specific options */}
                                        {(isAdmin || isEA) && (
                                            <div className="p-2 border-b">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                    Privileges
                                                </div>
                                                {isAdmin && (
                                                    <div className="text-sm text-green-600 flex items-center gap-1">
                                                        <Shield className="w-3 h-3" />
                                                        Full Admin Access
                                                    </div>
                                                )}
                                                {isEA && (
                                                    <div className="text-sm text-blue-600 flex items-center gap-1">
                                                        <Settings className="w-3 h-3" />
                                                        EA Dashboard Access
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="sm:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="sm:hidden mt-3 pt-3 border-t border-white/20"
                        >
                            {/* Mobile User Info */}
                            <div className="mb-3 p-3 bg-white/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    {getRoleIcon()}
                                    <div>
                                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                                        <div className="text-sm opacity-80">{user?.email}</div>
                                    </div>
                                </div>
                                <div className="text-xs bg-white/20 px-2 py-1 rounded inline-block">
                                    {getRoleDisplayName()}
                                </div>
                            </div>

                            {/* Mobile Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};