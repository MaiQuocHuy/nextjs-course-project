"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CourseList } from "@/components/common/CourseList";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CoursePagination } from "@/components/course/CoursePagination";
import {
  CourseSkeleton,
  SidebarSkeleton,
} from "@/components/course/CourseSkeleton";
import { EmptyState } from "@/components/course/EmptyState";
import { useCourses } from "@/hooks/useCourses";
import { Course, useGetCoursesQuery } from "@/services/coursesApi";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
}

export default function CoursesPage() {
  const searchParams = useSearchParams();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    rating: 0,
  });

  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams?.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      // console.log("Search param from URL:", searchParam);
    }
  }, [searchParams]);

  // Build API filters
  const apiFilters = useMemo(() => {
    return {
      page: currentPage - 1, // API sử dụng 0-based indexing
      size: itemsPerPage,
      search: searchQuery.trim() || undefined,
      categoryId:
        filters.categories.length > 0 ? filters.categories[0] : undefined,
      // Chỉ gửi price khi khác default [0, 500]
      minPrice: filters.priceRange[0] !== 0 ? filters.priceRange[0] : undefined,
      maxPrice:
        filters.priceRange[1] !== 500 ? filters.priceRange[1] : undefined,
      // Chỉ gửi rating khi khác default 0
      averageRating: filters.rating > 0 ? filters.rating : undefined,
      sort:
        sortBy === "newest"
          ? "createdAt,desc"
          : sortBy === "oldest"
          ? "createdAt,asc"
          : sortBy === "price-low"
          ? "price,asc"
          : sortBy === "price-high"
          ? "price,desc"
          : sortBy === "rating"
          ? "price,desc" // Tạm thời dùng price thay vì averageRating
          : sortBy === "popular"
          ? "price,desc" // Tạm thời dùng price thay vì enrollCount
          : sortBy === "title"
          ? "title,asc"
          : undefined,
    };
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    filters.categories,
    filters.priceRange,
    filters.rating,
    sortBy,
  ]);

  // Fetch courses
  const {
    courses,
    totalPages,
    totalElements,
    currentPage: responsePage,
    pageSize,
    loading,
    error,
    refetch,
  } = useCourses(apiFilters);

  // Reset pagination when filters change
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [
  //   filters.categories,
  //   filters.priceRange,
  //   filters.rating,
  //   searchQuery,
  //   sortBy,
  // ]);

  // Handlers
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log("CoursesPage: Filters changed:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset về page 1 khi filter thay đổi
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback((query: string) => {
    console.log("Search query changed:", query);
    setSearchQuery(query); // Set to empty string sẽ trigger full course list
    setCurrentPage(1); // Reset to first page
  }, []);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset về page 1 khi thay đổi page size
  };

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Clear filters handler
  const handleClearFilters = useCallback(() => {
    console.log("CoursesPage: handleClearFilters called");
    setSearchQuery("");
    setSelectedLevel("all");
    setSortBy("newest");
    setCurrentPage(1);
    setFilters({
      categories: [],
      priceRange: [0, 500],
      rating: 0,
    });
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) count++;
    if (filters.rating > 0) count++;
    if (searchQuery.trim()) count++;
    if (selectedLevel !== "all") count++;
    return count;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block">
              <SidebarSkeleton />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <CourseSkeleton count={itemsPerPage} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            type="error"
            title="Failed to load courses"
            description={error}
            actionLabel="Try again"
            onAction={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <CourseSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0" role="main">
            {/* Header */}
            <CourseHeader
              totalCourses={courses.length}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onToggleSidebar={() => setIsSidebarOpen(true)}
              activeFiltersCount={getActiveFiltersCount()}
              className="mb-8"
            />

            {/* Results */}
            {courses.length === 0 ? (
              <EmptyState
                type="no-results"
                title="No courses found"
                description="Try adjusting your search terms or filters to find more courses."
                actionLabel="Clear all filters"
                onAction={handleClearFilters}
              />
            ) : (
              <>
                {/* Course List */}
                <div className="mb-8">
                  <CourseList
                    courses={courses}
                    variant={viewMode}
                    className={viewMode === "list" ? "grid-cols-1" : ""}
                  />
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <CoursePagination
                    currentPage={currentPage} // API sử dụng 0-based, UI sử dụng 1-based
                    totalPages={Math.max(totalPages, 1)} // Đảm bảo ít nhất 1 page
                    itemsPerPage={itemsPerPage}
                    totalItems={totalElements}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
