"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  setProgressFilter,
  setSortBy,
  setSortDirection,
  resetFilters,
  CourseFilterStatus,
  CourseSortBy,
  SortDirection,
} from "@/store/slices/student/courseFilterSlice";
import {
  getFilterStatusLabel,
  getSortByLabel,
  getSortDirectionLabel,
} from "@/types/student/courseFilter";
import { useDebounce } from "@/hooks/useDebounce";

export interface CourseFilterRef {
  resetFilters: () => void;
}

export const CourseFilter = forwardRef<CourseFilterRef>((props, ref) => {
  const dispatch = useAppDispatch();
  const {
    searchQuery: reduxSearchQuery,
    progressFilter,
    sortBy,
    sortDirection,
  } = useAppSelector((state) => state.courseFilter);

  // Local state for immediate UI updates
  const [localSearchQuery, setLocalSearchQuery] = useState(reduxSearchQuery);

  // Ref to track if we're currently resetting
  const isResettingRef = useRef(false);

  // Debounce the search query with 400ms delay
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 400);

  // Sync local state with Redux state when Redux state changes externally (e.g., reset)
  useEffect(() => {
    setLocalSearchQuery(reduxSearchQuery);
  }, [reduxSearchQuery]);

  // Dispatch to Redux when debounced value changes
  useEffect(() => {
    // Don't dispatch if we're currently resetting
    if (isResettingRef.current) {
      isResettingRef.current = false;
      return;
    }

    if (debouncedSearchQuery !== reduxSearchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, dispatch, reduxSearchQuery]);

  // Check if search is being debounced
  const isSearchPending = localSearchQuery !== reduxSearchQuery;

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleProgressFilterChange = (value: string) => {
    dispatch(setProgressFilter(value as CourseFilterStatus));
  };

  const handleSortByChange = (value: string) => {
    dispatch(setSortBy(value as CourseSortBy));
  };

  const handleSortDirectionChange = (value: string) => {
    dispatch(setSortDirection(value as SortDirection));
  };

  const handleReset = () => {
    // Set flag to prevent debounced effect from overriding reset
    isResettingRef.current = true;
    // Reset local search state immediately
    setLocalSearchQuery("");
    // Reset Redux state
    dispatch(resetFilters());
  };

  // Expose reset function to parent components
  useImperativeHandle(ref, () => ({
    resetFilters: handleReset,
  }));

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

        {/* Progress Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            onValueChange={handleProgressFilterChange}
            value={progressFilter}
          >
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

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select onValueChange={handleSortByChange} value={sortBy}>
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

        {/* Sort Direction Dropdown */}
        <div className="flex items-center gap-2">
          <Select
            onValueChange={handleSortDirectionChange}
            value={sortDirection}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortDirection.DESC}>
                {getSortDirectionLabel(SortDirection.DESC)}
              </SelectItem>
              <SelectItem value={SortDirection.ASC}>
                {getSortDirectionLabel(SortDirection.ASC)}
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
});

CourseFilter.displayName = "CourseFilter";
