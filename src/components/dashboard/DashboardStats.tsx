"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, Target, TrendingUp } from "lucide-react";

// Mock stats data
const mockStats = {
  total_courses: 3,
  completed_lessons: 12,
  total_lessons: 18,
  certificates_earned: 1,
  hours_spent: 24,
};

export function DashboardStats() {
  const stats = mockStats;

  const statCards = [
    {
      title: "Total Courses",
      value: stats?.total_courses || 0,
      description: "Enrolled courses",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Lessons Completed",
      value: stats?.completed_lessons || 0,
      description: `of ${stats?.total_lessons || 0} total`,
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Certificates",
      value: stats?.certificates_earned || 0,
      description: "Earned certificates",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      title: "Hours Spent",
      value: stats?.hours_spent || 0,
      description: "Learning time",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const completionRate = stats?.total_lessons
          ? Math.round((stats.completed_lessons / stats.total_lessons) * 100)
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
                  {completionRate}% complete
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
