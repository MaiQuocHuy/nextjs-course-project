"use client";

import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { ReviewsPage } from "@/components/dashboard-student/reviews/ReviewsPage";

export default function ReviewsPageRoute() {
  return (
    <DashboardLayout>
      <ReviewsPage />
    </DashboardLayout>
  );
}
