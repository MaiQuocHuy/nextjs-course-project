import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="h-10 w-48 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
        <div className="h-5 w-64 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
      <div>
        <div className="h-10 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonStatsCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <div className="pt-4">
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );
};

export const SkeletonSearchBar = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

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
