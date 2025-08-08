import { ApiResponse, PaginatedData } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
});



// Interfaces cho Course API
export interface Course {
  rating: any;
  updatedAt: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnailUrl: string;
  enrollCount: number;
  averageRating: number;
  sectionCount: number;
  sections?: Section[];
  category: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
}


export interface CoursesFilter {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  sort?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "DISCUSSION" | "PROJECT" | "QUIZ";
  duration?: number;
  isPreview?: boolean;
}

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery,
  tagTypes: ['Course', 'Category'],
  endpoints: (builder) => ({
    // Lấy danh sách courses với filter và pagination
  getCourses: builder.query<PaginatedData<Course>, CoursesFilter>({
  query: (filters = {}) => {
    const params = new URLSearchParams();
    
    // Default values
    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 15).toString());
    
    // Optional filters - chỉ thêm khi có giá trị thực sự
    if (filters.search?.trim()) {
      params.append('search', filters.search.trim());
      console.log("Adding search filter:", filters.search.trim());
    }
    
    if (filters.categoryId?.trim()) {
      params.append('categoryId', filters.categoryId.trim());
      console.log("Adding categoryId filter:", filters.categoryId.trim());
    }
    
    // Quan trọng: Chỉ thêm price filters khi khác undefined
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      params.append('minPrice', filters.minPrice.toString());
      console.log("Adding minPrice filter:", filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      params.append('maxPrice', filters.maxPrice.toString());
      console.log("Adding maxPrice filter:", filters.maxPrice);
    }
    
    if (filters.level?.trim()) {
      params.append('level', filters.level.trim());
      console.log("Adding level filter:", filters.level.trim());
    }
    
    if (filters.sort?.trim()) {
      params.append('sort', filters.sort.trim());
      console.log("Adding sort filter:", filters.sort.trim());
    }

    const url = `/courses?${params.toString()}`;
    console.log('Final API URL:', url);
    
    return {
      url,
      method: "GET",
    };
  },
  transformResponse: (response: ApiResponse<PaginatedData<Course>>) => {
    console.log("Courses API Response:", response);
    if (response.statusCode !== 200) {
      throw new Error(response.message || 'Failed to fetch courses');
    }
    return response.data;
  },
  providesTags: (result) =>
    result
      ? [
          ...result.content.map(({ id }) => ({ type: 'Course' as const, id })),
          { type: 'Course', id: 'LIST' },
        ]
      : [{ type: 'Course', id: 'LIST' }],
  }),

    // Lấy danh sách categories
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Category[]>) => {
        console.log("Categories API Response:", response);
        if (response.statusCode !== 200) {
          throw new Error(response.message || 'Failed to fetch categories');
        }
        return response.data;
      },
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),


    // Lấy thông tin course theo ID
    getCourseById: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Course>) => {
        console.log("Course by ID API Response:", response);
        if (response.statusCode !== 200) {
          throw new Error(response.message || 'Failed to fetch course');
        }
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    // Lấy thông tin courses theo slug
    getCourseBySlug: builder.query<Course, string>({
      query: (slug) => ({
        url: `/courses/slug/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Course>) => {
        console.log("Course by Slug API Response:", response);
        if (response.statusCode !== 200) {
          throw new Error(response.message || 'Failed to fetch course by slug');
        }
        return response.data;
      },
      providesTags: (result, error, slug) => [{ type: 'Course', id: slug }],
    }),
  }),
});

export const { 
  useGetCoursesQuery, 
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useLazyGetCoursesQuery,
  useGetCategoriesQuery
} = coursesApi;
