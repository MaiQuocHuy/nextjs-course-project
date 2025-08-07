import { useMemo } from 'react';
// import { useGetCourseByIdQuery } from '@/services/coursesApi';
import { useGetCourseBySlugQuery } from '@/services/coursesApi';


export const useCourseDetail = (courseSlug: string) => {
  console.log("useCourseDetail called with courseSlug:", courseSlug);
  
  const { data, error, isLoading, refetch } = useGetCourseBySlugQuery(courseSlug, {
    skip: !courseSlug, // Skip nếu không có courseSlug
  });

  console.log("useGetCourseBySlugQuery result:", {
    data,
    error,
    isLoading,
    courseSlug
  });

  return useMemo(() => ({
    course: data || null,
    loading: isLoading,
    error: error ? 'Failed to fetch course details' : null,
    refetch,
  }), [data, isLoading, error, refetch]);
};