import { User } from './profile';

export interface VideoContent {
  id: string;
  url: string;
  duration: number;
  title: string;
  format: string;
  metadataDuration: number;
  thumbnail: string;
  width: number;
  height: number;
  sizeBytes: number;
  file: File;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  questions: {
    questionText: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  }[];
}

export interface LessonOverview {
  id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ';
  videoUrl: string;
  duration: number;
  quizQuestionCount: number | null;
}

export interface LessonDetail extends LessonOverview {
  order: number;
  orderIndex: number;
  video?: VideoContent;
  quiz?: {
    questions: QuizQuestion[];
  };
  isCompleted: boolean;
  completedAt: string;
}

export interface SectionOverview {
  id: string;
  title: string;
  totalVideoDuration: number;
  totalQuizQuestion: number;
  lessons: LessonOverview[];
}

export interface SectionDetail extends SectionOverview {
  orderIndex: number;
  lessons: LessonDetail[];
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

export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  price: number;
  description: string;
  level: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  totalStudents: number;
  sectionCount: number;
  averageRating: number;
  revenue: number;
  canEdit: boolean;
  canUnpublish: boolean;
  canDelete: boolean;
  canPublish: boolean;
  statusReview: string;
  reason: string;
  approved: boolean;
}

export interface CourseDetail extends Course {
  isPublished: boolean;
  enrollmentCount: number;
  ratingCount: number;
  sections: SectionOverview[];
}

export interface PageType {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface Courses {
  content: Course[];
  page: PageType;
}
