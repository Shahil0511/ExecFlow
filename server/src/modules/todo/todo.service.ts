import { Types } from 'mongoose';
import { Todo } from './todo.model';
import { ITodo, CreateTodoRequest, UpdateTodoRequest, TodoQueryParams } from './todo.types';
import { AppError } from '@/utils/app-error';

export class TodoService {
  /* ------------------------------------------------------------------ */
  /** CREATE */
  async createTodo(data: CreateTodoRequest): Promise<ITodo> {
    const todoData = {
      ...data,
      createdBy: new Types.ObjectId(data.createdBy),
      assignedTo: data.assignedTo?.map((id) => new Types.ObjectId(id)) ?? [],
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    const todo = new Todo(todoData);
    return await todo.save();
  }

  /* ------------------------------------------------------------------ */
  /** GET + PAGINATE */
  async getTodos(query: TodoQueryParams): Promise<{
    todos: ITodo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '10', 10);
    const skip = (page - 1) * limit;

    /* ---------- build filter ---------- */
    const filter: Record<string, any> = { deletedAt: { $exists: false } };
    if (query.completed !== undefined) filter.completed = query.completed;
    if (query.priority) filter.priority = query.priority;

    /* ---------- build sort ---------- */
    const sortField = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy editedBy deletedBy assignedTo')
        .exec(),
      Todo.countDocuments(filter),
    ]);

    return {
      todos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /* ------------------------------------------------------------------ */
  /** GET BY ID */
  async getTodoById(id: string): Promise<ITodo> {
    const todo = await Todo.findOne({
      _id: id,
      deletedAt: { $exists: false },
    }).populate('createdBy editedBy deletedBy assignedTo');

    if (!todo) throw new AppError('Todo not found', 404);
    return todo;
  }

  /* ------------------------------------------------------------------ */
  /** UPDATE */
  async updateTodo(id: string, data: UpdateTodoRequest): Promise<ITodo> {
    const updateData: Record<string, any> = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    if (data.editedBy) updateData.editedBy = new Types.ObjectId(data.editedBy);
    if (data.assignedTo)
      updateData.assignedTo = data.assignedTo.map((uid) => new Types.ObjectId(uid));

    const todo = await Todo.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy editedBy deletedBy assignedTo');

    if (!todo) throw new AppError('Todo not found', 404);
    return todo;
  }

  /* ------------------------------------------------------------------ */
  /** SOFT DELETE */
  async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, deletedAt: { $exists: false } },
      {
        deletedBy: new Types.ObjectId(userId),
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!todo) throw new AppError('Todo not found', 404);
  }

  /* ------------------------------------------------------------------ */
  /** STATS (ignores soft‑deleted items) */
  async getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    byPriority: { low: number; medium: number; high: number };
  }> {
    const matchActive = { deletedAt: { $exists: false } };

    const [total, completed, byPriority] = await Promise.all([
      Todo.countDocuments(matchActive),
      Todo.countDocuments({ ...matchActive, completed: true }),
      Todo.aggregate([
        { $match: matchActive },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const priorityStats = byPriority.reduce(
      (acc, item) => {
        acc[item._id as keyof typeof acc] = item.count;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    return {
      total,
      completed,
      pending: total - completed,
      byPriority: priorityStats,
    };
  }
}
