---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - redux-toolkit
  - redux
  - state-management
  - tutorial
  - reference
authors:
  - semih
---

# Redux Toolkit Tutorial Reference: The Smallest Practical Path

This is a compact, revisit-friendly tutorial for Redux Toolkit (RTK). It focuses on the shortest path to a real app with predictable state. It is written for JavaScript learners who want a clear, repeatable reference.

<!-- more -->

## 1) Recommended Learning Order

The RTK docs point to the Redux core tutorials as the primary source for learning Redux with RTK. Use this order:

1) RTK Quick Start
2) Redux Essentials (real-world example)
3) Redux Fundamentals (how Redux works under the hood)

## 2) Minimal Store Setup

Use `configureStore` and pass reducers as a map. This gives you good defaults and a single entry point for middleware.

```js
import { configureStore } from "@reduxjs/toolkit"
import todosReducer from "./features/todos/todosSlice"

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})
```

## 3) Slice First, Actions Later

Create a slice to own state, reducers, and auto-generated actions.

```js
import { createSlice } from "@reduxjs/toolkit"

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [] },
  reducers: {
    added(state, action) {
      state.items.push(action.payload)
    },
    toggled(state, action) {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
  },
})

export const { added, toggled } = todosSlice.actions
export default todosSlice.reducer
```

## 4) Async with `createAsyncThunk`

Use `createAsyncThunk` for common async flows and handle pending/fulfilled/rejected in `extraReducers`.

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchTodos = createAsyncThunk("todos/fetch", async (api) => {
  return api.listTodos()
})

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.status = "failed"
      })
  },
})
```

## 5) RTK Query When Data Fetching Dominates

If most of your complexity is data fetching, RTK Query is the recommended path. Treat it as your data layer and keep UI state local.

## 6) TypeScript Path

RTK docs include a TypeScript quick start and patterns for typed `dispatch`, `getState`, and hooks. Use those templates rather than inventing your own.

## References

- [Redux Toolkit Tutorials Overview](https://redux-toolkit.js.org/tutorials/overview)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [Redux Fundamentals Tutorial](https://redux.js.org/tutorials/fundamentals/part-1-overview)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)

## Further Reading

- [React tutorial: production-ready patterns](react-production-patterns.md)
- [React state and data flow tutorial](react-state-data-flow-tutorial.md)
- [Thinking in React tutorial](thinking-in-react-tutorial.md)
- [TypeScript React handbook notes](typescript-react-handbook-notes.md)
