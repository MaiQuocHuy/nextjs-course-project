import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  video?: string;
  status: 'pending' | 'published' | 'discontinued';
  rating: number;
  studentsCount: number;
  lessonsCount: number;
  createdAt: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  documents: string[];
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  searchTerm: string;
  filters: {
    status: string;
    category: string;
    rating: number | null;
    priceRange: [number, number];
  };
}

const initialState: CoursesState = {
  courses: [
    {
      id: '1',
      title: 'Advanced React Development',
      description: 'Master React with hooks, context, and modern patterns',
      category: 'Programming',
      price: 99.99,
      image: '/placeholder.svg',
      status: 'published',
      rating: 4.8,
      studentsCount: 142,
      lessonsCount: 24,
      createdAt: '2024-01-15',
      lessons: []
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and experience design',
      category: 'Design',
      price: 79.99,
      image: '/placeholder.svg',
      status: 'published',
      rating: 4.6,
      studentsCount: 89,
      lessonsCount: 18,
      createdAt: '2024-02-10',
      lessons: []
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      description: 'Introduction to ML algorithms and practical applications',
      category: 'Data Science',
      price: 129.99,
      image: '/placeholder.svg',
      status: 'pending',
      rating: 0,
      studentsCount: 0,
      lessonsCount: 32,
      createdAt: '2024-03-05',
      lessons: []
    }
  ],
  loading: false,
  searchTerm: '',
  filters: {
    status: 'all',
    category: 'all',
    rating: null,
    priceRange: [0, 500]
  }
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CoursesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setSearchTerm, setFilters, addCourse, updateCourse, deleteCourse, setLoading } = coursesSlice.actions;
export default coursesSlice.reducer;