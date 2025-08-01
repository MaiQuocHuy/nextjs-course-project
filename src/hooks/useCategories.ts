import { useMemo } from 'react';
import { useGetCategoriesQuery } from '@/services/coursesApi';

export const useCategories = () => {
  const { data, error, isLoading } = useGetCategoriesQuery();

  return useMemo(() => ({
    categories: data || [],
    loading: isLoading,
    error: error ? 'Failed to fetch categories' : null,
  }), [data, isLoading, error]);
};

// Sau đó trong CourseSidebar có thể dùng:
// const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();