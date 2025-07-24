import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice';
import studentsReducer from './slices/studentsSlice';
import earningsReducer from './slices/earningsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    students: studentsReducer,
    earnings: earningsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;