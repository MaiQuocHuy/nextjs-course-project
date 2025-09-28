import { CommonFilters, PaginatedData } from '../common';
import { Category } from './courses/courses';

export interface EnrolledCourse {
  courseId: string;
  title: string;
  progress: number;

  // Used in Student Details page
  description?: string;
  level?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: Category[];
  price?: number;
  averageRating?: number;
  totalRating?: number;
  enrolledAt?: string;
}

export interface Students {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
  enrolledCourses: EnrolledCourse[];
}

export interface StudentDetails {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
  enrolledCourses: PaginatedData<EnrolledCourse>;
}

export interface CourseEnrolledStudent {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
  progress: number;
  enrolledAt: string;
}

export interface StudentsFilters extends CommonFilters{
  search?: string;
}

export interface StudentDetailsFilters extends CommonFilters {
  studentId: string;
}
