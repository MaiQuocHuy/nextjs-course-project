import { useMemo } from 'react';
import { useGetCourseByIdQuery } from '@/services/coursesApi';

export const useCourseDetail = (courseId: string) => {
  console.log("useCourseDetail called with courseId:", courseId);
  
  const { data, error, isLoading, refetch } = useGetCourseByIdQuery(courseId, {
    skip: !courseId, // Skip nếu không có courseId
  });

  console.log("useGetCourseByIdQuery result:", {
    data,
    error,
    isLoading,
    courseId
  });

  return useMemo(() => ({
    course: data || null,
    loading: isLoading,
    error: error ? 'Failed to fetch course details' : null,
    refetch,
  }), [data, isLoading, error, refetch]);
};