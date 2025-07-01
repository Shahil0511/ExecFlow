export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  assignedTo?: string[];
  createdBy: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  editedBy?: string;
  assignedTo?: string[];
  deletedBy?: string;
}

export interface TodoQueryParams {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: "low" | "medium" | "high";
  sortBy?: "createdAt" | "updatedAt" | "title" | "priority" | "dueDate";
  sortOrder?: "asc" | "desc";
}
