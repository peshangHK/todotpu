import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../../services/todoService";

// --- THUNKS ---
export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async ({ title, description, priority, userId }, { rejectWithValue }) => {
    try {
      return await addTodo({ title, description, priority, userId });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (userId, { rejectWithValue }) => {
    try {
      return await getTodos(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTodoAction = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateTodo(id, updates);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTodoAction = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteTodo(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SLICE
const todoSlice = createSlice({
  name: "todos",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createTodo
      .addCase(createTodo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // updateTodo
      .addCase(updateTodoAction.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1)
          state.items[index] = { ...state.items[index], ...action.payload };
      })

      // deleteTodo
      .addCase(deleteTodoAction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
