import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/services/authApi';
import { coursesApi } from '@/services/coursesApi';
import { paymentApi } from '@/services/paymentApi';
import { studentApi } from '@/services/student/studentApi';
import { authSlice } from './slices/auth/authSlice';
// Instructor
import { coursesInstSlice } from '@/services/instructor/courses-api';
import { loadingAnimaSlice } from './slices/instructor/loadingAnimaSlice';
import { geminiApi } from '@/services/quiz/geminiApi';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      loadingAnima: loadingAnimaSlice.reducer,
      [coursesInstSlice.reducerPath]: coursesInstSlice.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [geminiApi.reducerPath]: geminiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        coursesInstSlice.middleware,
        studentApi.middleware,
        paymentApi.middleware,
        geminiApi.middleware,
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
