"use client";

import { QuizResultCard } from "./QuizResultCard";
import { useQuizResults } from "@/hooks/student/useQuizResults";
import { Loader2, BookOpen, Target } from "lucide-react";
import { QuizResultsLoadingSkeleton } from "../ui/Loading";
import { QuizResultError } from "../ui/LoadingError";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";
import { useRouter } from "next/navigation";
import type { QuizResults } from "@/types/student";

export function QuizResultList() {
  const router = useRouter();
  const { data: quizResults, isLoading, error, refetch } = useQuizResults();

  // Pagination với 6 quiz results per page
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedResults,
    handlePageChange,
  } = usePagination(quizResults?.content || [], 6);

  const handleTryAgain = (quizResult: QuizResults) => {
    // Navigate to the lesson to retake the quiz
    router.push(`/dashboard/learning/${quizResult.course.id}`);
  };

  if (isLoading) {
    return <QuizResultsLoadingSkeleton />;
  }

  if (error) {
    return <QuizResultError onRetry={() => refetch()} />;
  }

  if (!quizResults?.content || quizResults.content.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            No quiz results found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete some quizzes to see your results here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {paginatedResults.map((quizResult) => (
          <QuizResultCard
            key={quizResult.id}
            quizResult={quizResult}
            onTryAgain={handleTryAgain}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
