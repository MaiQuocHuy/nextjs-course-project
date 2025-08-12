"use client";

import { QuizResultCard } from "./QuizResultCard";
import { useQuizResults } from "@/hooks/student/useQuizResults";
import { Loader2, BookOpen, Target } from "lucide-react";
import { QuizResultsLoadingSkeleton } from "../ui/Loading";
import { QuizResultError } from "../ui/LoadingError";

export function QuizResultList() {
  const { data: quizResults, isLoading, error, refetch } = useQuizResults();

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {quizResults.content.map((quizResult) => (
        <QuizResultCard key={quizResult.id} quizResult={quizResult} />
      ))}
    </div>
  );
}
