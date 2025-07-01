// src/modules/todo/todo.routes.ts
import { Router } from 'express';
import { TodoController } from './todo.controller';
import { validateBody, validateParams, validateQuery } from '@/middlewares/validation.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
  todoQuerySchema,
} from './todo.validation';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();
const todoController = new TodoController();

// SIMPLIFIED ROUTES (no regex in paths)
router.get('/stats', todoController.getStats);

router
  .route('/')
  .get(authenticate, validateQuery(todoQuerySchema), todoController.getTodos)
  .post(authenticate, validateBody(createTodoSchema), todoController.createTodo);

router
  .route('/:id') // No regex pattern here
  .get(validateParams(todoParamsSchema), todoController.getTodoById)
  .put(validateParams(todoParamsSchema), validateBody(updateTodoSchema), todoController.updateTodo)
  .delete(validateParams(todoParamsSchema), todoController.deleteTodo);

export { router as todoRoutes };
