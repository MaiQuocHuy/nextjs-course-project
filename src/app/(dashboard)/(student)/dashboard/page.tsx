"use client";

import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { DashboardStats } from "@/components/dashboard-student/DashboardStats";
import { EnrolledCoursesSummary } from "@/components/dashboard-student/EnrolledCoursesSummary";
import { ActivityFeed } from "@/components/dashboard-student/ActivityFeed";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Dashboard Stats - Uses getDashboardData for optimized data fetching */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enrolled Courses - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <EnrolledCoursesSummary />
          </div>

          {/* Activity Feed - Uses getDashboardData for optimized data fetching */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
