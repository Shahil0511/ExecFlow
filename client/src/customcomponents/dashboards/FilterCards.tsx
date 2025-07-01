import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterState {
    completed: boolean | undefined;
    priority: 'low' | 'medium' | 'high' | undefined;
    sortBy: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
    sortOrder: 'asc' | 'desc';
}

interface FilterCardProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

export const FilterCard = ({ filters, onFiltersChange }: FilterCardProps) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            completed: undefined,
            priority: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const activeFiltersCount = [
        filters.completed !== undefined,
        filters.priority !== undefined,
        filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc'
    ].filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-base md:text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Filter className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        <span className="hidden sm:inline">Filters & Sort</span>
                        <span className="sm:hidden">Filters</span>
                    </h2>
                    {activeFiltersCount > 0 && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                    <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Show'}</span>
                    {showFilters ?
                        <ChevronUp className="w-4 h-4" /> :
                        <ChevronDown className="w-4 h-4" />
                    }
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4 overflow-hidden"
                    >
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                value={filters.completed !== undefined ? String(filters.completed) : ''}
                                onChange={(e) => handleFilterChange('completed',
                                    e.target.value === '' ? undefined : e.target.value === 'true'
                                )}
                            >
                                <option value="">All Tasks</option>
                                <option value="false">Pending Only</option>
                                <option value="true">Completed Only</option>
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                value={filters.priority || ''}
                                onChange={(e) => handleFilterChange('priority',
                                    e.target.value === '' ? undefined : e.target.value as 'low' | 'medium' | 'high'
                                )}
                            >
                                <option value="">All Priorities</option>
                                <option value="high">🔴 High Priority</option>
                                <option value="medium">🟡 Medium Priority</option>
                                <option value="low">🟢 Low Priority</option>
                            </select>
                        </div>

                        {/* Sort Options - Mobile: Stacked, Desktop: Side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy',
                                        e.target.value as 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate'
                                    )}
                                >
                                    <option value="createdAt">Created Date</option>
                                    <option value="updatedAt">Updated Date</option>
                                    <option value="title">Title (A-Z)</option>
                                    <option value="priority">Priority Level</option>
                                    <option value="dueDate">Due Date</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                <select
                                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder',
                                        e.target.value as 'asc' | 'desc'
                                    )}
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {activeFiltersCount > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={clearFilters}
                                className="w-full mt-4 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};