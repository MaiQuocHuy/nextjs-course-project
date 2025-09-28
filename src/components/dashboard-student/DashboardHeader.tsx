"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./Sidebar";
import { useGetDashboardStatsQuery } from "@/services/student/studentApi";
import { DashboardHeaderLoadingSkeleton } from "./ui/Loading";
import {
  StatsError,
  LoadingError,
  DashboardHeaderError,
} from "./ui/LoadingError";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { NotificationTrigger } from "../common/NotificationTrigger";

// // Mock user data
// const mockUser = {
//   id: "u-001",
//   name: "John Doe",
//   email: "john.doe@example.com",
//   avatar:
//     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
// };

export function DashboardHeader() {
  const { data, error, isLoading, refetch } = useGetDashboardStatsQuery();
  const { user, logout } = useAuth();
  if (isLoading) {
    return <DashboardHeaderLoadingSkeleton />;
  }
  if (error) {
    return <DashboardHeaderError onRetry={refetch} />;
  }

  const dashboardStats = data || null;

  const handleLogout = async () => {
    await logout();
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <MobileSidebar />

        <div className="flex-1 lg:ml-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3 size-10">
                <AvatarImage
                  src={user?.thumbnailUrl}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="sm:text-sm md:text-xl font-semibold text-foreground">
                  Welcome, {user?.name || "Student"}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Completed {dashboardStats?.lessonsCompleted || 0}/
                  {dashboardStats?.totalLessons || 0} lessons
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-4 text-sm mr-4">
                <div className="text-center">
                  <div className="font-medium">
                    {dashboardStats?.totalCourses || 0}
                  </div>
                  <div className="text-muted-foreground">Courses</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {dashboardStats?.completedCourses || 0}
                  </div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
              </div>

              {/* Notification Bell */}
              <NotificationTrigger />

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center lg:border"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Student"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      <span>Back to Home</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <button
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
