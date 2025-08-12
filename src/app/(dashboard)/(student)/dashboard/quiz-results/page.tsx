import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { QuizResultStats } from "@/components/dashboard-student/quiz-results/QuizResultStats";
import { QuizResultList } from "@/components/dashboard-student/quiz-results/QuizResultList";

export default function QuizResultsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
          <p className="text-muted-foreground">
            View your quiz performance and track your learning progress
          </p>
        </div>

        {/* Quiz Statistics */}
        <QuizResultStats />

        {/* Quiz Results List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Quiz Attempts</h2>
          <QuizResultList />
        </div>
      </div>
    </DashboardLayout>
  );
}
