"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuizResultDetails } from "@/hooks/student/useQuizResults";
import type { QuizResults } from "@/types/student";
import { CheckCircle, XCircle, Clock, Book, Target } from "lucide-react";

interface QuizResultDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quizResult: QuizResults;
  isMobile?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function QuizResultDetailsContent({ quizResult }: { quizResult: QuizResults }) {
  const {
    data: quizDetails,
    isLoading,
    error,
  } = useQuizResultDetails(quizResult.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Failed to load quiz details</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please try again later
        </p>
      </div>
    );
  }

  if (!quizDetails) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-muted-foreground">No quiz details available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Overview - Mobile Optimized */}
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-3 sm:space-y-2">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Course
              </h4>
              <p className="font-semibold text-sm flex items-center">
                <Book className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{quizResult.course.title}</span>
              </p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Section
              </h4>
              <p className="font-semibold text-sm truncate">
                {quizResult.section.title}
              </p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-2">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Lesson
              </h4>
              <p className="font-semibold text-sm truncate">
                {quizResult.lesson.title}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">
                Completed At
              </h4>
              <p className="flex items-center text-sm">
                <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {formatDate(quizResult.completedAt)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Score Summary - Mobile Optimized */}
        <div className="grid gap-3 grid-cols-2">
          <div className="p-3 bg-muted rounded-lg text-center">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              Correct Answers
            </h4>
            <p className="text-lg font-bold">
              {quizResult.correctAnswers}/{quizResult.totalQuestions}
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              Final Score
            </h4>
            <p
              className={`text-lg font-bold ${getScoreColor(quizResult.score)}`}
            >
              {quizResult.score}%
            </p>
          </div>
        </div>
      </div>

      {/* Questions and Answers - Mobile Optimized */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4 text-base">Question Review</h4>
        <div className="space-y-4">
          {quizDetails.questions.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm flex items-start justify-between gap-2">
                  <span className="flex-1 leading-relaxed">
                    <span className="font-medium text-muted-foreground">
                      Q{index + 1}:
                    </span>{" "}
                    {question.questionText}
                  </span>
                  <div className="flex-shrink-0 mt-1">
                    {question.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="space-y-3">
                  {/* Answer Options - Mobile Optimized */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const optionLetter = String.fromCharCode(
                        65 + optionIndex
                      ); // A, B, C, D
                      const isStudentAnswer =
                        question.studentAnswer === optionLetter;
                      const isCorrectAnswer =
                        question.correctAnswer === optionLetter;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded-lg border flex items-start gap-2 text-sm ${
                            isCorrectAnswer
                              ? "border-green-500 bg-green-50 text-green-800"
                              : isStudentAnswer && !isCorrectAnswer
                              ? "border-red-500 bg-red-50 text-red-800"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 ${
                              isCorrectAnswer
                                ? "bg-green-600 text-white"
                                : isStudentAnswer && !isCorrectAnswer
                                ? "bg-red-600 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {optionLetter}
                          </div>
                          <span className="flex-1 leading-relaxed">
                            {option}
                          </span>
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            {isCorrectAnswer && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 text-xs px-1 py-0"
                              >
                                ✓
                              </Badge>
                            )}
                            {isStudentAnswer && (
                              <Badge
                                variant="secondary"
                                className={`text-xs px-1 py-0 ${
                                  isCorrectAnswer
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation - Mobile Optimized */}
                  {question.explanation && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1 text-xs">
                        Explanation:
                      </h5>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Summary - Mobile Optimized */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4 text-base">Performance Summary</h4>
        <div className="grid gap-3 grid-cols-2">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <span className="text-xs font-medium text-green-800 block">
                Correct
              </span>
              <span className="font-bold text-green-600 text-lg">
                {quizResult.correctAnswers}
              </span>
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <span className="text-xs font-medium text-red-800 block">
                Incorrect
              </span>
              <span className="font-bold text-red-600 text-lg">
                {quizResult.totalQuestions - quizResult.correctAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations - Mobile Optimized */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-2 text-sm">
            Recommendations
          </h5>
          <div className="space-y-1 text-xs text-blue-800 leading-relaxed">
            {quizResult.score >= 80 ? (
              <>
                <p>• Great job! You've shown strong understanding.</p>
                <p>• Continue to the next lesson to build on this knowledge.</p>
                {quizResult.score < 90 && (
                  <p>• Review missed questions for deeper understanding.</p>
                )}
              </>
            ) : (
              <>
                <p>• Review course materials and focus on missed areas.</p>
                <p>• Practice similar problems to reinforce understanding.</p>
                <p>• Consider retaking the quiz after additional study.</p>
                <p>• Don't hesitate to ask for help if needed.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizResultDetailsDialog({
  isOpen,
  onOpenChange,
  quizResult,
  isMobile = false,
}: QuizResultDetailsDialogProps) {
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SheetTitle className="text-lg font-semibold">
                Quiz Result Details
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 py-4">
                <QuizResultDetailsContent quizResult={quizResult} />
                <div className="h-4" />{" "}
                {/* Bottom padding for better scrolling */}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle>Quiz Result Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <QuizResultDetailsContent quizResult={quizResult} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
