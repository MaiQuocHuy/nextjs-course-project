"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, FileText, BookOpen, Award, Clock } from "lucide-react";
import { useGetRecentActivitiesQuery } from "@/services/student/studentApi";
import { LoadingError, ActivityFeedLoadingSkeleton } from "./ui";
import { ActivityFeedError } from "./ui/LoadingError";
import { getActivityIcon, getActivityBadge } from "@/utils/student";

export function ActivityFeed() {
  const {
    data: activities,
    error,
    isLoading,
    refetch,
  } = useGetRecentActivitiesQuery();

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
          <div className="px-6 py-0">
            <ActivityFeedError onRetry={refetch} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activityList = activities || [];

  // Simple function to format relative time using local timezone
  const formatTimeAgo = (dateString: string) => {
    // Ensure we're working with local timezone
    const date = new Date(dateString);
    const now = new Date();

    // Calculate difference in milliseconds considering timezone offset
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <Card className="h-fit gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          {activityList && activityList.length > 0 ? (
            <div className="space-y-4 pb-6">
              {activityList.map((activity, index) => (
                <div
                  key={`${activity.courseId}-${activity.timestamp}-${index}`}
                  className={`flex items-start space-x-4 py-4 ${
                    index !== activityList.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.activityType)}
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
                        {getActivityBadge(activity.activityType)}{" "}
                        <time className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
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
