import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  joinedAt: string;
  lastActive: string;
}

export interface Message {
  id: string;
  studentId: string;
  content: string;
  timestamp: string;
  sender: 'instructor' | 'student';
  read: boolean;
}

interface StudentsState {
  students: Student[];
  messages: Message[];
  searchTerm: string;
  selectedStudent: Student | null;
  loading: boolean;
}

const initialState: StudentsState = {
  students: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: '/placeholder.svg',
      enrolledCourses: ['1', '2'],
      progress: { '1': 75, '2': 45 },
      joinedAt: '2024-01-20',
      lastActive: '2024-03-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      avatar: '/placeholder.svg',
      enrolledCourses: ['1'],
      progress: { '1': 92 },
      joinedAt: '2024-02-05',
      lastActive: '2024-03-14'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      avatar: '/placeholder.svg',
      enrolledCourses: ['2'],
      progress: { '2': 68 },
      joinedAt: '2024-02-18',
      lastActive: '2024-03-13'
    }
  ],
  messages: [
    {
      id: '1',
      studentId: '1',
      content: 'Hi, I have a question about lesson 5 in the React course.',
      timestamp: '2024-03-15T10:30:00Z',
      sender: 'student',
      read: false
    },
    {
      id: '2',
      studentId: '2',
      content: 'Thank you for the detailed explanation!',
      timestamp: '2024-03-14T15:20:00Z',
      sender: 'student',
      read: true
    }
  ],
  searchTerm: '',
  selectedStudent: null,
  loading: false
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(msg => msg.id === action.payload);
      if (message) {
        message.read = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setSearchTerm, setSelectedStudent, addMessage, markMessageAsRead, setLoading } = studentsSlice.actions;
export default studentsSlice.reducer;