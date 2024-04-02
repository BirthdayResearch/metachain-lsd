import { configureStore } from "@reduxjs/toolkit";
import { marbleFiApi } from "@/app/store/marbleFiApi";

export const store = configureStore({
  reducer: {
    [marbleFiApi.reducerPath]: marbleFiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marbleFiApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
