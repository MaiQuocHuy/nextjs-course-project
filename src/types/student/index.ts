// ==============================
// Discount Usage
// ==============================
export interface DiscountUsage {
  id: string;
  discount: {
    id: string;
    code: string;
    description: string;
  };
  user: {
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    instructor: {
      name: string;
      email: string;
    };
    price: number;
  };
  usedAt: string;
  discountPercent: number;
  discountAmount: number;
}

export interface PaginatedDiscountUsages {
  content: DiscountUsage[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

// ==============================
// Affiliate Payout
// ==============================
export interface AffiliatePayout {
  id: string;
  course: {
    id: string;
    title: string;
    instructor: {
      name: string;
      email: string;
    };
    price: number;
  };
  discountUsage?: {
    id: string;
    discount: {
      id: string;
      code: string;
      description: string;
    };
    user: {
      name: string;
      email: string;
    };
    usedAt: string;
    discountPercent: number;
    discountAmount: number;
  } | null;
  commissionPercent: number;
  commissionAmount: number;
  payoutStatus: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  paidAt?: string | null;
  updatedAt: string;
  cancelledAt?: string | null;
}

export interface PaginatedAffiliatePayouts {
  content: AffiliatePayout[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
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

// ==============================
// Enrolled courses của student
// ==============================
export interface Course {
  courseId: string; // ID của khóa học
  title: string; // Tên khóa học
  thumbnailUrl: string; // Ảnh thumbnail của khóa học
  slug: string; // Slug dùng cho URL
  level: string; // Trình độ (Beginner, Intermediate, Advanced)
  price: number; // Giá khóa học
  progress: number; // Tiến độ học (%)
  completionStatus: string; // Trạng thái hoàn thành (e.g., "COMPLETED", "IN_PROGRESS")
  instructor: {
    id: string; // ID giảng viên
    name: string; // Tên giảng viên
    avatar: string; // Ảnh đại diện giảng viên
  };
  enrolledAt: string; // Ngày đăng ký học (ISO date string)
}

// Dữ liệu khóa học có phân trang
export interface PaginatedCourses {
  content: Course[]; // Danh sách khóa học
  page: {
    number: number; // Trang hiện tại
    size: number; // Số item/trang
    totalPages: number; // Tổng số trang
    totalElements: number; // Tổng số item
    first: boolean; // Có phải trang đầu không
    last: boolean; // Có phải trang cuối không
  };
}

// ==============================
// Enrolled course details
// ==============================
export interface Video {
  id: string; // ID video
  url: string; // Link video
  duration: number; // Thời lượng video (tính bằng giây)
  title: string; // Tiêu đề video
  thumbnail: string; // Ảnh thumbnail video
}

export interface QuizQuestion {
  id: string; // ID câu hỏi
  questionText: string; // Nội dung câu hỏi
  options: {
    [key: string]: string; // Danh sách đáp án
  };
  correctAnswer: string; // Đáp án đúng
  explanation: string; // Giải thích đáp án
}

export interface Quiz {
  questions: QuizQuestion[]; // Danh sách câu hỏi trong quiz
}

export type LessonType = "VIDEO" | "QUIZ" | "TEXT"; // Loại bài học

export interface Lesson {
  id: string; // ID bài học
  title: string; // Tên bài học
  type: LessonType; // Loại bài học
  order: number; // Thứ tự bài học trong section
  video: Video | null; // Thông tin video (nếu có)
  quiz: Quiz | null; // Thông tin quiz (nếu có)
  isCompleted: boolean; // Trạng thái hoàn thành
  completedAt: string | null; // Ngày hoàn thành (ISO date string)
}

export interface Section {
  id: string; // ID section
  title: string; // Tên section
  orderIndex: number; // Thứ tự section trong khóa học
  lessonCount: number; // Số bài học trong section
  lessons: Lesson[]; // Danh sách bài học
}

export type CourseSections = Section[];

// ==============================
// Thống kê dashboard
// ==============================
export interface CourseStats {
  totalCourses: number; // Tổng số khóa học đã đăng ký
  completedCourses: number; // Số khóa học đã hoàn thành
  inProgressCourses: number; // Số khóa học đang học
  completedLessons: number; // Số bài học đã hoàn thành
  totalLessons: number; // Tổng số bài học
}

// ==============================
// Activity Feed types
// ==============================
export type ActivityType =
  | "LESSON_COMPLETED"
  | "QUIZ_SUBMITTED"
  | "COURSE_ENROLLED";

export interface Activity {
  id: string; // ID hoạt động
  user_id: string; // ID user thực hiện
  type: ActivityType; // Loại hoạt động
  title: string; // Tiêu đề
  description: string; // Mô tả chi tiết
  completedAt: string; // Ngày thực hiện
  score?: number; // Điểm (nếu có)
  courseId?: string; // ID khóa học liên quan
  lessonId?: string; // ID bài học liên quan
}

export interface ActivityFeedResponse {
  content: Activity[]; // Danh sách hoạt động
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
  stats: CourseStats; // Thống kê chung
  activities: ActivityFeedResponse; // Lịch sử hoạt động
}

// ==============================
// Payment types
// ==============================
export interface PaymentCourse {
  id: string; // ID khóa học đã thanh toán
  title: string; // Tên khóa học
  thumbnailUrl: string; // Ảnh khóa học
}

export interface PaymentCard {
  last4: string; // 4 số cuối thẻ
  brand: string; // Loại thẻ (Visa, MasterCard)
  expMonth: number; // Tháng hết hạn
  expYear: number; // Năm hết hạn
}

export interface Payment {
  id: string; // ID giao dịch
  amount: number; // Số tiền thanh toán
  currency: string; // Loại tiền tệ
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"; // Trạng thái thanh toán
  paymentMethod: "stripe" | "paypal" | "bank_transfer"; // Phương thức thanh toán
  createdAt: string; // Ngày tạo giao dịch (ISO date string)
  transactionId?: string | null; // ID giao dịch thực tế từ cổng thanh toán
  stripeSessionId?: string | null; // Session ID từ Stripe
  receiptUrl?: string | null; // Link hóa đơn/biên lai
  card?: PaymentCard | null; // Thông tin thẻ (nếu có)
  course: PaymentCourse; // Thông tin khóa học đã mua
}

export interface PaymentDetail extends Payment {
  // Thêm các field chi tiết thanh toán (nếu có)
}

// ==============================
// Refund types
// ==============================
export interface RefundRequest {
  reason: string; // Lý do hoàn tiền
}

export interface RefundResponse {
  id: string; // ID yêu cầu hoàn tiền
  course: {
    id: string; // ID khóa học
    title: string; // Tên khóa học
  };
  reason: string; // Lý do hoàn tiền
  status: "PENDING" | "APPROVED" | "REJECTED"; // Trạng thái yêu cầu
  amount: number; // Số tiền hoàn lại
  requestedAt: string | null; // Ngày yêu cầu hoàn tiền
}

// ==============================
// Review types
// ==============================
export interface ReviewCourse {
  id: string; // ID khóa học
  title: string; // Tên khóa học
}

export interface Review {
  id: string; // ID review
  course: ReviewCourse; // Khóa học được review
  rating: number; // Số sao đánh giá
  reviewText: string; // Nội dung review
  reviewedAt: string; // Ngày review (ISO date string)
}

export interface PaginatedReviews {
  content: Review[]; // Danh sách review
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface UpdateReviewRequest {
  rating: number; // Số sao mới
  reviewText: string; // Nội dung mới
}

export interface UpdateReviewResponse {
  id: string; // ID review
  rating: number; // Số sao
  reviewText: string; // Nội dung
  reviewedAt: string; // Ngày cập nhật
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

// ==============================
// Quiz results types
// ==============================
export interface QuizResults {
  id: string; // ID kết quả quiz
  lesson: {
    id: string;
    title: string;
  };
  section: {
    id: string;
    title: string;
  };
  course: {
    id: string;
    title: string;
  };
  score: number; // Điểm
  totalQuestions: number; // Tổng số câu hỏi
  correctAnswers: number; // Số câu đúng
  completedAt: string; // Ngày hoàn thành
  canReview?: boolean; // Có thể xem lại không
}

export interface PaginatedQuizResults {
  content: QuizResults[]; // Danh sách kết quả quiz
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface QuizAnswer extends QuizQuestion {
  studentAnswer: string; // Đáp án của học viên
  isCorrect: boolean; // Đúng hay sai
}

export interface QuizResultDetails extends QuizResults {
  questions: QuizAnswer[]; // Chi tiết câu hỏi + đáp án
}

// ==============================
// Quiz submission types
// ==============================
export interface QuizSubmissionRequest {
  answers: Record<string, string>; // Mapping question ID to answer letter
}

export interface QuizSubmissionResponse {
  score: number; // Điểm số (0-100)
  totalQuestions: number; // Tổng số câu hỏi
  correctAnswers: number; // Số câu trả lời đúng
  feedback: string; // Phản hồi từ hệ thống
  submittedAt: string; // Thời gian submit (ISO string)
}

// ==============================
// Comment types
// ==============================
export interface Comment {
  id: string;
  content: string;
  depth: number;
  relativeDepth?: number;
  lft: number;
  rgt: number;
  isEdited: boolean;
  isDeleted: boolean;
  replyCount: number;
  hasReplies: boolean;
  isLeaf: boolean;
  parentId?: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  rootComment: boolean;
}

export interface CommentResponse {
  statusCode: number;
  message: string;
  data: Comment;
  timestamp: string;
}

export interface CommentsResponse {
  statusCode: number;
  message: string;
  data: {
    content: Comment[];
    page: {
      number: number;
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface CommentCountResponse {
  statusCode: number;
  message: string;
  data: number;
  timestamp: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}
