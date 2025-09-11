import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SkeletonStatsCard,
  SkeletonTable,
  SkeletonSearchBar,
} from '@/components/instructor/commom/skeletons/SkeletonComponents';
import { SkeletonStudentCard } from '@/components/instructor/students/skeletons';

export const CourseOverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b space-x-6 pb-1">
        {/* Back button */}
        <Skeleton className="h-10 w-12" />
        <Skeleton className="h-10 w-28" /> {/* Overview */}
        <Skeleton className="h-10 w-28" /> {/* Content */}
        <Skeleton className="h-10 w-28" /> {/* Reviews */}
      </div>

      {/* Main content area */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {/* Banner Image */}
        <Skeleton className="w-full h-[300px]" />

        <div className="p-6 space-y-6">
          {/* Course Title and Edit button */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-32" /> {/* Edit Course button */}
          </div>

          {/* Course Metadata */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-40 rounded-full" />{' '}
            {/* Cloud Computing */}
            <Skeleton className="h-8 w-28 rounded-full" /> {/* BEGINNER */}
            <Skeleton className="h-8 w-28 rounded-full" /> {/* Duration */}
            <Skeleton className="h-8 w-24 rounded-full" /> {/* Draft */}
          </div>

          {/* Created/Updated dates */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Calendar icon */}
              <Skeleton className="h-5 w-40" /> {/* Created date */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Calendar icon */}
              <Skeleton className="h-5 w-40" /> {/* Updated date */}
            </div>
          </div>

          {/* Students Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" /> {/* Students Title */}
              <Skeleton className="h-10 w-32" /> {/* View All button */}
            </div>

            {/* Search Bar */}
            <SkeletonSearchBar />

            {/* Student Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <SkeletonStudentCard key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverviewSkeleton;
