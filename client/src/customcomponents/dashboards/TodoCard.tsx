import { motion } from 'framer-motion';
import { Check, Edit, Trash2, Calendar, User, Clock } from 'lucide-react';

interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    assignedTo?: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface TodoCardProps {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

export const TodoCard = ({ todo, onToggleComplete, onEdit, onDelete }: TodoCardProps) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
    const isDueSoon = todo.dueDate && new Date(todo.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && !todo.completed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${getPriorityColor(todo.priority)} ${todo.completed ? 'opacity-75' : ''}`}
        >
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                            onClick={() => onToggleComplete(todo)}
                            className={`mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-200 ${todo.completed
                                    ? 'bg-green-500 text-white scale-110'
                                    : 'border-2 border-gray-300 hover:border-green-400'
                                }`}
                        >
                            {todo.completed && <Check className="w-3 h-3 md:w-4 md:h-4" />}
                        </button>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-medium text-sm md:text-base break-words ${todo.completed
                                    ? 'line-through text-gray-400'
                                    : 'text-gray-800'
                                }`}>
                                {todo.title}
                            </h3>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 md:gap-2 ml-2">
                        <button
                            onClick={() => onEdit(todo)}
                            className="p-1 md:p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="p-1 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Description */}
                {todo.description && (
                    <p className="text-gray-600 text-sm mb-4 pl-8 md:pl-9 break-words">
                        {todo.description}
                    </p>
                )}

                {/* Tags and Info */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Priority Badge */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(todo.priority)}`}>
                        {todo.priority === 'high' && '🔴'}
                        {todo.priority === 'medium' && '🟡'}
                        {todo.priority === 'low' && '🟢'}
                        <span className="ml-1">{todo.priority}</span>
                    </span>

                    {/* Due Date */}
                    {todo.dueDate && (
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${isOverdue
                                ? 'bg-red-100 text-red-800'
                                : isDueSoon
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                            <Calendar className="w-3 h-3" />
                            <span className="hidden sm:inline">
                                {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                            <span className="sm:hidden">
                                {new Date(todo.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                            {isOverdue && <span className="font-medium">!</span>}
                        </span>
                    )}

                    {/* Assigned Users */}
                    {todo.assignedTo && todo.assignedTo.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            <User className="w-3 h-3" />
                            <span>{todo.assignedTo.length}</span>
                            <span className="hidden sm:inline">
                                {todo.assignedTo.length === 1 ? 'person' : 'people'}
                            </span>
                        </span>
                    )}

                    {/* Time indicators */}
                    {todo.updatedAt && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            <Clock className="w-3 h-3" />
                            <span className="hidden md:inline">Updated:</span>
                            <span>
                                {new Date(todo.updatedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </span>
                    )}
                </div>

                {/* Overdue Warning */}
                {isOverdue && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <p className="text-red-700 text-xs font-medium">
                            ⚠️ This task is overdue!
                        </p>
                    </motion.div>
                )}

                {/* Due Soon Warning */}
                {isDueSoon && !isOverdue && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                        <p className="text-orange-700 text-xs font-medium">
                            ⏰ Due within 24 hours
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};