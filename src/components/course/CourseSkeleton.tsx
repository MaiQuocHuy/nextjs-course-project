"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CourseSkeletonProps {
  count?: number;
}

export function CourseSkeleton({ count = 6 }: CourseSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          {/* Thumbnail Skeleton */}
          <Skeleton className="h-48 w-full" />

          <CardHeader className="pb-3">
            {/* Category Badge Skeleton */}
            <Skeleton className="h-5 w-20 rounded-full" />

            {/* Title Skeleton */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />

            {/* Instructor Skeleton */}
            <Skeleton className="h-4 w-32" />
          </CardHeader>

          <CardContent className="pt-0">
            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-80 p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Filter Sections */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {index === 0 ? (
              // Categories skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : (
              // Slider skeleton
              <div className="space-y-4">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
