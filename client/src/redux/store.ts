import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import todoReducer from "@/redux/slices/todoSlice";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
  },
});

// ✅ Export types here
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
