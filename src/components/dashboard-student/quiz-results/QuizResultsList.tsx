"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizResult } from "./QuizResultsPage";
import { QuizResultCard } from "./QuizResultCard";

interface QuizResultsListProps {
  quizResults: QuizResult[];
}

export function QuizResultsList({ quizResults }: QuizResultsListProps) {
  return (
    <div className="w-full">
      <ScrollArea className="h-[600px] w-full">
        <div className="space-y-4 p-4">
          {quizResults.map((quizResult) => (
            <QuizResultCard key={quizResult.id} quizResult={quizResult} />
          ))}
          {quizResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No quiz results found</p>
              <p className="text-sm mt-1">
                Complete some quizzes to see your results here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
