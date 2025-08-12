export interface VideoContent {
  id: string;
  url: string;
  duration: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ';
  order: number;
  video?: VideoContent;
  quiz?: QuizQuestion[];
  isCompleted: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  title: string;
  orderIndex: number;
  lessonCount: number;
  lessons?: Lesson[];
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completion_status: 'IN_PROGRESS' | 'COMPLETED';
  progress?: number;
}

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  review_text: string | null;
  reviewed_at: string;
  updated_at: string;
  user?: User;
}

export interface Course {
  id: string;
  title: string;
  price: number;
  description: string;
  level: string;
  thumbnailUrl: string;
  categories: Category[];
  status: string;
  createdAt: string;
  updateAt: string;
  totalStudents: number;
  sectionCount: number;
  averageRating: number;
  revenue: number;
  canEdit: boolean;
  canUnpublish: boolean;
  canDelete: boolean;
  canPublish: boolean;
  approved: boolean;
}

export interface Page {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface Courses {
  content: Course[];
  page: Page;
}
