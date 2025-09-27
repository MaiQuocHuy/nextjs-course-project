import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CourseFilterStatus,
  CourseSortBy,
  SortDirection,
} from "@/types/student/courseFilter";

export { CourseFilterStatus, CourseSortBy, SortDirection };

export interface CourseFilterState {
  searchQuery: string;
  progressFilter: CourseFilterStatus;
  status: string | null;
  sortBy: CourseSortBy;
  sortDirection: SortDirection;
}

const initialState: CourseFilterState = {
  searchQuery: "",
  progressFilter: CourseFilterStatus.ALL,
  status: null,
  sortBy: CourseSortBy.RECENT,
  sortDirection: SortDirection.DESC,
};

const courseFilterSlice = createSlice({
  name: "courseFilter",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setProgressFilter: (state, action: PayloadAction<CourseFilterStatus>) => {
      state.progressFilter = action.payload;
      // Map progress filter to enrollment status
      if (action.payload === CourseFilterStatus.COMPLETED) {
        state.status = "COMPLETED";
      } else if (action.payload === CourseFilterStatus.IN_PROGRESS) {
        state.status = "IN_PROGRESS";
      } else {
        state.status = null;
      }
    },
    setSortBy: (state, action: PayloadAction<CourseSortBy>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.progressFilter = CourseFilterStatus.ALL;
      state.status = null;
      state.sortBy = CourseSortBy.RECENT;
      state.sortDirection = SortDirection.DESC;
    },
  },
});

export const {
  setSearchQuery,
  setProgressFilter,
  setSortBy,
  setSortDirection,
  resetFilters,
} = courseFilterSlice.actions;
export default courseFilterSlice.reducer;
