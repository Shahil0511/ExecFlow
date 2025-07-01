import { z } from 'zod';

// 🔵 Create Todo Schema
export const createTodoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  assignedTo: z.array(z.string()).optional(),
  createdBy: z.string(),
});
// 🟡 Update Todo Schema
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Due date must be a valid ISO datetime string')
    .optional(),
  assignedTo: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  editedBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  deletedBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

// 🔴 Param Schema (for /todos/:id)
export const todoParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid todo ID'),
});

// 🟣 Query Params Schema
export const todoQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'Page must be a positive integer',
    })
    .optional(),

  limit: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    })
    .optional(),

  completed: z
    .string()
    .refine((val) => ['true', 'false'].includes(val), {
      message: "Completed must be 'true' or 'false'",
    })
    .transform((val) => val === 'true')
    .optional(),

  priority: z.enum(['low', 'medium', 'high']).optional(),

  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'dueDate']).optional(),

  sortOrder: z.enum(['asc', 'desc']).optional(),
});
