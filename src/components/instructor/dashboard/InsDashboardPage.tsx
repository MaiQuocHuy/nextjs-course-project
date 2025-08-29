import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DashboardStats,
  mockInstructorDashboardData,
} from '@/types/instructor/dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useGetDashboardStatsQuery } from '@/services/instructor/statistics/dashboard-statistics';
import { useGetCoursesQuery } from '@/services/instructor/courses/courses-api';
import { useGetEnrolledStudentsQuery } from '@/services/instructor/students/students-ins-api';
import { StudentStatistics } from './StudentStatistics';
import { CourseStatistics } from './CourseStatistics';
import { useGetRecentEarningsQuery } from '@/services/instructor/earnings/earnings-ins-api';
import { RevenueStatistics } from './RevenueStatistics';

export const InsDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | {}>({});
  const [notifications, setNotifications] = useState(
    mockInstructorDashboardData.notifications
  );
  const { user } = useAuth();

  const {
    data: dashboardStats,
    isLoading: isLoadingDashboardStats,
    error: dashboardStatsError,
  } = useGetDashboardStatsQuery(undefined);

  const {
    data: enrolledStudents,
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetEnrolledStudentsQuery({});

  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useGetCoursesQuery({});

  const {
    data: recentEarnings,
    isLoading: isLoadingRecentEarnings,
    error: recentEarningsError,
  } = useGetRecentEarningsQuery();

  console.log(recentEarnings);

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
                <BookOpen className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map((stat, index) => (
            <Link
              href={stat[1].href ? stat[1].href : '#'}
              key={index}
              target="_blank"
              className={!stat[1].href ? 'pointer-events-none' : ''}
            >
              <Card key={stat[1].title} className="shadow-card gap-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat[1].title}
                  </CardTitle>
                  <>{stat[1].icon}</>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat[1].value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat[1].description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Courses */}
        <CourseStatistics courses={coursesData?.content} />

        {/* Recent Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length > 0 &&
              notifications
                .slice(0, notifications.length > 3 ? 3 : notifications.length)
                .map((notification) => (
                  <div key={notification.id} className="flex space-x-3">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        notification.isRead ? 'bg-muted' : 'bg-primary'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            <Link href="/instructor/notifications">
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart and Recent Students */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue */}
        <RevenueStatistics revenueStatistics={recentEarnings} />

        {/* Students */}
        <StudentStatistics enrolledStudents={enrolledStudents?.content} />
      </div>
    </div>
  );
};
