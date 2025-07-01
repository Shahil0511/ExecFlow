import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Flag } from 'lucide-react';

export interface NewTodo {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assignedTo: string[];
}

export interface CreateTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (todo: NewTodo) => void;
    isLoading?: boolean;
}

export const CreateTodoModal = ({ isOpen, onClose, onSubmit, isLoading = false }: CreateTodoModalProps) => {
    const [formData, setFormData] = useState<NewTodo>({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: []
    });

    const [errors, setErrors] = useState<Partial<Record<keyof NewTodo, string>>>({});

    const handleInputChange = (field: keyof NewTodo, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof NewTodo, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (formData.dueDate) {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🟡 [Modal] Submit triggered");
        if (validateForm()) {
            console.log("🟢 [Modal] Valid formData:", formData);
            onSubmit(formData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                assignedTo: []
            });
            setErrors({});
        } else {
            console.warn("🔴 [Modal] Validation failed:", errors);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            assignedTo: []
        });
        setErrors({});
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-md"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title*
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Task title"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Task description"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Priority Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['low', 'medium', 'high'] as const).map((priority) => (
                                            <button
                                                key={priority}
                                                type="button"
                                                className={`p-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${formData.priority === priority
                                                    ? priority === 'high'
                                                        ? 'bg-red-100 border-red-500 text-red-800'
                                                        : priority === 'medium'
                                                            ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                                                            : 'bg-green-100 border-green-500 text-green-800'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleInputChange('priority', priority)}
                                            >
                                                <Flag className="w-4 h-4" />
                                                <span className="capitalize">{priority}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Due Date Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.dueDate ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            value={formData.dueDate}
                                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        />
                                        <Calendar className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                                    </div>
                                    {errors.dueDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                                    )}
                                </div>

                                {/* Assigned To Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign To (Coming Soon)
                                    </label>
                                    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        <span>Team assignment feature coming soon</span>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !formData.title.trim()}
                                        className={`px-4 py-2 rounded-lg text-white ${isLoading || !formData.title.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-700'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin">↻</span>
                                                Creating...
                                            </span>
                                        ) : (
                                            'Create Task'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}