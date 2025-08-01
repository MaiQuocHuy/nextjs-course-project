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
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
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
  description: string;
  price: number;
  is_published: boolean;
  is_approved: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  instructor: User;
  categories: Category[];
  sections: CourseSection[];
  enrollments?: Enrollment[];
  reviews?: Review[];
  thumbnail: string;
  rating?: number;
  studentsCount?: number;
}

export interface Courses {
  content: Course[];
  page: [];
} 

export interface LearningPageProps {
  courseId: string;
  lessonId?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  status: 'uploading' | 'success' | 'error';
  error?: string;
  // metadata?: {
  //   type: 'image' | 'video';
  //   dimensions?: { width: number; height: number };
  //   aspectRatio?: number;
  //   duration?: number;
  //   formattedDuration?: string;
  // };
}
