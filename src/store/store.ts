import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { paymentApi } from "@/services/paymentApi";
import { studentApi } from "@/services/student/studentApi";
import { authSlice, logoutState } from "./slices/auth/authSlice";
import { profileApi } from "@/services/common/profileApi";

// Middleware to clear all caches on logout
const clearCacheOnLogout = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // If logout action is dispatched, clear all API caches
  if (action.type === logoutState.type || action.type === "auth/logout") {
    store.dispatch(profileApi.util.resetApiState());
    store.dispatch(studentApi.util.resetApiState());
    store.dispatch(paymentApi.util.resetApiState());
  }

  return result;
};
import courseFilterReducer from "./slices/student/courseFilterSlice";
import { settingsApi } from "@/services/common/settingsApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      courseFilter: courseFilterReducer,

      // counter: counterReducer,

      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        studentApi.middleware,
        paymentApi.middleware,
        profileApi.middleware,
        settingsApi.middleware,
        clearCacheOnLogout
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
