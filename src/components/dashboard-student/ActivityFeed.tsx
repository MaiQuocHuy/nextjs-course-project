"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, FileText, BookOpen, Award, Clock } from "lucide-react";
import { useGetDashboardDataQuery } from "@/services/student/studentApi";
import { LoadingError, ActivityFeedLoadingSkeleton } from "./ui";
import type { ActivityType } from "@/types/student";

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "LESSON_COMPLETED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "QUIZ_SUBMITTED":
      return <FileText className="h-4 w-4 text-blue-600" />;
    case "COURSE_ENROLLED":
      return <BookOpen className="h-4 w-4 text-purple-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getActivityBadge(type: ActivityType, score?: number) {
  switch (type) {
    case "LESSON_COMPLETED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    case "QUIZ_SUBMITTED":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {score ? `${score}%` : "Quiz"}
        </Badge>
      );
    case "COURSE_ENROLLED":
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Enrolled
        </Badge>
      );
    default:
      return null;
  }
}

export function ActivityFeed() {
  const {
    data: dashboardData,
    error,
    isLoading,
    refetch,
  } = useGetDashboardDataQuery({ page: 0, size: 20 });

  if (isLoading) {
    return <ActivityFeedLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-8">
            <LoadingError
              error={error}
              variant="inline"
              onRetry={refetch}
              message="Failed to load activities"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = dashboardData?.activities?.content || [];

  // Simple function to format relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          {activities && activities.length > 0 ? (
            <div className="space-y-4 pb-6">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 py-4 ${
                    index !== activities.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {getActivityBadge(activity.type, activity.score)}
                        <time className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.completed_at)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-6">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No recent activity found
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
