import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronDown,
    Menu,
    X,
    Search,
    MessageSquare,
    Calendar,
    HelpCircle
} from 'lucide-react';

interface EAHeaderProps {
    onLogout?: () => void;
    notifications?: number;
    messages?: number;
    upcomingMeetings?: number;
    eaName?: string;
    eaEmail?: string;
    onSearch?: (query: string) => void;
}

export const EAHeader: React.FC<EAHeaderProps> = ({
    onLogout,
    notifications = 0,
    messages = 0,
    upcomingMeetings = 0,
    eaName = "Executive Assistant",
    eaEmail = "ea@example.com",
    onSearch
}) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            console.log('Logout clicked');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
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
                                    className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
                                >
                                    <Briefcase className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">EA Dashboard</h1>
                                    <p className="text-sm text-gray-500 hidden sm:block">Executive Support Portal</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:block flex-1 max-w-md mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tasks, meetings, contacts..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Upcoming Meetings */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Calendar className="w-5 h-5" />
                                {upcomingMeetings > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {upcomingMeetings > 99 ? '99+' : upcomingMeetings}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Messages */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {messages > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {messages > 99 ? '99+' : messages}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Notifications */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

                            {/* Help */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </motion.button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-sm font-medium">{eaName}</div>
                                        <div className="text-xs text-gray-500">{eaEmail}</div>
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
                                                <div className="text-sm font-medium text-gray-800">{eaName}</div>
                                                <div className="text-sm text-gray-500">{eaEmail}</div>
                                            </div>

                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                <User className="w-4 h-4" />
                                                My Profile
                                            </button>

                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                <Settings className="w-4 h-4" />
                                                Settings
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
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                            {/* Search Bar - Mobile */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>

                            {/* Profile Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{eaName}</div>
                                    <div className="text-xs text-gray-500">{eaEmail}</div>
                                </div>
                            </div>

                            {/* Mobile Menu Items */}
                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Calendar className="w-5 h-5" />
                                <span>Meetings</span>
                                {upcomingMeetings > 0 && (
                                    <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {upcomingMeetings > 99 ? '99+' : upcomingMeetings}
                                    </span>
                                )}
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <MessageSquare className="w-5 h-5" />
                                <span>Messages</span>
                                {messages > 0 && (
                                    <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {messages > 99 ? '99+' : messages}
                                    </span>
                                )}
                            </button>

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
                                <HelpCircle className="w-5 h-5" />
                                <span>Help</span>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
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