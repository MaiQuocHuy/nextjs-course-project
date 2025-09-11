import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  Course,
  CourseDetail,
  CoursesFilter,
} from "@/types/instructor/courses";
import { ApiResponse, PaginatedData } from "@/types/common";

const errorsHandler = (response: { status: number; data: any }) => {
  let errorMessage = "Failed to create course";
  if (response.status === 409) {
    errorMessage = "A course with this title already exists";
  } else {
    errorMessage = response.data.message;
  }
  return {
    status: response.status,
    message: errorMessage,
    data: response.data,
  };
};

export const coursesInstSlice = createApi({
  reducerPath: "coursesInstSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    // Fetch courses for instructor
    getCourses: builder.query<PaginatedData<Course>, CoursesFilter>({
      query: (courseParams) => {
        let url = `/instructor/courses?page=${courseParams.page || 0}&size=${
          courseParams.size || 10
        }&sort=${courseParams.sort || "createdAt,desc"}`;

        // Add search term if provided
        if (courseParams.search) {
          url += `&search=${encodeURIComponent(courseParams.search)}`;
        }

        // Add status filter if provided
        if (courseParams.status) {
          url += `&status=${encodeURIComponent(courseParams.status)}`;
        }

        // Add category IDs if provided
        if (courseParams.categoryIds && courseParams.categoryIds.length > 0) {
          courseParams.categoryIds.forEach((categoryId) => {
            url += `&categoryIds=${encodeURIComponent(categoryId)}`;
          });
        }

        // Add price range filters if provided
        if (courseParams.minPrice !== undefined) {
          url += `&minPrice=${courseParams.minPrice}`;
        }

        if (courseParams.maxPrice !== undefined) {
          url += `&maxPrice=${courseParams.maxPrice}`;
        }

        if (courseParams.rating) {
          url += `&rating=${encodeURIComponent(courseParams.rating)}`;
        }

        if (courseParams.level) {
          url += `&level=${encodeURIComponent(courseParams.level)}`;
        }

        if (courseParams.isPublished !== undefined) {
          url += `&isPublished=${encodeURIComponent(courseParams.isPublished)}`;
        }
        console.log("Constructed URL:", url);

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<PaginatedData<Course>>) => {
        // console.log('Response data:', response);
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }: { id: string }) => ({
                type: "Courses" as const,
                id,
              })),
              { type: "Courses", id: "LIST" },
            ]
          : [{ type: "Courses", id: "LIST" }],
    }),

    // Fetch published courses for instructor without pagination
    getPublishedCourses: builder.query<Course[], void>({
      query: () => ({
        url: `/instructor/courses/published`,
        method: "GET",
      }),
      providesTags: ["Courses"],
      transformResponse: (response: { data: Course[] }) => {
        return response.data;
      },
    }),

    // Fetch course details
    getCourseById: builder.query<CourseDetail, string>({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        // console.log('Course details response:', response.data);
        return response.data;
      },
      providesTags: (result) => {
        return result ? [{ type: "Courses", id: result.id }] : [];
      },
    }),

    // Create a new course
    createCourse: builder.mutation({
      query: (BasicInfoData) => {
        const formData = new FormData();
        formData.append("title", BasicInfoData.title);
        formData.append("description", BasicInfoData.description);
        formData.append("price", BasicInfoData.price.toString());
        if (BasicInfoData.categoryIds) {
          BasicInfoData.categoryIds.forEach((id: string) => {
            formData.append("categoryIds", id);
          });
        }
        formData.append("level", BasicInfoData.level);
        if (BasicInfoData.file) {
          formData.append("thumbnail", BasicInfoData.file);
        }
        return {
          url: "/instructor/courses",
          method: "POST",
          body: formData,
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) =>
        errorsHandler(response),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    // Update an existing course
    updateCourse: builder.mutation({
      query: (courseData) => {
        const formData = new FormData();
        formData.append("id", courseData.id);
        if (courseData.title) {
          formData.append("title", courseData.title);
        }
        if (courseData.description) {
          formData.append("description", courseData.description);
        }
        if (courseData.price) {
          formData.append("price", courseData.price.toString());
        }
        if (courseData.categoryIds) {
          courseData.categoryIds.forEach((id: string) => {
            formData.append("categoryIds", id);
          });
        }
        if (courseData.level) {
          formData.append("level", courseData.level);
        }
        if (courseData.file) {
          formData.append("thumbnail", courseData.file);
        }
        return {
          url: `/instructor/courses/${courseData.id}`,
          method: "PATCH",
          body: formData,
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) =>
        errorsHandler(response),
      invalidatesTags: (result, error, data) => [
        { type: "Courses", id: "LIST" },
        { type: "Courses", id: data.id },
      ],
    }),

    // Delete a course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: "Courses", id: "LIST" },
        { type: "Courses", id: courseId },
      ],
    }),

    // Update course status
    updateCourseStatus: builder.mutation({
      query: ({ courseId, status }) => ({
        url: `/instructor/courses/${courseId}/status`,
        method: "PATCH",
        body: { status: status.toUpperCase() },
      }),
      transformErrorResponse: (response: { status: number; data: any }) =>
        errorsHandler(response),
      invalidatesTags: (result, error, data) => [
        { type: "Courses", id: "LIST" },
        { type: "Courses", id: data.courseId },
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetPublishedCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseStatusMutation,
} = coursesInstSlice;
