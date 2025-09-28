import { Skeleton } from '@/components/ui/skeleton';
import {
  SkeletonHeader,
  SkeletonSearchBar,
} from '../../commom/skeletons/SkeletonComponents';

export const CourseCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Course thumbnail */}
      <Skeleton className="w-full h-[180px]" />

      <div className="p-4 space-y-4">
        {/* Status badge */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />{' '}
          {/* More options button */}
        </div>

        {/* Course title and description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Category */}
        <div className="pt-2">
          <Skeleton className="h-6 w-32 inline-block" />
        </div>

        {/* Stats: students and actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Student icon */}
            <Skeleton className="h-4 w-12" /> {/* Student count */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Action icon */}
            <Skeleton className="h-4 w-12" /> {/* Action count */}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center">
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Price and view button */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-16" /> {/* Price */}
          <Skeleton className="h-9 w-28" /> {/* View course button */}
        </div>
      </div>
    </div>
  );
};

export const CoursesGridSkeleton = () => {
  return (
    <>
      {/* Courses count */}
      {/* <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-32" />
      </div> */}

      {/* Courses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
      </div>
    </>
  );
};

export const CoursesSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <SkeletonHeader />

      {/* Search and filters area */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <SkeletonSearchBar />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" /> {/* Status filter */}
          <Skeleton className="h-10 w-28" /> {/* Categories filter */}
          <Skeleton className="h-10 w-28" /> {/* More filters */}
        </div>
      </div>

      {/* Courses grid skeleton */}
      <CoursesGridSkeleton />
    </div>
  );
};
