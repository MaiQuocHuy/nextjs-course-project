"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "./Sidebar";
import { useGetDashboardDataQuery } from "@/services/student/studentApi";
import { DashboardHeaderLoadingSkeleton } from "./ui/Loading";
import {
  StatsError,
  LoadingError,
  DashboardHeaderError,
} from "./ui/LoadingError";
import { useAuth } from "@/hooks/useAuth";

// // Mock user data
// const mockUser = {
//   id: "u-001",
//   name: "John Doe",
//   email: "john.doe@example.com",
//   avatar:
//     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
// };

export function DashboardHeader() {
  const {
    data: dashboardData,
    error,
    isLoading,
    refetch,
  } = useGetDashboardDataQuery({
    page: 0,
    size: 20,
  });
  const { user } = useAuth();
  if (isLoading) {
    return <DashboardHeaderLoadingSkeleton />;
  }
  if (error) {
    return <DashboardHeaderError onRetry={refetch} />;
  }
  const {
    totalCourses = 0,
    completedCourses = 0,
    inProgressCourses = 0,
    completedLessons = 0,
    totalLessons = 0,
  } = dashboardData?.stats || {};

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <MobileSidebar />

        <div className="flex-1 lg:ml-0">
          <div className="flex items-center justify-between">
            <Avatar className="h-8 w-8 mr-3 size-10">
              <AvatarImage
                src={user?.thumbnailUrl}
                alt={user?.name || "User"}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                Welcome, {user?.name || "Student"}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                You've completed {dashboardData?.stats?.completedLessons || 0}{" "}
                of {dashboardData?.stats?.totalLessons || 0} lessons
              </p>
            </div>

            <div className="flex items-center gap-4 mr-5">
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">
                    {dashboardData?.stats?.totalCourses || 0}
                  </div>
                  <div className="text-muted-foreground">Courses</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {dashboardData?.stats?.completedCourses || 0}
                  </div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
