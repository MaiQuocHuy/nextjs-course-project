import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'question' | 'enrollment' | 'payment' | 'review';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  courseId?: string;
  studentId?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: '1',
      type: 'question',
      title: 'New Question',
      message: 'Sarah Johnson asked a question in Advanced React Development',
      timestamp: '2024-03-15T10:30:00Z',
      read: false,
      courseId: '1',
      studentId: '1'
    },
    {
      id: '2',
      type: 'enrollment',
      title: 'New Enrollment',
      message: 'Michael Chen enrolled in your React course',
      timestamp: '2024-03-14T15:20:00Z',
      read: false,
      courseId: '1',
      studentId: '2'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $99.99 from a course sale',
      timestamp: '2024-03-13T09:15:00Z',
      read: true
    }
  ],
  unreadCount: 2
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;