// src/services/todo.service.ts
import { AppError } from "@/lib/app-error";
import type {
  TodoQueryParams,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo.types";
import api from "./api"; // Import your Axios instance

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
      console.log("🟡 [TodoService] Sending Request:", {
        method,
        url: `${this.basePath}${url}`,
        data,
      });

      const response = await api({
        method,
        url: `${this.basePath}${url}`,
        data,
      });

      console.log("🟢 [TodoService] Response Success:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("🔴 [TodoService] Request Failed:", {
        status: error.response?.status,
        error: error.response?.data,
      });

      throw new AppError(
        error.response?.data?.message || "Request failed",
        error.response?.status || 500
      );
    }
  }

  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    console.log("🟡 [createTodo] Request Data:", data);
    return this.request("POST", "", data);
  }

  async getTodos(
    query: Partial<TodoQueryParams> = {}
  ): Promise<TodoListResponse> {
    const params = new URLSearchParams();
    if (query.completed !== undefined)
      params.append("completed", String(query.completed));
    if (query.priority) params.append("priority", query.priority);
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    const response = await this.request<{ data: TodoListResponse }>("GET", url);
    return response.data; // Extract `data` from the response
  }

  async getTodoById(id: string): Promise<Todo> {
    return this.request("GET", `/${id}`);
  }

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<Todo> {
    return this.request("PUT", `/${id}`, data);
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    await this.request("DELETE", `/${id}`, { deletedBy: userId });
  }

  async getStats(): Promise<TodoStats> {
    return this.request("GET", "/stats");
  }
}

export const todoService = TodoService.getInstance();
