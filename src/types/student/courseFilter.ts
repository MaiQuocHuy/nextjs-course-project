// Course Filter Enums for type safety across the application

export enum CourseFilterStatus {
  ALL = "all",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  NOT_STARTED = "not_started",
}

export enum CourseSortBy {
  RECENT = "recent",
  TITLE = "title",
  INSTRUCTOR = "instructor",
  PROGRESS = "progress",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

// Helper functions for display labels
export const getFilterStatusLabel = (status: CourseFilterStatus): string => {
  switch (status) {
    case CourseFilterStatus.ALL:
      return "All Courses";
    case CourseFilterStatus.COMPLETED:
      return "Completed";
    case CourseFilterStatus.IN_PROGRESS:
      return "In Progress";
    case CourseFilterStatus.NOT_STARTED:
      return "Not Started";
    default:
      return "Unknown";
  }
};

export const getSortByLabel = (sortBy: CourseSortBy): string => {
  switch (sortBy) {
    case CourseSortBy.RECENT:
      return "Recent";
    case CourseSortBy.TITLE:
      return "Title";
    case CourseSortBy.INSTRUCTOR:
      return "Instructor";
    case CourseSortBy.PROGRESS:
      return "Progress";
    default:
      return "Unknown";
  }
};

export const getSortDirectionLabel = (direction: SortDirection): string => {
  switch (direction) {
    case SortDirection.ASC:
      return "Ascending";
    case SortDirection.DESC:
      return "Descending";
    default:
      return "Unknown";
  }
};
