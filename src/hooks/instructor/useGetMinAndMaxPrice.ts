import { useMemo } from 'react';
import { Course } from '@/types/instructor/courses/courses';

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

/**
 * Custom hook to calculate min and max price from courses data
 */
export const useGetMinAndMaxPrice = (courses: Course[]): PriceRange => {
  return useMemo(() => {
    if (!courses || courses.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 999.99
      };
    }

    const coursePrices = courses.map((course) => course.price);
    const minPrice = Math.min(...coursePrices);
    const maxPrice = Math.max(...coursePrices);

    return {
      minPrice,
      maxPrice
    };
  }, [courses]);
};
