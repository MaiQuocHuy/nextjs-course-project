import { QuizResults } from '../../types/student';
import { Students } from '../../types/instructor/students';
import { Category } from '../../types/instructor/courses';

// Mock categories for the courses
const mockCategories: Category[] = [
  { id: '1', name: 'Web Development' },
  { id: '2', name: 'JavaScript' },
  { id: '3', name: 'Frontend' },
  { id: '4', name: 'Backend' },
  { id: '5', name: 'React' },
  { id: '6', name: 'Node.js' },
];

// Mock quiz results
const mockQuizResults: QuizResults[] = [
  {
    id: 'quiz-1',
    lesson: {
      id: 'lesson-1',
      title: 'HTML Basics',
    },
    section: {
      id: 'section-1',
      title: 'Introduction to HTML',
    },
    course: {
      id: 'course-1',
      title: 'Introduction to Web Development',
    },
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    completedAt: '2025-07-15T14:30:00Z',
    canReview: true,
  },
  {
    id: 'quiz-2',
    lesson: {
      id: 'lesson-2',
      title: 'CSS Flexbox',
    },
    section: {
      id: 'section-2',
      title: 'CSS Layouts',
    },
    course: {
      id: 'course-1',
      title: 'Introduction to Web Development',
    },
    score: 70,
    totalQuestions: 10,
    correctAnswers: 7,
    completedAt: '2025-07-18T10:15:00Z',
    canReview: true,
  },
  {
    id: 'quiz-3',
    lesson: {
      id: 'lesson-3',
      title: 'JavaScript Events',
    },
    section: {
      id: 'section-3',
      title: 'JavaScript Basics',
    },
    course: {
      id: 'course-2',
      title: 'Advanced JavaScript',
    },
    score: 90,
    totalQuestions: 8,
    correctAnswers: 7,
    completedAt: '2025-08-05T16:45:00Z',
    canReview: true,
  },
  {
    id: 'quiz-4',
    lesson: {
      id: 'lesson-4',
      title: 'React Hooks',
    },
    section: {
      id: 'section-4',
      title: 'React State Management',
    },
    course: {
      id: 'course-3',
      title: 'React Fundamentals',
    },
    score: 75,
    totalQuestions: 12,
    correctAnswers: 9,
    completedAt: '2025-08-10T13:20:00Z',
    canReview: true,
  },
];

// Detailed student mock data
export const mockStudentDetail: Students = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  thumbnailUrl: 'https://i.pravatar.cc/150?img=1',
  enrolledCourses: [
    {
      courseId: 'course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and basic JavaScript.',
      level: 'Beginner',
      thumbnailUrl: 'https://placehold.co/300x200?text=Web+Development',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-06-20T00:00:00Z',
      categories: [mockCategories[0], mockCategories[2]],
      price: 49.99,
      averageRating: 4.8,
      totalRating: 156,
      progress: 0.8,
      // quizResults: [mockQuizResults[0], mockQuizResults[1]],
      enrolledAt: '2025-05-10T00:00:00Z',
    },
    {
      courseId: 'course-2',
      title: 'Advanced JavaScript',
      description: 'Dive deep into JavaScript with advanced concepts like closures, prototypes, and modern ES6+ features.',
      level: 'Intermediate',
      thumbnailUrl: 'https://placehold.co/300x200?text=JavaScript',
      createdAt: '2025-02-10T00:00:00Z',
      updatedAt: '2025-07-05T00:00:00Z',
      categories: [mockCategories[1], mockCategories[2]],
      price: 69.99,
      averageRating: 4.6,
      totalRating: 98,
      progress: 0.6,
      // quizResults: [mockQuizResults[2]],
      enrolledAt: '2025-06-15T00:00:00Z',
    },
    {
      courseId: 'course-3',
      title: 'React Fundamentals',
      description: 'Learn to build modern UIs with React, including components, hooks, and state management.',
      level: 'Intermediate',
      thumbnailUrl: 'https://placehold.co/300x200?text=React',
      createdAt: '2025-03-20T00:00:00Z',
      updatedAt: '2025-07-25T00:00:00Z',
      categories: [mockCategories[2], mockCategories[4]],
      price: 79.99,
      averageRating: 4.9,
      totalRating: 120,
      progress: 0.4,
      // quizResults: [mockQuizResults[3]],
      enrolledAt: '2025-07-01T00:00:00Z',
    },
  ],
};

// Function to get a student by ID (can be expanded later)
export const getStudentById = (id: string): Students | undefined => {
  if (id === '1') return mockStudentDetail;
  return undefined;
};

// Get all quiz results across all courses for a student
export const getStudentQuizResults = (): QuizResults[] => {
  return mockQuizResults;
};
