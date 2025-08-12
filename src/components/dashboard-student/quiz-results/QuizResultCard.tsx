"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Badge as BadgeIcon,
  XCircle,
  Eye,
  Clock,
  BookOpen,
} from "lucide-react";
import { QuizResult } from "./QuizResultsPage";

interface QuizResultCardProps {
  quizResult: QuizResult;
}

function getStatusBadge(status: QuizResult["status"]) {
  switch (status) {
    case "passed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <BadgeIcon className="h-3 w-3 mr-1" />
          Passed
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return null;
  }
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

function getScorePercentage(score: number, total: number) {
  return Math.round((score / total) * 100);
}

function QuizResultDetails({ quizResult }: { quizResult: QuizResult }) {
  const percentage = getScorePercentage(
    quizResult.score,
    quizResult.totalQuestions
  );

  return (
    <div className="space-y-6">
      {/* Quiz Overview */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Quiz Title
            </h4>
            <p className="font-semibold">{quizResult.quizTitle}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Course
            </h4>
            <p className="font-semibold">{quizResult.courseTitle}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Score
            </h4>
            <p className="text-2xl font-bold">
              {quizResult.score}/{quizResult.totalQuestions}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Percentage
            </h4>
            <p
              className={`text-2xl font-bold ${
                percentage >= 70 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage}%
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Status
            </h4>
            <div className="mt-1">{getStatusBadge(quizResult.status)}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Completed At
          </h4>
          <p className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            {formatDate(quizResult.completedAt)}
          </p>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Performance Analysis</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm">Correct Answers</span>
            <span className="font-semibold text-green-600">
              {quizResult.score}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm">Incorrect Answers</span>
            <span className="font-semibold text-red-600">
              {quizResult.totalQuestions - quizResult.score}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm">Accuracy Rate</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Recommendations</h4>
        <div className="space-y-2">
          {quizResult.status === "failed" ? (
            <>
              <p className="text-sm text-muted-foreground">
                • Review the course materials for better understanding
              </p>
              <p className="text-sm text-muted-foreground">
                • Practice more exercises related to this topic
              </p>
              <p className="text-sm text-muted-foreground">
                • Consider retaking the quiz after studying
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                • Great job! You've demonstrated good understanding
              </p>
              <p className="text-sm text-muted-foreground">
                • Continue to the next module or course
              </p>
              {percentage < 90 && (
                <p className="text-sm text-muted-foreground">
                  • Review areas where you missed questions for deeper
                  understanding
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuizResultCard({ quizResult }: QuizResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const percentage = getScorePercentage(
    quizResult.score,
    quizResult.totalQuestions
  );

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {quizResult.quizTitle}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {quizResult.courseTitle}
            </p>
          </div>
          {getStatusBadge(quizResult.status)}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Score and Date */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-xl font-bold">
                {quizResult.score}/{quizResult.totalQuestions}
                <span
                  className={`text-sm ml-2 ${
                    percentage >= 70 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ({percentage}%)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(quizResult.completedAt)}
              </p>
            </div>
          </div>

          {/* View Details Button */}
          <div className="flex gap-2">
            {/* Desktop Dialog */}
            <div className="hidden md:block">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Quiz Result Details</DialogTitle>
                  </DialogHeader>
                  <QuizResultDetails quizResult={quizResult} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Sheet */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh]">
                  <SheetHeader>
                    <SheetTitle>Quiz Result Details</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto h-full pb-6">
                    <QuizResultDetails quizResult={quizResult} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
