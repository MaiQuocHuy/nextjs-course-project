import { Course, LessonOverview, QuizQuestion, SectionOverview, VideoContent } from "./courses";

export interface CourseDetail extends Course {
  isPublished: boolean;
  enrollmentCount: number;
  ratingCount: number;
  sections: SectionOverview[];
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

export interface SectionDetail extends SectionOverview {
  orderIndex: number;
  lessons: LessonDetail[];
}

export enum CourseDetailsSections {
  overview = 'overview',
  content = 'content',
  students = 'students',
  reviews = 'reviews',
}