import { useState, useEffect } from 'react';
import { motion, } from 'framer-motion';
import { Header } from '../customcomponents/dashboards/Header';
import { StatsCard } from '../customcomponents/dashboards/StatCards';
import { FilterCard } from '../customcomponents/dashboards/FilterCards';
import { TodoCard } from '../customcomponents/dashboards/TodoCard';
import { CreateTodoModal, type NewTodo } from '../customcomponents/dashboards/CreateTodo';
import { todoService, type Todo } from '../services/todo.services';
import { authService } from '../services/auth.service';
import { Plus, X } from 'lucide-react';

export const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        byPriority: { low: 0, medium: 0, high: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        completed: undefined as boolean | undefined,
        priority: undefined as 'low' | 'medium' | 'high' | undefined,
        sortBy: 'createdAt' as 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    // Fetch todos with current filters
    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);

            const query = {
                completed: filters.completed !== undefined ? String(filters.completed) : undefined,
                priority: filters.priority,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                // Optional: Add pagination if needed
                page: "1",
                limit: "1000", // Fetch all todos (adjust if needed)
            };

            // Fetch todos and stats in parallel
            const [todosResponse, statsResponse] = await Promise.all([
                todoService.getTodos(query),
                todoService.getStats(),
            ]);

            // Update todos state
            setTodos(todosResponse.todos);

            // Transform stats to match frontend structure
            setStats({
                total: statsResponse.total,
                completed: statsResponse.completed,
                pending: statsResponse.total - statsResponse.completed, // Calculate pending
                byPriority: statsResponse.byPriority || { low: 0, medium: 0, high: 0 },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch todos");
        } finally {
            setLoading(false);
        }
    };

    // Initial load and filter changes
    useEffect(() => {
        fetchTodos();
    }, [filters]);

    // Create new todo
    const handleCreateTodo = async (newTodo: NewTodo) => {
        try {
            setLoading(true);
            const createdBy = authService.getCurrentUser()?.id;
            if (!createdBy) throw new Error('User not authenticated');

            await todoService.createTodo({
                ...newTodo,
                createdBy
            });

            await fetchTodos();
            setIsCreateModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create todo');
        } finally {
            setLoading(false);
        }
    };

    // Update todo
    const handleUpdateTodo = async (updatedTodo: Todo) => {
        try {
            setLoading(true);
            const editedBy = authService.getCurrentUser()?.id;
            if (!editedBy) throw new Error('User not authenticated');

            await todoService.updateTodo(updatedTodo.id, {
                ...updatedTodo,
                editedBy
            });

            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update todo');
        } finally {
            setLoading(false);
        }
    };

    // Delete todo
    const handleDeleteTodo = async (id: string) => {
        try {
            setLoading(true);
            const deletedBy = authService.getCurrentUser()?.id;
            if (!deletedBy) throw new Error('User not authenticated');

            await todoService.deleteTodo(id, deletedBy);
            await fetchTodos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete todo');
        } finally {
            setLoading(false);
        }
    };

    // Toggle completion status
    const handleToggleComplete = async (todo: Todo) => {
        await handleUpdateTodo({
            ...todo,
            completed: !todo.completed
        });
    };

    // Logout
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header onLogout={handleLogout} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats and Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats Card */}
                    <StatsCard stats={stats} />

                    {/* Filter Card */}
                    <FilterCard
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    {/* Create Todo Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center"
                    >
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Task
                        </button>
                    </motion.div>
                </div>

                {/* Todo List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="absolute top-0 right-0 px-2 py-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-600">No tasks found</h3>
                        <p className="text-gray-500 mt-2">Create your first task to get started</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {todos.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onToggleComplete={handleToggleComplete}
                                onEdit={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))}
                    </motion.div>
                )}
            </main>

            {/* Create Todo Modal */}
            <CreateTodoModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTodo}
                isLoading={loading}
            />
        </div>
    );
};