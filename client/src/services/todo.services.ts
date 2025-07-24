import { AppError } from "@/lib/app-error";
import type {
  TodoQueryParams,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo.types";
import api from "./api";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  assignedTo?: string[];
  createdBy?: string;
  editedBy?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  page: number;
  totalPages: number;
}

export class TodoService {
  private static instance: TodoService;
  private basePath = "/todo";

  private constructor() {}

  public static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await api({
        method,
        url: `${this.basePath}${url}`,
        data,
      });

      return response.data;
    } catch (error: any) {
      throw new AppError(
        error.response?.data?.message || error.message || "Request failed",
        error.response?.status || 500
      );
    }
  }

  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    const response = await this.request<{
      status: string;
      data: { todo: Todo };
    }>("POST", "", data);
    return response.data.todo;
  }

  async getTodos(
    query: Partial<TodoQueryParams> = {}
  ): Promise<TodoListResponse> {
    const params = new URLSearchParams();

    if (query.completed !== undefined) {
      params.append("completed", String(query.completed));
    }
    if (query.priority) params.append("priority", query.priority);
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    const response = await this.request<{
      status: string;
      data: TodoListResponse;
    }>("GET", url);
    return response.data;
  }

  async getTodoById(id: string): Promise<Todo> {
    const response = await this.request<{
      status: string;
      data: { todo: Todo };
    }>("GET", `/${id}`);
    return response.data.todo;
  }

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo> {
    const response = await this.request<{
      status: string;
      data: { todo: Todo };
    }>("PUT", `/${id}`, data);

    return response.data.todo;
  }

  async deleteTodo(id: string, _deletedBy: string): Promise<void> {
    await this.request<void>("DELETE", `/${id}`);
  }

  async getStats(): Promise<TodoStats> {
    const response = await this.request<{
      status: string;
      data: { stats: TodoStats };
    }>("GET", "/stats");
    return response.data.stats;
  }
}

export const todoService = TodoService.getInstance();
