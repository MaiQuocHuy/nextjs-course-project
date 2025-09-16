// ==============================
// Dashboard Statistics Types
// ==============================
export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface CourseStats {
  totalCourses: number; // Tổng số khóa học đã đăng ký
  completedCourses: number; // Số khóa học đã hoàn thành
  inProgressCourses: number; // Số khóa học đang học
  completedLessons: number; // Số bài học đã hoàn thành
  totalLessons: number; // Tổng số bài học
}

export interface AffiliatePayoutStats {
  totalPayouts: number;
  pendingPayouts: number;
  paidPayouts: number;
  cancelledPayouts: number;
  totalCommissionAmount: number;
  pendingCommissionAmount: number;
  paidCommissionAmount: number;
  cancelledCommissionAmount: number;
}

export interface QuizResultStats {
  totalQuizzes: number;
  passedQuizzes: number;
  failedQuizzes: number;
  averageScore: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmountSpent: number;
  completedPayments: number;
  failedPayments: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}
