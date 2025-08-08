"use client";

import { QuizResultCard } from "./QuizResultCard";
import { useQuizResults } from "@/hooks/useQuizResults";
import { Loader2, BookOpen, Target } from "lucide-react";

export function QuizResultList() {
  const { data: quizResults, isLoading, error } = useQuizResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">
            Failed to load quiz results
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {quizResults.content.map((quizResult) => (
        <QuizResultCard key={quizResult.id} quizResult={quizResult} />
      ))}
    </div>
  );
}
