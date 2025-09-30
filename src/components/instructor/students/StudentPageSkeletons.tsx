import { Skeleton } from '@/components/ui/skeleton';
import {
  SkeletonHeader,
  SkeletonSearchBar,
} from '../commom/skeletons/SkeletonComponents';

export const SkeletonStudentStats = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded" />
          <div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonStudentCard = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-card hover:shadow-elegant transition-shadow">
      <div className="p-4">
        {/* Image placeholder */}
        <Skeleton className="w-full h-48 rounded-t-lg mb-4" />

        {/* Student name and email */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-[40px]" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        {/* Enrolled courses */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  );
};

export const StudentsListSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <SkeletonStudentCard key={index} />
        ))}
    </div>
  );
};

export const StudentPageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <SkeletonHeader />

      {/* Search and Stats Skeleton */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <SkeletonSearchBar />
        </div>
        <SkeletonStudentStats />
      </div>

      {/* Students List Skeleton */}
      <StudentsListSkeleton />
    </div>
  );
};
