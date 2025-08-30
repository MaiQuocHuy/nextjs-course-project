export interface Page {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  content: T[];
  page: Page;
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
