import { Document, Types } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  // Audit fields
  createdBy: Types.ObjectId;
  editedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;

  // Assignment
  assignedTo: Types.ObjectId[]; // multiple user IDs

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string[];
  createdBy: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  editedBy?: string;
  assignedTo?: string[];
  deletedBy?: string;
}

export interface TodoQueryParams {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
