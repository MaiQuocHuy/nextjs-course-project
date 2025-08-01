import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import counterReducer from "./slices/student/counterSlice";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { studentApi } from "./slices/student/studentApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        studentApi.middleware
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
