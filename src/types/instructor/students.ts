import { QuizResults } from '../student';
import { Category } from './courses';

export interface EnrolledCourse {
  courseId: string;
  title: string;
  progress: number;

  // Used in Student Details page
  description?: string;
  level?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: Category[];
  price?: number;
  averageRating?: number;
  totalRating?: number;
  // quizResults?: QuizResults[];
  enrolledAt?: string;
}

export interface Students {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: EnrolledCourse[];
}

export const mockStudents: Students[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    enrolledCourses: [
      {
        courseId: 'course-1',
        title: 'Introduction to Web Development',
        progress: 0.8,
      },
      {
        courseId: 'course-2',
        title: 'Introduction to Web Development',
        progress: 0.6,
      },
      {
        courseId: 'course-3',
        title: 'Advanced JavaScript',
        progress: 0,
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    enrolledCourses: [
      {
        courseId: 'course-2',
        title: 'Advanced JavaScript',
        progress: 0.9,
      },
    ],
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    enrolledCourses: [
      {
        courseId: 'course-1',
        title: 'Introduction to Web Development',
        progress: 0.7,
      },
      {
        courseId: 'course-3',
        title: 'React Fundamentals',
        progress: 0.5,
      },
    ],
  },
  {
    id: '4',
    name: 'Bob Brown',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    enrolledCourses: [
      {
        courseId: 'course-2',
        title: 'Advanced JavaScript',
        progress: 0.7,
      },
      {
        courseId: 'course-4',
        title: 'Node.js Backend Development',
        progress: 0.5,
      },
    ],
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    enrolledCourses: [
      {
        courseId: 'course-1',
        title: 'Introduction to Web Development',
        progress: 0.7,
      },
      {
        courseId: 'course-2',
        title: 'Advanced JavaScript',
        progress: 0.5,
      },
    ],
  },
];
