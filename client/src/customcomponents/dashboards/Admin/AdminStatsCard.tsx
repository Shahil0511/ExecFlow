import React from 'react';
import { motion } from 'framer-motion';

interface AdminStatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
    title,
    value,
    icon,
    color,
    subtitle,
    trend
}) => {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue':
                return {
                    bg: 'from-blue-500 to-blue-600',
                    iconBg: 'bg-blue-100',
                    iconText: 'text-blue-600',
                    accent: 'bg-blue-500'
                };
            case 'green':
                return {
                    bg: 'from-green-500 to-green-600',
                    iconBg: 'bg-green-100',
                    iconText: 'text-green-600',
                    accent: 'bg-green-500'
                };
            case 'purple':
                return {
                    bg: 'from-purple-500 to-purple-600',
                    iconBg: 'bg-purple-100',
                    iconText: 'text-purple-600',
                    accent: 'bg-purple-500'
                };
            case 'orange':
                return {
                    bg: 'from-orange-500 to-orange-600',
                    iconBg: 'bg-orange-100',
                    iconText: 'text-orange-600',
                    accent: 'bg-orange-500'
                };
            case 'red':
                return {
                    bg: 'from-red-500 to-red-600',
                    iconBg: 'bg-red-100',
                    iconText: 'text-red-600',
                    accent: 'bg-red-500'
                };
            case 'indigo':
                return {
                    bg: 'from-indigo-500 to-indigo-600',
                    iconBg: 'bg-indigo-100',
                    iconText: 'text-indigo-600',
                    accent: 'bg-indigo-500'
                };
            default:
                return {
                    bg: 'from-gray-500 to-gray-600',
                    iconBg: 'bg-gray-100',
                    iconText: 'text-gray-600',
                    accent: 'bg-gray-500'
                };
        }
    };

    const colorClasses = getColorClasses(color);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses.bg}`} />

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-lg ${colorClasses.iconBg} ${colorClasses.iconText} group-hover:scale-110 transition-transform duration-200`}>
                                {icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-3xl font-bold text-gray-800"
                            >
                                {value.toLocaleString()}
                            </motion.span>

                            {trend && (
                                <span className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <svg
                                        className={`w-4 h-4 mr-1 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </div>
        </motion.div>
    );
};