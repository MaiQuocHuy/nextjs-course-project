"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizResultsStats } from "@/hooks/student/useQuizResults";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { StatsError, StatsLoadingSkeleton } from "../ui";

export function QuizResultStats() {
  const { stats, isLoading, error, refetch } = useQuizResultsStats();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
          <p className="text-xs text-muted-foreground">Completed assessments</p>
        </CardContent>
      </Card>

      {/* High Scoring Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            High Scoring Quizzes
          </CardTitle>
          <Trophy className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.highScoringQuizzes}
          </div>
          <p className="text-xs text-muted-foreground">
            ≥ 80 score (Excellent!)
          </p>
        </CardContent>
      </Card>

      {/* Low Scoring Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Scoring Quizzes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.lowScoringQuizzes}
          </div>
          <p className="text-xs text-muted-foreground">
            ≤ 40 score (Need improvement)
          </p>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Award className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.averageScore}
          </div>
          <p className="text-xs text-muted-foreground">Overall performance</p>
        </CardContent>
      </Card>
    </div>
  );
}
