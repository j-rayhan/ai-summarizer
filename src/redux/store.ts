import { configureStore } from '@reduxjs/toolkit'
import { articleApi } from './services/article'

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch