"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuizResultDetailsDialog } from "./QuizResultDetailsDialog";
import type { QuizResults } from "@/types/student";
import { Eye, Clock, Book, GraduationCap } from "lucide-react";

interface QuizResultCardProps {
  quizResult: QuizResults;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

function getScoreColor(score: number) {
  if (score >= 75) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function QuizResultCard({ quizResult }: QuizResultCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const correctAnswersRate =
    (quizResult.correctAnswers / quizResult.totalQuestions) * 100;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Card className="transition-shadow hover:shadow-md h-fit">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base leading-tight truncate">
                  {quizResult.lesson.title}
                </h3>
              </div>
              {/* Score display in header */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">Score</p>
                <p
                  className={`text-xl font-bold ${getScoreColor(
                    quizResult.score
                  )}`}
                >
                  {quizResult.score}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center truncate">
                <Book className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{quizResult.course.title}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center truncate">
                <GraduationCap className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{quizResult.section.title}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Score details */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Correct Answers</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">
                    {quizResult.correctAnswers}/{quizResult.totalQuestions}
                  </p>
                  <p
                    className={`text-xs font-medium ${getScoreColor(
                      correctAnswersRate
                    )}`}
                  >
                    ({Math.round(correctAnswersRate)}%)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xs flex items-center justify-end">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(quizResult.completedAt)}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            {quizResult.canReview !== false && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(true)}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <QuizResultDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        quizResult={quizResult}
        isMobile={isMobile}
      />
    </>
  );
}
