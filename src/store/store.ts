import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { paymentApi } from "@/services/paymentApi";
import { studentApi } from "@/services/student/studentApi";
import { authSlice } from "./slices/auth/authSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,

      // counter: counterReducer,

      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        studentApi.middleware,
        paymentApi.middleware
      ),
  });

  // Enable listener behavior for the store
  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
