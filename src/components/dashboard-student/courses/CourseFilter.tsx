"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SortAsc, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  setSearchQuery,
  setFilter,
  setSort,
  resetFilters,
  CourseFilterStatus,
  CourseSortBy,
} from "@/store/slices/student/courseFilterSlice";
import {
  getFilterStatusLabel,
  getSortByLabel,
} from "@/types/student/courseFilter";
import { useDebounce } from "@/hooks/useDebounce";

export function CourseFilter() {
  const dispatch = useAppDispatch();
  const {
    searchQuery: reduxSearchQuery,
    filter,
    sort,
  } = useAppSelector((state) => state.courseFilter);

  // Local state for immediate UI updates
  const [localSearchQuery, setLocalSearchQuery] = useState(reduxSearchQuery);

  // Debounce the search query with 400ms delay
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 400);

  // Sync local state with Redux state when Redux state changes externally (e.g., reset)
  useEffect(() => {
    setLocalSearchQuery(reduxSearchQuery);
  }, [reduxSearchQuery]);

  // Dispatch to Redux when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== reduxSearchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, dispatch, reduxSearchQuery]);

  // Check if search is being debounced
  const isSearchPending = localSearchQuery !== reduxSearchQuery;

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleFilterChange = (value: string) => {
    dispatch(setFilter(value as CourseFilterStatus));
  };

  const handleSortChange = (value: string) => {
    dispatch(setSort(value as CourseSortBy));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalSearchQuery(""); // Reset local state immediately
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          {isSearchPending ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          )}
          <Input
            placeholder="Search courses..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select onValueChange={handleFilterChange} value={filter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CourseFilterStatus.ALL}>
                {getFilterStatusLabel(CourseFilterStatus.ALL)}
              </SelectItem>
              <SelectItem value={CourseFilterStatus.COMPLETED}>
                {getFilterStatusLabel(CourseFilterStatus.COMPLETED)}
              </SelectItem>
              <SelectItem value={CourseFilterStatus.IN_PROGRESS}>
                {getFilterStatusLabel(CourseFilterStatus.IN_PROGRESS)}
              </SelectItem>
              <SelectItem value={CourseFilterStatus.NOT_STARTED}>
                {getFilterStatusLabel(CourseFilterStatus.NOT_STARTED)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select onValueChange={handleSortChange} value={sort}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CourseSortBy.RECENT}>
                {getSortByLabel(CourseSortBy.RECENT)}
              </SelectItem>
              <SelectItem value={CourseSortBy.PROGRESS}>
                {getSortByLabel(CourseSortBy.PROGRESS)}
              </SelectItem>
              <SelectItem value={CourseSortBy.TITLE}>
                {getSortByLabel(CourseSortBy.TITLE)}
              </SelectItem>
              <SelectItem value={CourseSortBy.INSTRUCTOR}>
                {getSortByLabel(CourseSortBy.INSTRUCTOR)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="shrink-0">
          Reset
        </Button>
      </div>
    </div>
  );
}
