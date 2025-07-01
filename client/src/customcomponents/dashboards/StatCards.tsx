import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, ChevronDown, ChevronUp } from 'lucide-react';

interface Stats {
    total: number;
    completed: number;
    pending: number;
    byPriority: {
        low: number;
        medium: number;
        high: number;
    };
}

interface StatsCardProps {
    stats: Stats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
    const [showStats, setShowStats] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-4 md:p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowStats(!showStats)}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-base md:text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <span className="hidden sm:inline">Task Statistics</span>
                    <span className="sm:hidden">Stats</span>
                </h2>
                {showStats ?
                    <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> :
                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                }
            </div>

            <AnimatePresence>
                {showStats && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-3 overflow-hidden"
                    >
                        {/* Main Stats - Mobile: 2 columns, Desktop: 1 column */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:space-y-3 md:gap-0">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Total Tasks:</span>
                                <span className="font-semibold text-gray-800">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Completed:</span>
                                <span className="font-semibold text-green-600">{stats.completed}</span>
                            </div>
                            <div className="flex justify-between items-center col-span-2 md:col-span-1">
                                <span className="text-gray-500 text-sm">Pending:</span>
                                <span className="font-semibold text-yellow-600">{stats.pending}</span>
                            </div>
                        </div>

                        {/* Priority Stats */}
                        <div className="pt-3 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">Priority Breakdown:</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-600 text-sm">High Priority</span>
                                    </div>
                                    <span className="font-semibold text-red-600">{stats.byPriority.high}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-gray-600 text-sm">Medium Priority</span>
                                    </div>
                                    <span className="font-semibold text-yellow-600">{stats.byPriority.medium}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-600 text-sm">Low Priority</span>
                                    </div>
                                    <span className="font-semibold text-green-600">{stats.byPriority.low}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};