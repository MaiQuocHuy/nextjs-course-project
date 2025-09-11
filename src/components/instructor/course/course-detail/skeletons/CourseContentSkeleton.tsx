import { Skeleton } from "@/components/ui/skeleton";

const CourseContentSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" /> {/* Edit Content button */}
      </div>

      {/* Section 1 */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" /> {/* Expand icon */}
          <Skeleton className="h-5 w-5 rounded-md" /> {/* Book icon */}
          <Skeleton className="h-6 w-24" /> {/* Section 1 text */}
          <Skeleton className="h-4 w-40" /> {/* Section description */}
        </div>

        {/* Description */}
        <div className="pl-8 mt-4">
          <Skeleton className="h-4 w-full max-w-md mb-4" />
          
          {/* Lessons */}
          <div className="mt-4">
            <Skeleton className="h-5 w-24 mb-4" /> {/* Lessons (2) */}
            
            {/* Lesson 1 */}
            <div className="border rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-md" /> {/* Expand icon */}
                <Skeleton className="h-5 w-5 rounded-md" /> {/* Video icon */}
                <Skeleton className="h-5 w-24" /> {/* Lesson 1 text */}
                <Skeleton className="h-4 w-24" /> {/* Lesson description */}
                <div className="ml-auto">
                  <Skeleton className="h-5 w-16 rounded-full" /> {/* Video badge */}
                </div>
              </div>
            </div>
            
            {/* Lesson 2 */}
            <div className="border rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-md" /> {/* Expand icon */}
                <Skeleton className="h-5 w-5 rounded-md" /> {/* Quiz icon */}
                <Skeleton className="h-5 w-24" /> {/* Lesson 2 text */}
                <Skeleton className="h-4 w-24" /> {/* Lesson description */}
                <div className="ml-auto">
                  <Skeleton className="h-5 w-16 rounded-full" /> {/* Quiz badge */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" /> {/* Expand icon */}
          <Skeleton className="h-5 w-5 rounded-md" /> {/* Book icon */}
          <Skeleton className="h-6 w-24" /> {/* Section 2 text */}
          <Skeleton className="h-4 w-40" /> {/* Section description */}
        </div>
      </div>
    </div>
  );
};

export default CourseContentSkeleton;
