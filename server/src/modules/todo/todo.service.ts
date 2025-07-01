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
    try {
      console.log('🔵 [Service] Getting todo by ID:', id);

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid todo ID format', 400);
      }

      const todo = await Todo.findOne({
        _id: new Types.ObjectId(id),
        deletedAt: { $exists: false },
      }).populate('createdBy editedBy deletedBy assignedTo');

      if (!todo) {
        throw new AppError('Todo not found', 404);
      }

      console.log('✅ [Service] Todo found successfully');
      return todo;
    } catch (error) {
      console.error('🔴 [Service] Get todo by ID error:', error);
      throw error;
    }
  }

  /* ------------------------------------------------------------------ */
  /** UPDATE */
  async updateTodo(id: string, data: UpdateTodoRequest): Promise<ITodo> {
    try {
      console.log('🔵 [Service] Updating todo:', { id, data });

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid todo ID format', 400);
      }

      // First check if todo exists and is not deleted
      const existingTodo = await Todo.findOne({
        _id: new Types.ObjectId(id),
        deletedAt: { $exists: false },
      });

      if (!existingTodo) {
        throw new AppError('Todo not found or already deleted', 404);
      }

      // Build update data - ONLY include fields that should actually be updated
      const updateData: Record<string, any> = {};

      // Update actual todo fields (not just metadata)
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.completed !== undefined) updateData.completed = data.completed;
      if (data.priority !== undefined) updateData.priority = data.priority;

      // Handle date conversion
      if (data.dueDate !== undefined) {
        updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
      }

      // Handle assignedTo array
      if (data.assignedTo !== undefined) {
        if (Array.isArray(data.assignedTo)) {
          // Validate all assignedTo IDs
          for (const userId of data.assignedTo) {
            if (!Types.ObjectId.isValid(userId)) {
              throw new AppError(`Invalid assignedTo user ID: ${userId}`, 400);
            }
          }
          updateData.assignedTo = data.assignedTo.map((uid) => new Types.ObjectId(uid));
        } else {
          updateData.assignedTo = [];
        }
      }

      // Add metadata fields
      if (data.editedBy) {
        if (!Types.ObjectId.isValid(data.editedBy)) {
          throw new AppError('Invalid editedBy user ID', 400);
        }
        updateData.editedBy = new Types.ObjectId(data.editedBy);
      }

      // Always update the timestamp
      updateData.updatedAt = new Date();

      console.log('🔵 [Service] Final update data:', updateData);

      const todo = await Todo.findOneAndUpdate(
        { _id: new Types.ObjectId(id), deletedAt: { $exists: false } },
        { $set: updateData }, // Use $set to ensure proper update
        { new: true, runValidators: true }
      ).populate('createdBy editedBy deletedBy assignedTo');

      if (!todo) {
        throw new AppError('Todo not found after update', 404);
      }

      console.log('✅ [Service] Todo updated successfully:', {
        id: todo._id,
        title: todo.title,
        completed: todo.completed,
        editedBy: todo.editedBy,
      });

      return todo;
    } catch (error) {
      console.error('🔴 [Service] Update todo error:', error);
      throw error;
    }
  }

  /* ------------------------------------------------------------------ */
  /** SOFT DELETE */
  async deleteTodo(id: string, userId: string): Promise<void> {
    try {
      console.log('🔵 [Service] Soft deleting todo:', { id, userId });

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid todo ID format', 400);
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new AppError('Invalid user ID format', 400);
      }

      // First check if todo exists and is not already deleted
      const existingTodo = await Todo.findOne({
        _id: new Types.ObjectId(id),
        deletedAt: { $exists: false },
      });

      if (!existingTodo) {
        throw new AppError('Todo not found or already deleted', 404);
      }

      const todo = await Todo.findOneAndUpdate(
        { _id: new Types.ObjectId(id), deletedAt: { $exists: false } },
        {
          $set: {
            deletedBy: new Types.ObjectId(userId),
            deletedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!todo) {
        throw new AppError('Failed to delete todo', 500);
      }

      console.log('✅ [Service] Todo soft deleted successfully:', {
        id: todo._id,
        deletedBy: todo.deletedBy,
        deletedAt: todo.deletedAt,
      });
    } catch (error) {
      console.error('🔴 [Service] Delete todo error:', error);
      throw error;
    }
  }

  /* ------------------------------------------------------------------ */
  /** STATS (ignores soft‑deleted items) */
  async getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    byPriority: { low: number; medium: number; high: number };
  }> {
    try {
      console.log('🔵 [Service] Getting todo stats');

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

      const stats = {
        total,
        completed,
        pending: total - completed,
        byPriority: priorityStats,
      };

      console.log('✅ [Service] Stats calculated successfully:', stats);
      return stats;
    } catch (error) {
      console.error('🔴 [Service] Get stats error:', error);
      throw error;
    }
  }
}
