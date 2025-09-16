"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStatsQuery } from "@/services/student/studentApi";
import { BookOpen, Award, Clock, Target, TrendingUp } from "lucide-react";
import { StatsLoadingSkeleton } from "./ui/Loading";
import { StatsError } from "./ui/LoadingError";

export function DashboardStats() {
  const { data, error, isLoading, refetch } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  const stats = data || null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.totalCourses}
          </div>
          <p className="text-xs text-muted-foreground">Completed assessments</p>
        </CardContent>
      </Card>

      {/* Completed Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Courses
          </CardTitle>
          <Award className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats?.completedCourses}
          </div>
          <p className="text-xs text-muted-foreground">
            Courses you have completed
          </p>
        </CardContent>
      </Card>

      {/* In Progress Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            In Progress Courses
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats?.inProgressCourses}
          </div>
          <p className="text-xs text-muted-foreground">
            Courses you are currently working on
          </p>
        </CardContent>
      </Card>

      {/* Lessons Completed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lessons Completed
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats?.lessonsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.lessonsCompleted} of {stats?.totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
