import { configureStore } from "@reduxjs/toolkit";
import { marbleFiApi } from "@/store/marbleFiApi";
import { stats } from "@/store/stats";

export const store = configureStore({
  reducer: {
    stats: stats.reducer,
    [marbleFiApi.reducerPath]: marbleFiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marbleFiApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
