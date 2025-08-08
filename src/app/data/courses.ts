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
  sections: Section[];
  enrollments?: Enrollment[];
  reviews?: Review[];
  thumbnail: string;
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

export interface Notification {
  id: string;
  title: string;
  isRead: boolean;
  message: string;
  timestamp: string;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
}

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    email: 'john.instructor@example.com',
    name: 'Dr. John Smith',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    email: 'sarah.dev@example.com',
    name: 'Dr. John Smith',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-01-20T09:30:00Z',
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    email: 'mike.data@example.com',
    name: 'Prof. Michael Chen',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'INSTRUCTOR',
    created_at: '2024-02-01T14:15:00Z',
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    email: 'alice.student@example.com',
    name: 'Alice Brown',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'STUDENT',
    created_at: '2024-02-10T11:45:00Z',
  },
];

// Mock Categories Data
export const mockCategories: Category[] = [
  {
    id: 'cat-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Web Development',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    name: 'Data Science',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    name: 'Machine Learning',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    name: 'Mobile Development',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    name: 'DevOps',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    name: 'UI/UX Design',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Video Content
export const mockVideoContent: VideoContent[] = [
  {
    id: 'vid-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 1200, // 20 minutes
    uploaded_by: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'vid-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    duration: 900, // 15 minutes
    uploaded_by: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
];

// Mock Quiz Questions
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    lesson_id: 'lesson-quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    question_text: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink and Text Markup Language',
    ],
    correct_answer: 'Hyper Text Markup Language',
    explanation:
      'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
    created_at: '2024-01-15T12:00:00Z',
  },
  {
    id: 'quiz-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    lesson_id: 'lesson-quiz-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    question_text: 'Which CSS property controls the text size?',
    options: ['font-size', 'text-size', 'font-style', 'text-style'],
    correct_answer: 'font-size',
    explanation:
      'The font-size property in CSS is used to control the size of text.',
    created_at: '2024-01-15T12:05:00Z',
  },
];

// Mock Courses Data with complete relations
export const mockCourses: Course[] = [
  {
    id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    title: 'Complete Web Development Bootcamp',
    description:
      'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive web development course. Perfect for beginners who want to become full-stack developers.',
    price: 99.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    rating: 5,
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
            videoContent: mockVideoContent[0],
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
            quizQuestions: mockQuizQuestions,
          },
        ],
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
            videoContent: mockVideoContent[1],
          },
        ],
      },
    ],
  },
  {
    id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    title: 'Data Science with Python',
    description:
      'Master data science concepts using Python. Learn pandas, numpy, matplotlib, seaborn, and machine learning fundamentals.',

    price: 129.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-02-01T14:15:00Z',
    updated_at: '2024-02-01T14:15:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    rating: 5,
    studentsCount: 8750,
    instructor: mockUsers[2],
    categories: [mockCategories[1], mockCategories[2]],
    sections: [],
  },
  {
    id: 'course-3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    title: 'React Native Mobile App Development',
    description:
      'Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.',

    price: 149.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-01-20T09:30:00Z',
    updated_at: '2024-01-20T09:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    rating: 5,
    studentsCount: 6230,
    instructor: mockUsers[1],
    categories: [mockCategories[3]],
    sections: [],
  },
  {
    id: 'course-4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    title: 'UI/UX Design Fundamentals',
    description:
      'Learn the principles of user interface and user experience design. Master Figma, design systems, and user research methods.',

    price: 79.99,
    is_published: false,
    is_approved: false,
    is_deleted: false,
    created_at: '2024-02-15T16:20:00Z',
    updated_at: '2024-02-15T16:20:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    rating: 5,
    studentsCount: 4180,
    instructor: mockUsers[0],
    categories: [mockCategories[5]],
    sections: [],
  },
  {
    id: 'course-5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    title: 'DevOps and Cloud Computing',
    description:
      'Learn DevOps practices, CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS and Azure.',

    price: 199.99,
    is_published: false,
    is_approved: false,
    is_deleted: false,
    created_at: '2024-02-20T11:45:00Z',
    updated_at: '2024-02-20T11:45:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 3920,
    instructor: mockUsers[2],
    categories: [mockCategories[4]],
    sections: [],
  },
  {
    id: 'course-6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    title: 'Advanced JavaScript and TypeScript',
    description:
      'Deep dive into modern JavaScript ES6+ features and TypeScript. Learn async programming, design patterns, and advanced concepts.',

    price: 119.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-01T13:30:00Z',
    updated_at: '2024-03-01T13:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 7650,
    instructor: mockUsers[1],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
    title: 'React Native Mobile Development',
    description:
      'Build cross-platform mobile apps using React Native. Learn navigation, state management, and native integrations.',

    price: 149.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-05T09:15:00Z',
    updated_at: '2024-03-05T09:15:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    rating: 3,
    studentsCount: 5430,
    instructor: mockUsers[0],
    categories: [mockCategories[3]],
    sections: [],
  },
  {
    id: 'course-8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
    title: 'Python Django Backend Development',
    description:
      'Master Django framework for building scalable web applications. Learn models, views, authentication, and deployment.',

    price: 89.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-10T14:30:00Z',
    updated_at: '2024-03-10T14:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=225&fit=crop',
    rating: 3,
    studentsCount: 6780,
    instructor: mockUsers[1],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
    title: 'Artificial Intelligence Fundamentals',
    description:
      'Introduction to AI concepts, neural networks, and practical applications. No prior experience required.',

    price: 179.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-15T11:00:00Z',
    updated_at: '2024-03-15T11:00:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=225&fit=crop',
    rating: 3,
    studentsCount: 8920,
    instructor: mockUsers[2],
    categories: [mockCategories[2]],
    sections: [],
  },
  {
    id: 'course-0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
    title: 'Blockchain and Cryptocurrency',
    description:
      'Learn blockchain technology, smart contracts, and cryptocurrency development. Build your own blockchain.',

    price: 199.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-20T16:45:00Z',
    updated_at: '2024-03-20T16:45:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 3450,
    instructor: mockUsers[0],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
    title: 'Vue.js 3 Complete Guide',
    description:
      'Master Vue.js 3 with Composition API, TypeScript, and modern development practices. Build real-world applications.',

    price: 99.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-03-25T13:20:00Z',
    updated_at: '2024-03-25T13:20:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 4890,
    instructor: mockUsers[1],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
    title: 'Cybersecurity Essentials',
    description:
      'Learn ethical hacking, network security, and cybersecurity best practices. Protect systems from threats.',

    price: 159.99,
    is_published: false,
    is_approved: false,
    is_deleted: false,
    created_at: '2024-03-30T10:30:00Z',
    updated_at: '2024-03-30T10:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 5670,
    instructor: mockUsers[2],
    categories: [mockCategories[4]],
    sections: [],
  },
  {
    id: 'course-3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
    title: 'Game Development with Unity',
    description:
      'Create 2D and 3D games using Unity engine. Learn C# scripting, physics, and game design principles.',

    price: 139.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-04-05T15:15:00Z',
    updated_at: '2024-04-05T15:15:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 7230,
    instructor: mockUsers[0],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-4n5o6p7q-8r9s-0t1u-2v3w-4x5y6z7a8b9c',
    title: 'Digital Marketing Mastery',
    description:
      'Complete digital marketing course covering SEO, social media, email marketing, and analytics.',

    price: 79.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-04-10T12:00:00Z',
    updated_at: '2024-04-10T12:00:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    rating: 3,
    studentsCount: 9120,
    instructor: mockUsers[1],
    categories: [mockCategories[5]],
    sections: [],
  },
  {
    id: 'course-5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
    title: 'AWS Cloud Architect',
    description:
      'Become an AWS certified cloud architect. Learn cloud infrastructure, serverless, and DevOps practices.',

    price: 249.99,
    is_published: false,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-04-15T14:45:00Z',
    updated_at: '2024-04-15T14:45:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    rating: 3,
    studentsCount: 4560,
    instructor: mockUsers[2],
    categories: [mockCategories[4]],
    sections: [],
  },
  {
    id: 'course-6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e',
    title: 'Flutter Cross-Platform Development',
    description:
      'Build beautiful native apps for iOS and Android using Flutter and Dart programming language.',

    price: 129.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-04-20T11:30:00Z',
    updated_at: '2024-04-20T11:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 6340,
    instructor: mockUsers[0],
    categories: [mockCategories[3]],
    sections: [],
  },
  {
    id: 'course-7q8r9s0t-1u2v-3w4x-5y6z-7a8b9c0d1e2f',
    title: 'Advanced Photoshop Techniques',
    description:
      'Master professional photo editing, digital art creation, and advanced Photoshop techniques.',

    price: 69.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-04-25T16:00:00Z',
    updated_at: '2024-04-25T16:00:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 8750,
    instructor: mockUsers[1],
    categories: [mockCategories[5]],
    sections: [],
  },
  {
    id: 'course-8r9s0t1u-2v3w-4x5y-6z7a-8b9c0d1e2f3g',
    title: 'Node.js Backend Development',
    description:
      'Build scalable server-side applications with Node.js, Express.js, and MongoDB. Learn REST APIs and GraphQL.',

    price: 109.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-01T09:45:00Z',
    updated_at: '2024-05-01T09:45:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 5890,
    instructor: mockUsers[2],
    categories: [mockCategories[0]],
    sections: [],
  },
  {
    id: 'course-9s0t1u2v-3w4x-5y6z-7a8b-9c0d1e2f3g4h',
    title: 'Figma UI/UX Design Bootcamp',
    description:
      'Complete UI/UX design course using Figma. Learn design systems, prototyping, and user research.',

    price: 89.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-05T13:15:00Z',
    updated_at: '2024-05-05T13:15:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 7450,
    instructor: mockUsers[0],
    categories: [mockCategories[5]],
    sections: [],
  },
  {
    id: 'course-0t1u2v3w-4x5y-6z7a-8b9c-0d1e2f3g4h5i',
    title: 'Docker and Kubernetes Mastery',
    description:
      'Learn containerization with Docker and orchestration with Kubernetes. Deploy scalable applications.',

    price: 189.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-10T10:20:00Z',
    updated_at: '2024-05-10T10:20:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 4320,
    instructor: mockUsers[1],
    categories: [mockCategories[4]],
    sections: [],
  },
  {
    id: 'course-1u2v3w4x-5y6z-7a8b-9c0d-1e2f3g4h5i6j',
    title: 'SQL Database Design and Optimization',
    description:
      'Master SQL, database design, performance optimization, and advanced queries for enterprise applications.',

    price: 119.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-15T15:30:00Z',
    updated_at: '2024-05-15T15:30:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 6780,
    instructor: mockUsers[2],
    categories: [mockCategories[1]],
    sections: [],
  },
  {
    id: 'course-2v3w4x5y-6z7a-8b9c-0d1e-2f3g4h5i6j7k',
    title: 'iOS Development with Swift',
    description:
      'Build native iOS apps using Swift and SwiftUI. Learn iOS design patterns and App Store deployment.',

    price: 149.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-20T12:45:00Z',
    updated_at: '2024-05-20T12:45:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 5230,
    instructor: mockUsers[0],
    categories: [mockCategories[3]],
    sections: [],
  },
  {
    id: 'course-3w4x5y6z-7a8b-9c0d-1e2f-3g4h5i6j7k8l',
    title: 'Business Analytics with Excel',
    description:
      'Advanced Excel techniques for business analytics, data visualization, and financial modeling.',

    price: 59.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-25T14:10:00Z',
    updated_at: '2024-05-25T14:10:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 12450,
    instructor: mockUsers[1],
    categories: [mockCategories[1]],
    sections: [],
  },
  {
    id: 'course-4x5y6z7a-8b9c-0d1e-2f3g-4h5i6j7k8l9m',
    title: 'GraphQL API Development',
    description:
      'Build modern APIs with GraphQL, Apollo Server, and integrate with React and Node.js applications.',
    price: 99.99,
    is_published: true,
    is_approved: true,
    is_deleted: false,
    created_at: '2024-05-30T11:25:00Z',
    updated_at: '2024-05-30T11:25:00Z',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
    rating: 4,
    studentsCount: 3890,
    instructor: mockUsers[2],
    categories: [mockCategories[0]],
    sections: [],
  },
];

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    id: 'review-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    rating: 5,
    review_text:
      'Excellent course! The instructor explains everything clearly and the hands-on projects are very helpful.',
    reviewed_at: '2024-02-12T15:30:00Z',
    updated_at: '2024-02-12T15:30:00Z',
    user: mockUsers[3],
  },
  {
    id: 'review-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    rating: 5,
    review_text:
      'Amazing data science course! Great balance of theory and practical applications.',
    reviewed_at: '2024-02-25T10:15:00Z',
    updated_at: '2024-02-25T10:15:00Z',
    user: mockUsers[3],
  },
];

// Mock Enrollments Data
export const mockEnrollments: Enrollment[] = [
  {
    id: 'enroll-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    enrolled_at: '2024-02-10T11:45:00Z',
    completion_status: 'IN_PROGRESS',
    progress: 75,
  },
  {
    id: 'enroll-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    enrolled_at: '2024-02-15T14:20:00Z',
    completion_status: 'COMPLETED',
    progress: 100,
  },
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
    created_at: '2024-02-10T11:40:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 129.99,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2024-02-15T14:20:00Z',
    created_at: '2024-02-15T14:15:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7a',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 79.99,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2024-01-15T14:20:00Z',
    created_at: '2024-01-15T14:15:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7b',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 234,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2024-01-15T14:20:00Z',
    created_at: '2024-01-15T14:15:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7c',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 100,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2025-03-15T14:20:00Z',
    created_at: '2025-03-15T14:15:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7d',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 200,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2025-07-15T14:20:00Z',
    created_at: '2025-07-15T14:15:00Z',
  },
  {
    id: 'payment-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7d',
    user_id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    course_id: 'course-2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 80,
    status: 'COMPLETED',
    payment_method: 'PAYPAL',
    paid_at: '2025-07-15T14:20:00Z',
    created_at: '2025-07-15T14:15:00Z',
  },
];

// Helper functions for filtering and searching
export const getAllCourses = () => {
  return mockCourses.filter((course) => !course.is_deleted);
};

export const getPublishedCourses = () => {
  return mockCourses.filter(
    (course) => course.is_published && course.is_approved && !course.is_deleted
  );
};

export const getCoursesByCategory = (categoryId: string) => {
  return mockCourses.filter(
    (course) =>
      course.categories?.some((cat) => cat.id === categoryId) &&
      course.is_published &&
      course.is_approved &&
      !course.is_deleted
  );
};

export const getCoursesByInstructor = (instructorId: string) => {
  return mockCourses.filter(
    (course) =>
      course.instructor.id === instructorId &&
      course.is_published &&
      course.is_approved &&
      !course.is_deleted
  );
};

export const searchCourses = (query: string) => {
  const searchTerm = query.toLowerCase();
  return mockCourses.filter(
    (course) =>
      (course.title.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm)) &&
      course.is_published &&
      course.is_approved &&
      !course.is_deleted
  );
};

export const getFeaturedCourses = () => {
  return mockCourses
    .filter(
      (course) =>
        course.is_published && course.is_approved && !course.is_deleted
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
};

export const getCourseById = (id: string) => {
  return mockCourses.find(course => 
    course.id === id && 
    course.is_published && 
    course.is_approved && 
    !course.is_deleted
  );
};

export const getCourseReviews = (courseId: string) => {
  return mockReviews.filter(review => review.course_id === courseId);
};

export const getPopularCourses = () => {
  return mockCourses
    .filter(
      (course) =>
        course.is_published && course.is_approved && !course.is_deleted
    )
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
  payments: mockPayments,
};
