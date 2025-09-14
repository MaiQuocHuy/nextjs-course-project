import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/authApi";
import { coursesApi } from "@/services/coursesApi";
import { paymentApi } from "@/services/paymentApi";
import { studentApi } from "@/services/student/studentApi";
import { notificationApi } from "@/services/notificationApi";
import { authSlice, logoutState } from "./slices/auth/authSlice";
import { profileApi } from "@/services/common/profileApi";
import { chatApi } from "@/services/websocket/chatApi";
import { certificateApi } from '@/services/common/certificateApi';

// Instructor
import { loadingAnimaSlice } from "./slices/instructor/loadingAnimaSlice";
import { coursesInstSlice } from "@/services/instructor/courses/courses-api";
import { sectionsInstSlice } from "@/services/instructor/courses/sections-api";
import { lessonsInstSlice } from "@/services/instructor/courses/lessons-api";
import { quizzesInstSlice } from "@/services/instructor/courses/quizzes-api";
import { earningsInstSlice } from "@/services/instructor/earnings/earnings-ins-api";
import { refundsInstSlice } from "@/services/instructor/refunds/refunds-ins-api";
import { dashboardStatsInstSlice } from "@/services/instructor/statistics/dashboard-statistics";
import { studentsInstSlice } from "@/services/instructor/students/students-ins-api";

import courseFilterReducer from "./slices/student/courseFilterSlice";
import { settingsApi } from "@/services/common/settingsApi";
import learningProgressReducer from "./slices/student/learningProgressSlice";
import { geminiApi } from "@/services/quiz/geminiApi";

// Middleware to clear all caches on logout
const clearCacheOnLogout = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // If logout action is dispatched, clear all API caches
  if (action.type === logoutState.type || action.type === "auth/logout") {
    store.dispatch(profileApi.util.resetApiState());
    store.dispatch(studentApi.util.resetApiState());
    store.dispatch(paymentApi.util.resetApiState());
    store.dispatch(notificationApi.util.resetApiState());
    store.dispatch(geminiApi.util.resetApiState());
    store.dispatch(chatApi.util.resetApiState());
    store.dispatch(certificateApi.util.resetApiState());
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
      [notificationApi.reducerPath]: notificationApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
      [geminiApi.reducerPath]: geminiApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [certificateApi.reducerPath]: certificateApi.reducer,

      // Instructor
      loadingAnima: loadingAnimaSlice.reducer,
      [coursesInstSlice.reducerPath]: coursesInstSlice.reducer,
      [sectionsInstSlice.reducerPath]: sectionsInstSlice.reducer,
      [lessonsInstSlice.reducerPath]: lessonsInstSlice.reducer,
      [quizzesInstSlice.reducerPath]: quizzesInstSlice.reducer,
      [earningsInstSlice.reducerPath]: earningsInstSlice.reducer,
      [refundsInstSlice.reducerPath]: refundsInstSlice.reducer,
      [dashboardStatsInstSlice.reducerPath]: dashboardStatsInstSlice.reducer,
      [studentsInstSlice.reducerPath]: studentsInstSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        coursesApi.middleware,
        studentApi.middleware,
        paymentApi.middleware,
        notificationApi.middleware,
        profileApi.middleware,
        settingsApi.middleware,
        geminiApi.middleware,
        chatApi.middleware,
        certificateApi.middleware,
        clearCacheOnLogout,

        // Instructor
        coursesInstSlice.middleware,
        sectionsInstSlice.middleware,
        lessonsInstSlice.middleware,
        quizzesInstSlice.middleware,
        earningsInstSlice.middleware,
        refundsInstSlice.middleware,
        dashboardStatsInstSlice.middleware,
        studentsInstSlice.middleware
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
