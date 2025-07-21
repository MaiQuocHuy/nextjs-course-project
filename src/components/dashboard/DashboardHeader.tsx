"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "./Sidebar";

// Mock user data
const mockUser = {
  id: "u-001",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

// Mock stats data
const mockStats = {
  total_courses: 3,
  completed_lessons: 12,
  total_lessons: 18,
  certificates_earned: 1,
  hours_spent: 24,
};

export function DashboardHeader() {
  const user = mockUser;
  const stats = mockStats;

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
              <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                Welcome, {user?.name || "Student"}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                You've completed {stats?.completed_lessons || 0} of{" "}
                {stats?.total_lessons || 0} lessons
              </p>
            </div>

            <div className="flex items-center gap-4 mr-5">
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{stats?.total_courses || 0}</div>
                  <div className="text-muted-foreground">Courses</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {stats?.certificates_earned || 0}
                  </div>
                  <div className="text-muted-foreground">Certificates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
