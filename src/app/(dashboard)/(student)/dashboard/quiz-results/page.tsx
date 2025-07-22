"use client";

import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { QuizResultsPage } from "@/components/dashboard-student/quiz-results/QuizResultsPage";

export default function QuizResultsPageRoute() {
  return (
    <DashboardLayout>
      <QuizResultsPage />
    </DashboardLayout>
  );
}
