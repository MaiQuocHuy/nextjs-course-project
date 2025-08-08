import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseFilterStatus, CourseSortBy } from "@/types/student/courseFilter";

export { CourseFilterStatus, CourseSortBy };

export interface CourseFilterState {
  searchQuery: string;
  filter: CourseFilterStatus;
  sort: CourseSortBy;
}

const initialState: CourseFilterState = {
  searchQuery: "",
  filter: CourseFilterStatus.ALL,
  sort: CourseSortBy.RECENT,
};

const courseFilterSlice = createSlice({
  name: "courseFilter",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<CourseFilterStatus>) => {
      state.filter = action.payload;
    },
    setSort: (state, action: PayloadAction<CourseSortBy>) => {
      state.sort = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.filter = CourseFilterStatus.ALL;
      state.sort = CourseSortBy.RECENT;
    },
  },
});

export const { setSearchQuery, setFilter, setSort, resetFilters } =
  courseFilterSlice.actions;
export default courseFilterSlice.reducer;
