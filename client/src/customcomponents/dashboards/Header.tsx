import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, List, Menu } from 'lucide-react';

interface HeaderProps {
    onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <List className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden sm:inline">TaskFlow Dashboard</span>
                        <span className="sm:hidden">TaskFlow</span>
                    </h1>

                    {/* Desktop Menu */}
                    <button
                        onClick={onLogout}
                        className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                        Logout
                    </button>

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
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsMobileMenuOpen(false);
                                }}
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