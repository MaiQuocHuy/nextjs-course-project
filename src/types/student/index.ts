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
  enrolledAt: string; // ISO date string
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

export interface DashboardData {
  stats: CourseStats;
  activities: ActivityFeedResponse;
}

// Payment types
export interface PaymentCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export interface PaymentCard {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod: "stripe" | "paypal" | "bank_transfer";
  createdAt: string; // ISO date string
  transactionId?: string | null;
  stripeSessionId?: string | null;
  receiptUrl?: string | null;
  card?: PaymentCard | null;
  course: PaymentCourse;
}

export interface PaymentDetail extends Payment {
  // Payment detail might have additional fields
}

export interface PaymentsResponse {
  statusCode: number;
  message: string;
  data: Payment[];
}

export interface PaymentDetailResponse {
  statusCode: number;
  message: string;
  data: PaymentDetail;
}
