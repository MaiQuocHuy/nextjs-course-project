import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { paymentApi } from "@/services/paymentApi";
import { studentApi } from "@/services/student/studentApi";
import { authSlice, logoutState } from "./slices/auth/authSlice";
import { profileApi } from "@/services/common/profileApi";

// Instructor
import { loadingAnimaSlice } from "./slices/instructor/loadingAnimaSlice";
import { coursesInstSlice } from "@/services/instructor/courses/courses-api";
import { sectionsInstSlice } from "@/services/instructor/courses/sections-api";
import { lessonsInstSlice } from "@/services/instructor/courses/lessons-api";
import { quizzesInstSlice } from "@/services/instructor/courses/quizzes-api";


import courseFilterReducer from "./slices/student/courseFilterSlice";
import { settingsApi } from "@/services/common/settingsApi";
import learningProgressReducer from "./slices/student/learningProgressSlice";
import { geminiApi } from "@/services/quiz/geminiApi";
import { earningsInstSlice } from "@/services/instructor/earnings/earnings-ins-api";

// Middleware to clear all caches on logout
const clearCacheOnLogout = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // If logout action is dispatched, clear all API caches
  if (action.type === logoutState.type || action.type === "auth/logout") {
    store.dispatch(profileApi.util.resetApiState());
    store.dispatch(studentApi.util.resetApiState());
    store.dispatch(paymentApi.util.resetApiState());
    store.dispatch(geminiApi.util.resetApiState());
  }

  return result;
};

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      courseFilter: courseFilterReducer,
      learningProgress: learningProgressReducer,

      [authApi.reducerPath]: authApi.reducer,
      [studentApi.reducerPath]: studentApi.reducer,
      [coursesApi.reducerPath]: coursesApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
      [geminiApi.reducerPath]: geminiApi.reducer,

      // Instructor
      loadingAnima: loadingAnimaSlice.reducer,
      [coursesInstSlice.reducerPath]: coursesInstSlice.reducer,
      [sectionsInstSlice.reducerPath]: sectionsInstSlice.reducer,
      [lessonsInstSlice.reducerPath]: lessonsInstSlice.reducer,
      [quizzesInstSlice.reducerPath]: quizzesInstSlice.reducer,
      [earningsInstSlice.reducerPath]: earningsInstSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        studentApi.middleware,
        paymentApi.middleware,
        profileApi.middleware,
        settingsApi.middleware,
        geminiApi.middleware,
        clearCacheOnLogout,

        // Instructor
        coursesInstSlice.middleware,
        sectionsInstSlice.middleware,
        lessonsInstSlice.middleware,
        quizzesInstSlice.middleware,
        earningsInstSlice.middleware,
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
