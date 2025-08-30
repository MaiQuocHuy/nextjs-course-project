import { ReactNode } from 'react';
import { Course, Notification } from '@/app/data/courses';

// Interface for dashboard statistics item
export interface DashboardStatItem {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  color?: string;
  href: string;
}

// Interface for dashboard statistics
export interface DashboardStats {
  courseStatistics: DashboardStatItem;
  studentStatistics: DashboardStatItem;
  revenueStatistics: DashboardStatItem;
  ratingStatistics: DashboardStatItem;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
}

// Interface for a student in the dashboard
export interface DashboardStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  enrollmentDate: string;
}

// Main interface for Instructor Dashboard data
export interface InstructorDashboardData {
  instructorName: string;
  stats: DashboardStats;
  courses: Course[];
  publishedCourses: Course[];
  notifications: Notification[];
  monthlyRevenue: MonthlyRevenue[];
  students: DashboardStudent[];
  totalStudents: number;
  totalRevenue: number;
  ratings: number;
}

// Mock data for the Instructor Dashboard
export const mockInstructorDashboardData: InstructorDashboardData = {
  instructorName: 'John',
  stats: {
    courseStatistics: {
      title: 'Total Courses',
      value: 5,
      description: '5 published',
      icon: null, // Icons will be provided in the component
      color: 'text-primary',
      href: '/instructor/courses',
    },
    studentStatistics: {
      title: 'Total Students',
      value: 128,
      description: '+12% from last month',
      icon: null,
      color: 'text-success',
      href: '/instructor/students',
    },
    revenueStatistics: {
      title: 'Total Revenue',
      value: '$4250',
      description: 'This month: $1200',
      icon: null,
      href: '/instructor/earnings',
    },
    ratingStatistics: {
      title: 'Avg Rating',
      value: 4.8,
      description: 'Across all courses',
      icon: null,
      color: 'text-instructor-accent',
      href: '/instructor/courses',
    },
  },
  courses: [
    {
      id: 'course-001',
      title: 'Complete React Developer Course',
      description: 'Learn React from the ground up with practical projects',
      price: 99.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-06-10T12:00:00Z',
      updated_at: '2024-07-15T14:30:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-001',
          name: 'Web Development',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.9,
      studentsCount: 76
    },
    {
      id: 'course-002',
      title: 'Advanced TypeScript Patterns',
      description: 'Master TypeScript with advanced design patterns and techniques',
      price: 89.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-05-22T09:15:00Z',
      updated_at: '2024-07-20T11:45:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-002',
          name: 'Programming',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.7,
      studentsCount: 34
    },
    {
      id: 'course-003',
      title: 'Next.js Fullstack Development',
      description: 'Build modern web applications with Next.js and backend integration',
      price: 129.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-07-05T14:20:00Z',
      updated_at: '2024-08-01T16:10:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-001',
          name: 'Web Development',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-003',
          name: 'Full Stack',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1642132652806-8c4557833b22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.8,
      studentsCount: 18
    },
    {
      id: 'course-004',
      title: 'Docker for Developers',
      description: 'Learn Docker containerization for modern application development',
      price: 79.99,
      is_published: false,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-04-15T08:45:00Z',
      updated_at: '2024-06-10T10:30:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-004',
          name: 'DevOps',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1605745341075-1b7460b99df8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.6,
      studentsCount: 0
    },
    {
      id: 'course-005',
      title: 'AWS for Web Developers',
      description: 'Master AWS services for modern web applications',
      price: 119.99,
      is_published: true,
      is_approved: false,
      is_deleted: false,
      created_at: '2024-07-25T11:30:00Z',
      updated_at: '2024-08-10T13:15:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-004',
          name: 'DevOps',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-005',
          name: 'Cloud Computing',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 0,
      studentsCount: 0
    }
  ],
  publishedCourses: [
    {
      id: 'course-001',
      title: 'Complete React Developer Course',
      description: 'Learn React from the ground up with practical projects',
      price: 99.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-06-10T12:00:00Z',
      updated_at: '2024-07-15T14:30:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-001',
          name: 'Web Development',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.9,
      studentsCount: 76
    },
    {
      id: 'course-002',
      title: 'Advanced TypeScript Patterns',
      description: 'Master TypeScript with advanced design patterns and techniques',
      price: 89.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-05-22T09:15:00Z',
      updated_at: '2024-07-20T11:45:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-002',
          name: 'Programming',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.7,
      studentsCount: 34
    },
    {
      id: 'course-003',
      title: 'Next.js Fullstack Development',
      description: 'Build modern web applications with Next.js and backend integration',
      price: 129.99,
      is_published: true,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-07-05T14:20:00Z',
      updated_at: '2024-08-01T16:10:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-001',
          name: 'Web Development',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'cat-003',
          name: 'Full Stack',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1642132652806-8c4557833b22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.8,
      studentsCount: 18
    },
    {
      id: 'course-004',
      title: 'Docker for Developers',
      description: 'Learn Docker containerization for modern application development',
      price: 79.99,
      is_published: false,
      is_approved: true,
      is_deleted: false,
      created_at: '2024-04-15T08:45:00Z',
      updated_at: '2024-06-10T10:30:00Z',
      instructor: {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        email: 'john.instructor@example.com',
        name: 'Dr. John Smith',
        role: 'INSTRUCTOR',
        created_at: '2024-01-15T10:00:00Z',
      },
      categories: [
        {
          id: 'cat-004',
          name: 'DevOps',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      ],
      sections: [],
      thumbnail: 'https://images.unsplash.com/photo-1605745341075-1b7460b99df8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.6,
      studentsCount: 0
    }
  ],
  notifications: [
    {
      id: 'notif-001',
      title: 'New Course Enrollment',
      isRead: false,
      message: 'A student has enrolled in your "Complete React Developer Course"',
      timestamp: '2024-08-22T09:30:00Z'
    },
    {
      id: 'notif-002',
      title: 'New Course Review',
      isRead: false,
      message: 'Your course "Advanced TypeScript Patterns" received a 5-star review',
      timestamp: '2024-08-21T14:45:00Z'
    },
    {
      id: 'notif-003',
      title: 'Course Approval',
      isRead: true,
      message: 'Your course "Next.js Fullstack Development" has been approved',
      timestamp: '2024-08-20T11:15:00Z'
    },
    {
      id: 'notif-004',
      title: 'Payment Received',
      isRead: true,
      message: 'You received a payment of $99.99 for "Complete React Developer Course"',
      timestamp: '2024-08-19T16:20:00Z'
    }
  ],
  monthlyRevenue: [
    {
      year: 2024,
      month: 8,
      revenue: 1200
    },
    {
      year: 2024,
      month: 7,
      revenue: 1650
    },
    {
      year: 2024,
      month: 6,
      revenue: 1400
    }
  ],
  students: [
    {
      id: 'student-001',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      enrolledCourses: ['course-001', 'course-002'],
      enrollmentDate: '2024-08-15T10:30:00Z'
    },
    {
      id: 'student-002',
      name: 'Bob Williams',
      email: 'bob.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      enrolledCourses: ['course-001'],
      enrollmentDate: '2024-08-14T13:45:00Z'
    },
    {
      id: 'student-003',
      name: 'Carol Martinez',
      email: 'carol.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      enrolledCourses: ['course-003'],
      enrollmentDate: '2024-08-12T09:15:00Z'
    },
  ],
  totalStudents: 128,
  totalRevenue: 4250,
  ratings: 4.8
};
