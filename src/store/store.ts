import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import counterReducer from "./slices/student/counterSlice";
import { authApi } from '@/services/authApi';
import { coursesApi } from '@/services/coursesApi';
import { authSlice } from './slices/auth/authSlice';

// Instructor
import { coursesInstSlice } from '@/services/instructor/courses-api';
import { loadingAnimaSlice } from './slices/instructor/loadingAnimaSlice';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      loadingAnima: loadingAnimaSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      [coursesInstSlice.reducerPath]: coursesInstSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        coursesInstSlice.middleware
      ),
  });

  // Enable listener behavior for the store
  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
