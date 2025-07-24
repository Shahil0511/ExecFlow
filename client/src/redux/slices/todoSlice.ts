import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { todoService } from "@/services/todo.services"; // ⬅️ adjust if the path differs
import type {
  Todo,
  TodoListResponse,
  TodoStats,
} from "@/services/todo.services";
import type { RootState } from "@/redux/store";

/* ---------- Thunks ---------- */

// GET /todo
export const fetchTodos = createAsyncThunk<
  TodoListResponse,
  Parameters<typeof todoService.getTodos>[0] | undefined
>("todos/fetchTodos", async (query, { rejectWithValue }) => {
  try {
    return await todoService.getTodos(query);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// POST /todo
export const createTodo = createAsyncThunk<
  Todo,
  Parameters<typeof todoService.createTodo>[0]
>("todos/createTodo", async (payload, { rejectWithValue }) => {
  try {
    return await todoService.createTodo(payload);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// PUT /todo/:id
export const updateTodo = createAsyncThunk<
  Todo,
  { id: string; data: Parameters<typeof todoService.updateTodo>[1] }
>("todos/updateTodo", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await todoService.updateTodo(id, data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// DELETE /todo/:id
export const deleteTodo = createAsyncThunk<string, string>(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await todoService.deleteTodo(id, "");
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET /todo/stats
export const fetchTodoStats = createAsyncThunk<TodoStats>(
  "todos/fetchTodoStats",
  async (_, { rejectWithValue }) => {
    try {
      return await todoService.getStats();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/* ---------- Slice ---------- */

interface TodoState {
  todos: Todo[];
  total: number;
  page: number;
  totalPages: number;
  stats: TodoStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  total: 0,
  page: 1,
  totalPages: 1,
  stats: null,
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createTodo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // updateTodo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const idx = state.todos.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.todos[idx] = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // fetchTodoStats
      .addCase(fetchTodoStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchTodoStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;

/* ---------- Selectors ---------- */

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectTodoStats = (state: RootState) => state.todos.stats;
export const selectTodoLoading = (state: RootState) => state.todos.loading;
export const selectTodoError = (state: RootState) => state.todos.error;
