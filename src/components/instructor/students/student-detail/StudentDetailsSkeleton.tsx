import React from 'react';
import { 
  SkeletonCard
} from '@/components/instructor/commom/skeletons/SkeletonComponents';
import { Skeleton } from '@/components/ui/skeleton';

export const StudentDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Student profile card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-start gap-4">
          {/* Profile avatar */}
          <div className="flex-shrink-0">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          
          {/* Student info */}
          <div className="flex-grow">
            <Skeleton className="h-7 w-40 mb-1" />
            <Skeleton className="h-4 w-52 mb-4" />
            
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-8">
              {/* Enrolled courses */}
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-7 w-6" />
              </div>
              
              {/* Completed quizzes */}
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-7 w-6" />
              </div>
              
              {/* Average quiz score */}
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-7 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="border-b">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Enrolled courses section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        
        {/* Course cards - 3 cards in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              {/* Course image */}
              <Skeleton className="w-full h-48" />
              
              {/* Course content */}
              <div className="p-4 space-y-4">
                {/* Course title */}
                <Skeleton className="h-6 w-4/5" />
                
                {/* Tags */}
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                
                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
                
                {/* Date */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}