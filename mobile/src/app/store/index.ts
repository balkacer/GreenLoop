import { configureStore } from '@reduxjs/toolkit';
import { greenloopApi } from '../../api/greenloopApi';

export const store = configureStore({
  reducer: {
    [greenloopApi.reducerPath]: greenloopApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      greenloopApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
