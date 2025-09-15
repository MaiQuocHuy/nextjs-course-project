"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStatsQuery } from "@/services/student/studentApi";
import { BookOpen, Award, Clock, Target, TrendingUp } from "lucide-react";
import { StatsLoadingSkeleton } from "./ui/Loading";
import { StatsError } from "./ui/LoadingError";

export function DashboardStats() {
  const {
    data: dashboardStats,
    error,
    isLoading,
    refetch,
  } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  // Use stats from the dashboard data
  const {
    totalCourses = 0,
    completedCourses = 0,
    inProgressCourses = 0,
    lessonsCompleted = 0,
    totalLessons = 0,
  } = dashboardStats || {};

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
      value: lessonsCompleted,
      description: `${lessonsCompleted} of ${totalLessons} lessons completed`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
