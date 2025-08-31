import { 
  SkeletonSearchBar, 
  SkeletonStudentStats, 
  SkeletonStudentCard,
  SkeletonHeader, 
} from '../commom/skeletons/SkeletonComponents';

export const StudentSkeleton = () => {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {Array(6).fill(0).map((_, index) => (
          <SkeletonStudentCard key={index} />
        ))}
      </div>
    </div>
  );
};