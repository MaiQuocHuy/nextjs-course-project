import {
  SkeletonChart,
  SkeletonHeader,
  SkeletonStatsCard,
  SkeletonTable,
} from '../commom/skeletons/SkeletonComponents';

export const DashboardSkeleton = () => {
  return (
    <div className="grid gap-4">
      <SkeletonHeader />
      <SkeletonStatsCard />
      <SkeletonTable />
      <SkeletonChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
};
