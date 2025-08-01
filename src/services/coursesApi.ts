import { ApiResponse, PaginatedData } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  // prepareHeaders: (headers, { getState }) => {
  //   // Có thể thêm Authorization header nếu cần
  //   // const token = (getState() as RootState).auth.token;
  //   // if (token) {
  //   //   headers.set('Authorization', `Bearer ${token}`);
  //   // }
  //   return headers;
  // },
});

// const baseQueryWithSession = async (args:any, api:any, extraOptions:any) => {
//   const session = await getSession();
//   const token = session?.user?.accessToken; // lấy token từ session nè

//   const baseQuery = fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
//     prepareHeaders: (headers) => {
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`); // gắn token vào
//       }
//       return headers;
//     },
//   });

//   return baseQuery(args, api, extraOptions); // gọi tiếp API
// };

// Interfaces cho Course API
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnailUrl: string;
  enrollCount: number;
  averageRating: number;
  sectionCount: number;
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

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: baseQuery,
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    // Lấy danh sách courses với filter và pagination
getCourses: builder.query<PaginatedData<Course>, CoursesFilter>({
  query: (filters = {}) => {
    const params = new URLSearchParams();
    
    // Default values
    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 12).toString());
    
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
  }),
});

export const { 
  useGetCoursesQuery, 
  useGetCourseByIdQuery,
  useLazyGetCoursesQuery
} = coursesApi;
