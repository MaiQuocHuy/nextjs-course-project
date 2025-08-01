// Enrolled courses của student
export interface Course {
  courseId: string;
  title: string;
  thumbnailUrl: string;
  slug: string;
  level: string;
  price: number;
  progress: number;
  completionStatus: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface PaginatedCourses {
  content: Course[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

// Enrolled course details
export interface Video {
  id: string;
  url: string;
  duration: number; // seconds
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export type LessonType = "VIDEO" | "QUIZ" | "TEXT";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  video: Video | null;
  quiz: Quiz | null;
  isCompleted: boolean;
}

export interface Section {
  id: string;
  title: string;
  orderIndex: number;
  lessonCount: number;
  lessons: Lesson[];
}
export type CourseSections = Section[];

export interface CourseStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  completedLessons: number;
  totalLessons: number;
}

// Activity Feed types
export type ActivityType =
  | "LESSON_COMPLETED"
  | "QUIZ_SUBMITTED"
  | "COURSE_ENROLLED";

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string;
  completed_at: string;
  score?: number;
  courseId?: string;
  lessonId?: string;
}

export interface ActivityFeedResponse {
  content: Activity[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}
