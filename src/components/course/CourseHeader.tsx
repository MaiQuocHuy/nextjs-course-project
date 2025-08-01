"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface CourseHeaderProps {
  totalCourses: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleSidebar: () => void;
  activeFiltersCount: number;
  className?: string;
}

export function CourseHeader({
  totalCourses,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onToggleSidebar,
  activeFiltersCount,
  className = "",
}: CourseHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Sync local search query with prop when it changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Improved search handler với auto-clear
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search để tránh call API liên tục
    debounceRef.current = setTimeout(() => {
      onSearchChange(value); // Gọi với value (có thể là empty string)
    }, 500);
  };

  // Handle manual search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear debounce timeout và search ngay lập tức
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    onSearchChange(localSearchQuery);
  };

  // Clear search và trả về danh sách đầy đủ
  const handleSearchClear = () => {
    setLocalSearchQuery("");

    // Clear debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Immediately clear search để load full course list
    onSearchChange("");
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {searchQuery ? (
              <>
                Found {totalCourses.toLocaleString()} courses matching "
                {searchQuery}"
              </>
            ) : (
              <>
                Discover {totalCourses.toLocaleString()} courses to advance your
                skills
              </>
            )}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          onClick={onToggleSidebar}
          className="lg:hidden relative"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses by title, instructor, or topic..."
              value={localSearchQuery}
              onChange={handleSearchInputChange}
              className="pl-10 pr-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              aria-label="Search courses"
            />

            {/* Clear button khi có text */}
            {localSearchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSearchClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="px-3"
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="px-3"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Search Query Badge */}
      {searchQuery && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing results for:
          </span>
          <Badge variant="secondary" className="gap-2">
            <Search className="h-3 w-3" />"{searchQuery}"
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClear}
              className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
}
