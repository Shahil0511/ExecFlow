// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { EAHeader } from '../customcomponents/dashboards/EA/EAHeader';
// import { EAStatsCard } from '../customcomponents/dashboards/EAStatsCard';
// import { TaskAnalyticsCard } from '../customcomponents/dashboards/TaskAnalyticsCard';
// import { TeamOverviewCard } from '../customcomponents/dashboards/TeamOverviewCard';
// import { TodoCard } from '../customcomponents/dashboards/TodoCard';
// import { CreateTodoModal, type NewTodo } from '../customcomponents/dashboards/CreateTodo';
// import { EditTodoModal } from '../customcomponents/dashboards/EditTodo';
// import { todoService, type Todo } from '../services/todo.services';
// // import { teamService } from '../services/team.service';
// import { authService } from '../services/auth.service';
// import { Plus, X, TrendingUp, Users, ClipboardList, Calendar } from 'lucide-react';

// export const EADashboard = () => {
//     const [todos, setTodos] = useState<Todo[]>([]);
//     const [editTodo, setEditTodo] = useState<Todo | null>(null);
//     const [stats, setStats] = useState({
//         total: 0,
//         completed: 0,
//         pending: 0,
//         byPriority: { low: 0, medium: 0, high: 0 }
//     });
//     const [teamStats, setTeamStats] = useState({
//         totalMembers: 0,
//         activeMembers: 0,
//         completionRate: 0,
//         avgTasksPerMember: 0
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'analytics' | 'team'>('overview');
//     const [filters, setFilters] = useState({
//         completed: undefined as boolean | undefined,
//         priority: undefined as 'low' | 'medium' | 'high' | undefined,
//         sortBy: 'createdAt' as 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate',
//         sortOrder: 'desc' as 'asc' | 'desc'
//     });

//     // Fetch EA data
//     const fetchEAData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const query = {
//                 completed: filters.completed !== undefined ? String(filters.completed) : undefined,
//                 priority: filters.priority,
//                 sortBy: filters.sortBy,
//                 sortOrder: filters.sortOrder,
//                 page: "1",
//                 limit: "1000",
//             };

//             // Fetch team-related data
//             const [todosResponse, statsResponse, teamStatsResponse] = await Promise.all([
//                 todoService.getTeamTodos(query), // EA can see team todos
//                 todoService.getTeamStats(), // Team stats for EA
//                 teamService.getTeamStats(), // Team member statistics
//             ]);

//             setTodos(todosResponse.todos);
//             setStats({
//                 total: statsResponse.total,
//                 completed: statsResponse.completed,
//                 pending: statsResponse.total - statsResponse.completed,
//                 byPriority: statsResponse.byPriority || { low: 0, medium: 0, high: 0 },
//             });
//             setTeamStats(teamStatsResponse);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : "Failed to fetch EA data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEAData();
//     }, [filters]);

//     // Create new todo
//     const handleCreateTodo = async (newTodo: NewTodo) => {
//         try {
//             setLoading(true);
//             const createdBy = authService.getCurrentUser()?.id;
//             if (!createdBy) throw new Error('User not authenticated');

//             await todoService.createTodo({
//                 ...newTodo,
//                 createdBy
//             });

//             await fetchEAData();
//             setIsCreateModalOpen(false);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to create todo');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle edit todo
//     const handleOpenEditModal = (todo: Todo) => {
//         setEditTodo(todo);
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setEditTodo(null);
//         setIsEditModalOpen(false);
//     };

//     const handleEditTodoSubmit = async (updatedTodo: Partial<Todo>) => {
//         if (!editTodo) return;

//         try {
//             setLoading(true);
//             const editedBy = authService.getCurrentUser()?.id;
//             if (!editedBy) throw new Error('User not authenticated');

//             const todoToUpdate = {
//                 ...editTodo,
//                 ...updatedTodo,
//                 editedBy
//             };

//             await todoService.updateTodo(editTodo.id, todoToUpdate);
//             await fetchEAData();
//             handleCloseEditModal();
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to update todo');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete todo (EA can delete team todos)
//     const handleDeleteTodo = async (id: string) => {
//         try {
//             setLoading(true);
//             const deletedBy = authService.getCurrentUser()?.id;
//             if (!deletedBy) throw new Error('User not authenticated');

//             await todoService.deleteTodo(id, deletedBy);
//             await fetchEAData();
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to delete todo');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Toggle completion
//     const handleToggleComplete = async (todo: Todo) => {
//         try {
//             setLoading(true);
//             const editedBy = authService.getCurrentUser()?.id;
//             if (!editedBy) throw new Error('User not authenticated');

//             await todoService.updateTodo(todo.id, {
//                 ...todo,
//                 completed: !todo.completed,
//                 editedBy
//             });

//             await fetchEAData();
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to update todo');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'overview':
//                 return (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         <EAStatsCard
//                             title="Team Tasks"
//                             value={stats.total}
//                             icon={<ClipboardList className="w-6 h-6" />}
//                             color="blue"
//                             subtitle={`${stats.completed} completed`}
//                         />
//                         <EAStatsCard
//                             title="Team Members"
//                             value={teamStats.totalMembers}
//                             icon={<Users className="w-6 h-6" />}
//                             color="green"
//                             subtitle={`${teamStats.activeMembers} active`}
//                         />
//                         <EAStatsCard
//                             title="Completion Rate"
//                             value={`${teamStats.completionRate}%`}
//                             icon={<TrendingUp className="w-6 h-6" />}
//                             color="purple"
//                             subtitle="This month"
//                         />
//                         <EAStatsCard
//                             title="Avg Tasks/Member"
//                             value={teamStats.avgTasksPerMember}
//                             icon={<Calendar className="w-6 h-6" />}
//                             color="orange"
//                             subtitle="Active tasks"
//                         />
//                     </div>
//                 );
//             case 'tasks':
//                 return (
//                     <div>
//                         <div className="mb-6 flex justify-between items-center">
//                             <h2 className="text-2xl font-bold text-gray-800">Team Tasks</h2>
//                             <button
//                                 onClick={() => setIsCreateModalOpen(true)}
//                                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
//                             >
//                                 <Plus className="w-4 h-4" />
//                                 Assign Task
//                             </button>
//                         </div>
//                         {todos.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <h3 className="text-lg font-medium text-gray-600">No team tasks found</h3>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {todos.map((todo) => (
//                                     <TodoCard
//                                         key={todo.id}
//                                         todo={todo}
//                                         onToggleComplete={handleToggleComplete}
//                                         onEdit={handleOpenEditModal}
//                                         onDelete={handleDeleteTodo}
//                                         isEA={true}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 );
//             case 'analytics':
//                 return <TaskAnalyticsCard stats={stats} teamStats={teamStats} />;
//             case 'team':
//                 return <TeamOverviewCard teamStats={teamStats} onRefresh={fetchEAData} />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <EAHeader />

//             <main className="container mx-auto px-4 py-8">
//                 {/* Tab Navigation */}
//                 <div className="mb-8">
//                     <div className="border-b border-gray-200">
//                         <nav className="-mb-px flex space-x-8">
//                             {[
//                                 { id: 'overview', label: 'Overview', icon: TrendingUp },
//                                 { id: 'tasks', label: 'Team Tasks', icon: ClipboardList },
//                                 { id: 'analytics', label: 'Analytics', icon: TrendingUp },
//                                 { id: 'team', label: 'Team', icon: Users },
//                             ].map((tab) => {
//                                 const Icon = tab.icon;
//                                 return (
//                                     <button
//                                         key={tab.id}
//                                         onClick={() => setActiveTab(tab.id as any)}
//                                         className={`${activeTab === tab.id
//                                             ? 'border-blue-500 text-blue-600'
//                                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                             } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
//                                     >
//                                         <Icon className="w-4 h-4" />
//                                         {tab.label}
//                                     </button>
//                                 );
//                             })}
//                         </nav>
//                     </div>
//                 </div>

//                 {/* Error Display */}
//                 {error && (
//                     <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//                         {error}
//                         <button
//                             onClick={() => setError(null)}
//                             className="absolute top-0 right-0 px-2 py-1"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                     </div>
//                 )}

//                 {/* Loading State */}
//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         {renderTabContent()}
//                     </motion.div>
//                 )}
//             </main>

//             {/* Modals */}
//             <CreateTodoModal
//                 isOpen={isCreateModalOpen}
//                 onClose={() => setIsCreateModalOpen(false)}
//                 onSubmit={handleCreateTodo}
//                 isLoading={loading}
//             />

//             {editTodo && (
//                 <EditTodoModal
//                     isOpen={isEditModalOpen}
//                     onClose={handleCloseEditModal}
//                     onSubmit={handleEditTodoSubmit}
//                     todo={editTodo}
//                     isLoading={loading}
//                 />
//             )}
//         </div>
//     );
// };