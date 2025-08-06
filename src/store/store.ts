<<<<<<< HEAD
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import counterReducer from "./slices/student/counterSlice";
import { authApi } from '@/services/authApi';
import { coursesApi } from '@/services/coursesApi';
import { authSlice } from './slices/auth/authSlice';

// Instructor
import { coursesInstSlice } from '@/services/instructor/courses-api';
import { loadingAnimaSlice } from './slices/instructor/loadingAnimaSlice';
=======
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { paymentApi } from "@/services/paymentApi";
import { studentApi } from "@/services/student/studentApi";
import { authSlice } from "./slices/auth/authSlice";
>>>>>>> bec99807c15d241ec355835e9b6f0398396fba24

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
<<<<<<< HEAD
      loadingAnima: loadingAnimaSlice.reducer,
=======

      // counter: counterReducer,

>>>>>>> bec99807c15d241ec355835e9b6f0398396fba24
      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
<<<<<<< HEAD
      [coursesInstSlice.reducerPath]: coursesInstSlice.reducer,
=======
      [paymentApi.reducerPath]: paymentApi.reducer,
>>>>>>> bec99807c15d241ec355835e9b6f0398396fba24
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
<<<<<<< HEAD
        coursesInstSlice.middleware
=======
        studentApi.middleware,
        paymentApi.middleware
>>>>>>> bec99807c15d241ec355835e9b6f0398396fba24
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
