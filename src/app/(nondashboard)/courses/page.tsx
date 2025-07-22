"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { CourseCard } from "@/components/common/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Filter,
  Grid3X3,
  LayoutGrid,
  List,
  Search,
  SortAsc,
  TrendingUp,
  Star,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  Course,
  getPublishedCourses,
  mockCategories,
} from "@/app/data/courses";

// Loading skeleton component
function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state component
function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold mb-2">
        {searchQuery ? "No courses found" : "No courses available"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchQuery
          ? `We couldn't find any courses matching "${searchQuery}". Try adjusting your search or filters.`
          : "There are no courses available at the moment. Check back later for new content."}
      </p>
      {searchQuery && (
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear Search
        </Button>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [courses] = useState<Course[]>(getPublishedCourses());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);

  const coursesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Handle scroll to show/hide search bar
  useEffect(() => {
    const handleScroll = () => {
      if (!coursesRef.current || !ctaRef.current) return;

      const coursesBottom =
        coursesRef.current.offsetTop + coursesRef.current.offsetHeight;
      const ctaTop = ctaRef.current.offsetTop;
      const scrollY = window.scrollY;

      // Hide search bar when scrolling past courses section
      if (scrollY > coursesBottom - 100) {
        setIsSearchBarVisible(false);
      } else {
        setIsSearchBarVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.instructor?.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) =>
        course.categories?.some((cat) => cat.id === selectedCategory)
      );
    }

    // Sort courses
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "popular":
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [courses, searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              All Courses
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Your Next
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Learning Journey
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Explore our comprehensive collection of courses designed by
              industry experts to help you build skills and advance your career.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {courses.length}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Expert Courses
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Students
                </div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-pink-100 dark:border-pink-900">
                <div className="text-2xl font-bold text-pink-600 mb-1">
                  4.8★
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section
        className={`py-8 bg-gradient-to-b from-background to-muted/20 sticky top-16 z-30 backdrop-blur-md bg-background/95 border-b border-t transition-all duration-300 ${
          isSearchBarVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  ×
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Search className="w-3 h-3 mr-1" />"{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Filter className="w-3 h-3 mr-1" />
                  {
                    mockCategories.find((cat) => cat.id === selectedCategory)
                      ?.name
                  }
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid Section */}
      <section
        ref={coursesRef}
        className="py-12 bg-gradient-to-b from-muted/10 to-background"
      >
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {searchQuery ? "Search Results" : "All Courses"}
              </h2>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : `${filteredAndSortedCourses.length} courses found`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredAndSortedCourses.length === 0 && (
            <EmptyState searchQuery={searchQuery} />
          )}

          {/* Courses Grid */}
          {!isLoading && filteredAndSortedCourses.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {filteredAndSortedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>
          )}

          {/* Load More Button (for future pagination) */}
          {!isLoading && filteredAndSortedCourses.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8">
                Load More Courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        ref={ctaRef}
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              We're constantly adding new courses and would love to hear about
              what you'd like to learn next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => (window.location.href = "/contact")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              >
                Request a Course
              </Button>
              <Button
                onClick={() => (window.location.href = "/contact")}
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
