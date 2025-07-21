// Mock data for course management system

// Types based on database schema
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

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  price: number;
  is_published: boolean;
  is_approved: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  instructor?: User;
  categories?: Category[];
  sections?: Section[];
  enrollments?: Enrollment[];
  reviews?: Review[];
  thumbnail?: string;
  rating?: number;
  studentsCount?: number;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ';
  content_id: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  videoContent?: VideoContent;
  quizQuestions?: QuizQuestion[];
  duration?: number;
}

export interface VideoContent {
  id: string;
  url: string;
  duration: number | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  created_at: string;
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

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
}

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    email: 'john.instructor@example.com',
    name: 'Dr. John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    email: 'sarah.dev@example.com',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b67565b4?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-01-20T09:30:00Z'
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    email: 'mike.data@example.com',
    name: 'Prof. Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-02-01T14:15:00Z'
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    email: 'alice.student@example.com',
    name: 'Alice Brown',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'STUDENT',
    created_at: '2024-02-10T11:45:00Z'
  }
];

// Mock Categories Data
export const mockCategories: Category[] = [
  {
    id: 'cat-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Web Development',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    name: 'Data Science',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    name: 'Machine Learning',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    name: 'Mobile Development',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    name: 'DevOps',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    name: 'UI/UX Design',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Video Content
export const mockVideoContent: VideoContent[] = [
  {
    id: 'vid-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 1200, // 20 minutes
    uploaded_by: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'vid-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    duration: 900, // 15 minutes
    uploaded_by: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
];

// Mock Quiz Questions
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    lesson_id: 'lesson-quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    question_text: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    correct_answer: 'Hyper Text Markup Language',
    explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
    created_at: '2024-01-15T12:00:00Z'
  },
  {
    id: 'quiz-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    lesson_id: 'lesson-quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    question_text: 'Which CSS property controls the text size?',
    options: ['font-size', 'text-size', 'font-style', 'text-style'],
    correct_answer: 'font-size',
    explanation: 'The font-size property in CSS is used to control the size of text.',
    created_at: '2024-01-15T12:05:00Z'
  }
];

// Mock Courses Data with complete relations
export const mockCourses: Course[] = [
  {
    id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive web development course. Perfect for beginners who want to become full-stack developers.',
    instructor_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    price: 99.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    rating: 4.8,
    studentsCount: 15420,
    instructor: mockUsers[0],
    categories: [mockCategories[0]],
    sections: [
      {
        id: 'section-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        title: 'HTML Fundamentals',
        order_index: 1,
        created_at: '2024-01-15T10:15:00Z',
        updated_at: '2024-01-15T10:15:00Z',
        lessons: [
          {
            id: 'lesson-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            section_id: 'section-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            title: 'Introduction to HTML',
            type: 'VIDEO',
            content_id: 'vid-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            order_index: 1,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            duration: 1200,
            videoContent: mockVideoContent[0]
          },
          {
            id: 'lesson-quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            section_id: 'section-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            title: 'HTML Knowledge Check',
            type: 'QUIZ',
            content_id: null,
            order_index: 2,
            created_at: '2024-01-15T11:00:00Z',
            updated_at: '2024-01-15T11:00:00Z',
            quizQuestions: mockQuizQuestions
          }
        ]
      },
      {
        id: 'section-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        title: 'CSS Styling',
        order_index: 2,
        created_at: '2024-01-15T10:45:00Z',
        updated_at: '2024-01-15T10:45:00Z',
        lessons: [
          {
            id: 'lesson-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
            section_id: 'section-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
            title: 'CSS Basics and Selectors',
            type: 'VIDEO',
            content_id: 'vid-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
            order_index: 1,
            created_at: '2024-01-15T11:15:00Z',
            updated_at: '2024-01-15T11:15:00Z',
            duration: 900,
            videoContent: mockVideoContent[1]
          }
        ]
      }
    ]
  },
  {
    id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    title: 'Data Science with Python',
    description: 'Master data science concepts using Python. Learn pandas, numpy, matplotlib, seaborn, and machine learning fundamentals.',
    instructor_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    price: 129.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-02-01T14:15:00Z',
    updated_at: '2024-02-01T14:15:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    rating: 4.9,
    studentsCount: 8750,
    instructor: mockUsers[2],
    categories: [mockCategories[1], mockCategories[2]],
    sections: []
  },
  {
    id: 'course-3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    title: 'React Native Mobile App Development',
    description: 'Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.',
    instructor_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    price: 149.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-01-20T09:30:00Z',
    updated_at: '2024-01-20T09:30:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    rating: 4.7,
    studentsCount: 6230,
    instructor: mockUsers[1],
    categories: [mockCategories[3]],
    sections: []
  },
  {
    id: 'course-4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Master Figma, design systems, and user research methods.',
    instructor_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    price: 79.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-02-15T16:20:00Z',
    updated_at: '2024-02-15T16:20:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    rating: 4.6,
    studentsCount: 4180,
    instructor: mockUsers[0],
    categories: [mockCategories[5]],
    sections: []
  },
  {
    id: 'course-5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    title: 'DevOps and Cloud Computing',
    description: 'Learn DevOps practices, CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS and Azure.',
    instructor_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    price: 199.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-02-20T11:45:00Z',
    updated_at: '2024-02-20T11:45:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=225&fit=crop',
    rating: 4.8,
    studentsCount: 3920,
    instructor: mockUsers[2],
    categories: [mockCategories[4]],
    sections: []
  },
  {
    id: 'course-6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    title: 'Advanced JavaScript and TypeScript',
    description: 'Deep dive into modern JavaScript ES6+ features and TypeScript. Learn async programming, design patterns, and advanced concepts.',
    instructor_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    price: 119.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-01T13:30:00Z',
    updated_at: '2024-03-01T13:30:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
    rating: 4.9,
    studentsCount: 7650,
    instructor: mockUsers[1],
    categories: [mockCategories[0]],
    sections: []
  }
];

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    id: 'review-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    rating: 5,
    review_text: 'Excellent course! The instructor explains everything clearly and the hands-on projects are very helpful.',
    reviewed_at: '2024-02-12T15:30:00Z',
    updated_at: '2024-02-12T15:30:00Z',
    user: mockUsers[3]
  },
  {
    id: 'review-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    rating: 5,
    review_text: 'Amazing data science course! Great balance of theory and practical applications.',
    reviewed_at: '2024-02-25T10:15:00Z',
    updated_at: '2024-02-25T10:15:00Z',
    user: mockUsers[3]
  }
];

// Mock Enrollments Data
export const mockEnrollments: Enrollment[] = [
  {
    id: 'enroll-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    enrolled_at: '2024-02-10T11:45:00Z',
    completion_status: 'IN_PROGRESS',
    progress: 75
  },
  {
    id: 'enroll-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    enrolled_at: '2024-02-15T14:20:00Z',
    completion_status: 'COMPLETED',
    progress: 100
  }
];

// Mock Payments Data
export const mockPayments: Payment[] = [
  {
    id: 'payment-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    amount: 99.99,
    status: 'COMPLETED',
    payment_method: 'CREDIT_CARD',
    paid_at: '2024-02-10T11:45:00Z',
    created_at: '2024-02-10T11:40:00Z'
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 129.99,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2024-02-15T14:20:00Z',
    created_at: '2024-02-15T14:15:00Z'
  }
];

// Helper functions for filtering and searching
export const getPublishedCourses = () => {
  return mockCourses.filter(course => course.is_published && course.is_approved && !course.is_deleted);
};

export const getCoursesByCategory = (categoryId: string) => {
  return mockCourses.filter(course => 
    course.categories?.some(cat => cat.id === categoryId) && 
    course.is_published && 
    course.is_approved && 
    !course.is_deleted
  );
};

export const getCoursesByInstructor = (instructorId: string) => {
  return mockCourses.filter(course => 
    course.instructor_id === instructorId && 
    course.is_published && 
    course.is_approved && 
    !course.is_deleted
  );
};

export const searchCourses = (query: string) => {
  const searchTerm = query.toLowerCase();
  return mockCourses.filter(course => 
    (course.title.toLowerCase().includes(searchTerm) || 
     course.description?.toLowerCase().includes(searchTerm)) &&
    course.is_published && 
    course.is_approved && 
    !course.is_deleted
  );
};

export const getFeaturedCourses = () => {
  return mockCourses
    .filter(course => course.is_published && course.is_approved && !course.is_deleted)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
};

export const getPopularCourses = () => {
  return mockCourses
    .filter(course => course.is_published && course.is_approved && !course.is_deleted)
    .sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0))
    .slice(0, 8);
};

// Export all mock data
export const mockData = {
  users: mockUsers,
  categories: mockCategories,
  courses: mockCourses,
  videoContent: mockVideoContent,
  quizQuestions: mockQuizQuestions,
  reviews: mockReviews,
  enrollments: mockEnrollments,
  payments: mockPayments
};
