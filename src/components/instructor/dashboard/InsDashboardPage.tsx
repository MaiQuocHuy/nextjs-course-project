import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { BookOpen, Users, DollarSign, Star, Plus } from 'lucide-react';
import { DashboardStats } from '@/types/instructor/dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useGetDashboardStatsQuery } from '@/services/instructor/statistics/dashboard-statistics';
import { useGetCoursesQuery } from '@/services/instructor/courses/courses-api';
import { useGetEnrolledStudentsQuery } from '@/services/instructor/students/students-ins-api';
import { StudentStatistics } from './StudentStatistics';
import { CourseStatistics } from './CourseStatistics';
import { useGetRecentEarningsQuery } from '@/services/instructor/earnings/earnings-ins-api';
import { RevenueStatistics } from './RevenueStatistics';
import { useGetAllRefundsQuery } from '@/services/instructor/refunds/refunds-ins-api';
import { RefundsTable } from '../refunds/RefundsTable';

// Import our custom components
import {
  SkeletonTable,
  SkeletonChart,
  SkeletonStatsCard,
} from '@/components/instructor/commom/skeletons/SkeletonComponents';
import {
  ChartError,
  DashboardError,
  StatsCardError,
  TableError,
} from '@/components/instructor/dashboard/DashboardErrorComponents';
import { SkeletonContainer } from '@/components/instructor/commom/skeletons/SkeletonContainer';
import { DashboardSkeleton } from './DashboardSkeleton';
import { GeneralStatistics } from './GeneralStatistics';

export const InsDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | {}>({});
  const { user } = useAuth();

  // Fetch dashboard statistics
  const {
    data: dashboardStats,
    isLoading: isLoadingDashboardStats,
    error: dashboardStatsError,
    refetch: refetchDashboardStats,
  } = useGetDashboardStatsQuery(undefined);

  // Fetch enrolled students
  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
    refetch: refetchEnrolledStudents,
  } = useGetEnrolledStudentsQuery({});

  // Fetch courses
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
    refetch: refetchCourses,
  } = useGetCoursesQuery({});

  // Fetch recent earnings
  const {
    data: recentEarnings,
    isLoading: isLoadingRecentEarnings,
    error: recentEarningsError,
    refetch: refetchRecentEarnings,
  } = useGetRecentEarningsQuery();

  // Fetch refunds
  const {
    data: refundsData,
    isLoading: isLoadingRefunds,
    error: refundsError,
    refetch: refetchRefunds,
  } = useGetAllRefundsQuery({});

  useEffect(() => {
    if (dashboardStats) {
      setStats({
        courseStatistics: {
          ...dashboardStats.courseStatistics,
          icon: <BookOpen className="h-4 w-4 text-primary" />,
          color: 'text-primary',
          href: '/instructor/courses',
        },
        studentStatistics: {
          ...dashboardStats.studentStatistics,
          icon: <Users className="h-4 w-4 text-success" />,
          color: 'text-success',
          href: '/instructor/students',
        },
        revenueStatistics: {
          ...dashboardStats.revenueStatistics,
          icon: <DollarSign className="h-4 w-4 text-destructive" />,
          href: '/instructor/earnings',
        },
        ratingStatistics: {
          ...dashboardStats.ratingStatistics,
          icon: <Star className={`h-4 w-4 text-instructor-accent`} />,
          color: 'text-instructor-accent',
        },
      });
    }
  }, [dashboardStats]);

  // Main dashboard error state
  const hasDashboardError =
    dashboardStatsError ||
    enrolledStudentsError ||
    coursesError ||
    recentEarningsError ||
    refundsError;

  // Function to retry all data fetches
  const handleRetryAll = () => {
    refetchDashboardStats();
    refetchEnrolledStudents();
    refetchCourses();
    refetchRecentEarnings();
    refetchRefunds();
  };

  // If everything is loading, show the dashboard skeleton
  if (
    isLoadingDashboardStats &&
    isLoadingEnrolledStudents &&
    isLoadingCourses &&
    isLoadingRecentEarnings &&
    isLoadingRefunds
  ) {
    return <DashboardSkeleton />;
  }

  // If there's an error with the main dashboard data, show the error component
  if (hasDashboardError) {
    return <DashboardError onRetry={handleRetryAll} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-card rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user && user.name ? user.name : 'Instructor'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your courses today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/instructor/courses/create-course">
              <Button className="shadow-elegant">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <SkeletonContainer
        data={stats}
        isLoading={isLoadingDashboardStats}
        error={dashboardStatsError}
        onRetry={refetchDashboardStats}
        loadingComponent={<SkeletonStatsCard />}
        errorComponent={<StatsCardError onRetry={refetchDashboardStats} />}
      >
        {(statsData) => <GeneralStatistics statsData={statsData} />}
      </SkeletonContainer>

      {/* Refunds Table */}
      <SkeletonContainer
        data={refundsData?.content}
        isLoading={isLoadingRefunds}
        error={refundsError}
        onRetry={refetchRefunds}
        loadingComponent={<SkeletonTable />}
        errorComponent={<TableError onRetry={refetchRefunds} />}
      >
        {(refundsContent) => (
          <RefundsTable
            filteredRefunds={refundsContent}
            refetch={refetchRefunds}
          />
        )}
      </SkeletonContainer>

      {/* Recent Courses */}
      <SkeletonContainer
        data={coursesData?.content}
        isLoading={isLoadingCourses}
        error={coursesError}
        onRetry={refetchCourses}
        loadingComponent={<SkeletonTable />}
        errorComponent={<ChartError onRetry={refetchCourses} />}
      >
        {(courses) => <CourseStatistics courses={courses} />}
      </SkeletonContainer>

      {/* Revenue Chart and Recent Students */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue */}
        <SkeletonContainer
          data={recentEarnings}
          isLoading={isLoadingRecentEarnings}
          error={recentEarningsError}
          onRetry={refetchRecentEarnings}
          loadingComponent={<SkeletonChart />}
          errorComponent={<ChartError onRetry={refetchRecentEarnings} />}
        >
          {(earnings) => <RevenueStatistics revenueStatistics={earnings} />}
        </SkeletonContainer>

        {/* Students */}
        <SkeletonContainer
          data={enrolledStudents?.content}
          isLoading={isLoadingEnrolledStudents}
          error={enrolledStudentsError}
          onRetry={refetchEnrolledStudents}
          loadingComponent={<SkeletonTable />}
          errorComponent={<TableError onRetry={refetchEnrolledStudents} />}
        >
          {(students) => <StudentStatistics enrolledStudents={students} />}
        </SkeletonContainer>
      </div>
    </div>
  );
};
