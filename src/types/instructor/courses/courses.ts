import { CommonFilters, Page } from '@/types/common';

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

export interface LessonOverview {
  id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ';
  videoUrl: string;
  duration: number;
  quizQuestionCount: number | null;
}

export interface SectionOverview {
  id: string;
  title: string;
  totalVideoDuration: number;
  totalQuizQuestion: number;
  lessons: LessonOverview[];
}

export interface Review {
  id: string;
  rating: number;
  reviewText: string;
  reviewedAt: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
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

export interface Courses {
  content: Course[];
  page: Page;
}

export interface CoursesFilter extends CommonFilters {
  search?: string;
  status?: 'PENDING' | 'APPROVED' | 'DENIED' | 'RESUBMITTED';
  categoryIds?: string[];
  rating?: 'THREE' | 'FOUR' | 'FIVE';
  minPrice?: number;
  maxPrice?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished?: boolean;
}
