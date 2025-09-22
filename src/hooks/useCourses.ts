import { useMemo } from 'react';
import { useGetCoursesQuery } from '@/services/coursesApi';
import type { CoursesFilter } from '@/services/coursesApi';

export const useCourses = (filters: CoursesFilter) => {
  // Tạo API filters, loại bỏ empty values
  const apiFilters = useMemo(() => {
    const params: any = {
      page: filters.page || 0, // API sử dụng 0-based indexing
      size: filters.size || 12,
    };

    // Chỉ thêm params khi có giá trị
    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }
    
    if (filters.categoryId?.trim()) {
      params.categoryId = filters.categoryId.trim();
    }
    
    // Chỉ thêm price filter khi khác default [0, 500]
    if (filters.minPrice !== undefined && filters.minPrice !== 0) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== 500) {
      params.maxPrice = filters.maxPrice;
    }
    
    if (filters.level?.trim()) {
      params.level = filters.level.trim();
    }
    
    // Chỉ thêm averageRating filter khi > 0
    if (filters.averageRating !== undefined && filters.averageRating > 0) {
      params.averageRating = filters.averageRating;
      console.log('Adding averageRating filter:', filters.averageRating);
    }
    
    if (filters.sort?.trim()) {
      params.sort = filters.sort.trim();
    }

    console.log('API Filters:', params);
    return params;
  }, [
    filters.page,
    filters.size,
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.level,
    filters.averageRating,
    filters.sort,
  ]);

  const { data, error, isLoading, refetch } = useGetCoursesQuery(apiFilters);

  return useMemo(() => ({
    courses: data?.content || [],
    totalPages: data?.page?.totalPages || 0,
    totalElements: data?.page?.totalElements || 0,
    currentPage: data?.page?.number || 0, // API trả về 0-based
    pageSize: data?.page?.size || 12,
    loading: isLoading,
    error: error ? 'Failed to fetch courses' : null,
    refetch,
  }), [data, isLoading, error, refetch]);
};

// Hook for featured courses (top-rated, limited number)
export function useFeaturedCourses(limit: number = 6) {
  return useCourses({
    size: limit,
    sort: 'price,desc' // Sử dụng price thay vì averageRating
  });
}
