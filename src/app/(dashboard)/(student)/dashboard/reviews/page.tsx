import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { ReviewList } from "@/components/dashboard-student/reviews/ReviewList";
import { ReviewStats } from "@/components/dashboard-student/reviews/ReviewStats";

export default function ReviewsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all your course reviews
          </p>
        </div>

        {/* Review Stats */}
        <ReviewStats />

        {/* Review List */}
        <ReviewList />
      </div>
    </DashboardLayout>
  );
}
