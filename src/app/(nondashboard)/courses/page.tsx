"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Course,
  getPublishedCourses,
  searchCourses,
  getCoursesByCategory,
} from "@/app/data/courses";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
}

export default function CoursesPage() {
  const searchParams = useSearchParams();

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      console.log("Search param from URL:", searchParam); // Debug log
    }
  }, [searchParams]);

  // Load courses data
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const allCourses = getPublishedCourses();
        setCourses(allCourses);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
        console.error("Error loading courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filter and search courses
  const filteredAndSearchedCourses = useMemo(() => {
    let result = courses;

    // Apply search first
    if (searchQuery.trim()) {
      result = result.filter((course) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm) ||
          course.instructor?.name.toLowerCase().includes(searchTerm) ||
          course.categories?.some((cat) =>
            cat.name.toLowerCase().includes(searchTerm)
          )
        );
      });
    }

    // Apply filters
    result = result.filter((course) => {
      // Category filter
      if (filters.categories.length > 0) {
        const hasMatchingCategory = course.categories?.some((cat) =>
          filters.categories.includes(cat.id)
        );
        if (!hasMatchingCategory) return false;
      }

      // Price range filter
      if (
        course.price < filters.priceRange[0] ||
        course.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Rating filter
      if ((course.rating || 0) < filters.rating) {
        return false;
      }

      return true;
    });

    console.log("Search query:", searchQuery); // Debug log
    console.log("Filtered courses count:", result.length); // Debug log
    return result;
  }, [courses, searchQuery, filters]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    const sorted = [...filteredAndSearchedCourses];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "popular":
        return sorted.sort(
          (a, b) => (b.studentsCount || 0) - (a.studentsCount || 0)
        );
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [filteredAndSearchedCourses, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCourses, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      rating: 0,
    });
    setSearchQuery("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  // Loading state
  if (isLoading) {
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
            className="lg:block"
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
            {sortedCourses.length === 0 ? (
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
                    courses={paginatedCourses}
                    variant={viewMode}
                    className={viewMode === "list" ? "grid-cols-1" : ""}
                  />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CoursePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedCourses.length}
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
