"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardDataQuery } from "@/store/slices/student/studentApi";
import { BookOpen, Award, Clock, Target, TrendingUp } from "lucide-react";
import { LoadingError, DashboardStatsLoadingSkeleton } from "./ui";

export function DashboardStats() {
  const { data: dashboardData, error, isLoading, refetch } = useGetDashboardDataQuery({ page: 0, size: 20 });

  if (isLoading) {
    return <DashboardStatsLoadingSkeleton />;
  }

  if (error) {
    return <LoadingError onRetry={refetch} />;
  }
  
  // Use stats from the dashboard data
  const {
    totalCourses = 0,
    completedCourses = 0,
    inProgressCourses = 0,
    completedLessons = 0,
    totalLessons = 0,
  } = dashboardData?.stats || {};

  const statCards = [
    {
      title: "Total Courses",
      value: totalCourses,
      description: "Enrolled courses",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Completed Courses",
      value: completedCourses,
      description: "Courses you have completed",
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "In Progress Courses",
      value: inProgressCourses,
      description: "Courses you are currently working on",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Lessons Completed",
      value: completedLessons,
      description: `${completedLessons} of ${totalLessons} lessons completed`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const completionRate =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.title === "Lessons Completed" && completionRate > 0 && (
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {completionRate}% overall progress
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
