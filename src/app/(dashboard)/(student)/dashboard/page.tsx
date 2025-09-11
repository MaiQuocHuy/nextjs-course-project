import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { DashboardStats } from "@/components/dashboard-student/DashboardStats";
import { EnrolledCoursesSummary } from "@/components/dashboard-student/EnrolledCoursesSummary";
import { ActivityFeed } from "@/components/dashboard-student/ActivityFeed";
import { CertificatesSummary } from "@/components/dashboard-student/CertificatesSummary";

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

          {/* Right Column - Activity Feed and Certificates */}
          <div className="lg:col-span-1 space-y-6">
            <ActivityFeed />
            <CertificatesSummary />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
