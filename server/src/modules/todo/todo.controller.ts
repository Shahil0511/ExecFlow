import { Request, Response } from 'express';
import { TodoService } from './todo.service';
import { CreateTodoRequest, UpdateTodoRequest, TodoQueryParams } from './todo.types';
import { AppError } from '@/utils/app-error';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  // ✅ CREATE
  createTodo = async (req: Request<{}, {}, CreateTodoRequest>, res: Response): Promise<void> => {
    try {
      console.log('✅ [createTodo] Request body:', req.body);
      console.log('✅ [createTodo] Authenticated user:', req.user);

      if (!req.user) {
        console.log('🔴 [createTodo] No user in request');
        throw new AppError('Unauthorized', 401);
      }

      const todoData = {
        ...req.body,
        createdBy: req.user.id,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      } as CreateTodoRequest;

      console.log('🔵 [createTodo] Processed todo data:', todoData);

      const todo = await this.todoService.createTodo(todoData);

      console.log('🟢 [createTodo] Todo created successfully');
      res.status(201).json({ status: 'success', data: { todo } });
    } catch (err) {
      console.error('🔴 [createTodo] Error:', err);
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError('Failed to create todo', 500);
    }
  };
  // ✅ GET ALL
  getTodos = async (req: Request<{}, {}, {}, TodoQueryParams>, res: Response): Promise<void> => {
    try {
      console.log('route hit');
      const result = await this.todoService.getTodos(req.query);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      throw err;
    }
  };

  // ✅ GET BY ID
  getTodoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const todo = await this.todoService.getTodoById(req.params.id);
      res.status(200).json({ status: 'success', data: { todo } });
    } catch (err) {
      throw err;
    }
  };

  // ✅ UPDATE
  updateTodo = async (
    req: Request<{ id: string }, {}, UpdateTodoRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const editedBy = (req.user as { id: string })?.id;
      if (!editedBy) throw new AppError('Unauthorized', 401);

      const todo = await this.todoService.updateTodo(req.params.id, {
        ...req.body,
        editedBy,
      });

      res.status(200).json({ status: 'success', data: { todo } });
    } catch (err) {
      throw err;
    }
  };

  // ✅ DELETE (Soft Delete)
  deleteTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const deletedBy = (req.user as { id: string })?.id;
      if (!deletedBy) throw new AppError('Unauthorized', 401);

      await this.todoService.deleteTodo(req.params.id, deletedBy);
      res.status(204).send();
    } catch (err) {
      throw err;
    }
  };

  // ✅ STATS
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.todoService.getStats();
      res.status(200).json({ status: 'success', data: { stats } });
    } catch (err) {
      throw err;
    }
  };
}
