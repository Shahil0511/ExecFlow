import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';

interface AdminHeaderProps {
    onLogout?: () => void;
    notifications?: number;
    adminName?: string;
    adminEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    onLogout,
    notifications = 0,
    adminName = "Admin User",
    adminEmail = "admin@example.com"
}) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            console.log('Logout clicked');
        }
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
                                >
                                    <Shield className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                                    <p className="text-sm text-gray-500 hidden sm:block">Management Portal</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Notifications */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {notifications > 99 ? '99+' : notifications}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Settings */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </motion.button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-sm font-medium">{adminName}</div>
                                        <div className="text-xs text-gray-500">{adminEmail}</div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {/* Profile Dropdown Menu */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="text-sm font-medium text-gray-800">{adminName}</div>
                                                <div className="text-sm text-gray-500">{adminEmail}</div>
                                            </div>

                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                <User className="w-4 h-4" />
                                                Profile Settings
                                            </button>

                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                <Settings className="w-4 h-4" />
                                                Account Settings
                                            </button>

                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-200 shadow-sm"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {/* Profile Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{adminName}</div>
                                    <div className="text-xs text-gray-500">{adminEmail}</div>
                                </div>
                            </div>

                            {/* Mobile Menu Items */}
                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                <span>Notifications</span>
                                {notifications > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications > 99 ? '99+' : notifications}
                                    </span>
                                )}
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </button>

                            <div className="border-t border-gray-200 pt-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Backdrop for profile menu */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                />
            )}
        </>
    );
};