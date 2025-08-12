"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizResultsList } from "./QuizResultsList";

export interface QuizResult {
  id: string;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  status: "passed" | "failed";
  completedAt: string; // ISO string
}

// Mock quiz results data
const mockQuizResults: QuizResult[] = [
  {
    id: "quiz-001",
    quizTitle: "React Fundamentals Quiz",
    courseTitle: "React for Beginners",
    score: 8,
    totalQuestions: 10,
    status: "passed",
    completedAt: "2024-07-20T14:30:00Z",
  },
  {
    id: "quiz-002",
    quizTitle: "TypeScript Basics Assessment",
    courseTitle: "Advanced TypeScript",
    score: 6,
    totalQuestions: 12,
    status: "failed",
    completedAt: "2024-07-19T16:45:00Z",
  },
  {
    id: "quiz-003",
    quizTitle: "Next.js Routing Quiz",
    courseTitle: "Next.js Full Stack",
    score: 9,
    totalQuestions: 10,
    status: "passed",
    completedAt: "2024-07-18T10:15:00Z",
  },
  {
    id: "quiz-004",
    quizTitle: "Python Syntax Test",
    courseTitle: "Python Web Development",
    score: 5,
    totalQuestions: 15,
    status: "failed",
    completedAt: "2024-07-17T13:20:00Z",
  },
  {
    id: "quiz-005",
    quizTitle: "Docker Containers Quiz",
    courseTitle: "Docker & Kubernetes",
    score: 12,
    totalQuestions: 15,
    status: "passed",
    completedAt: "2024-07-16T11:30:00Z",
  },
  {
    id: "quiz-006",
    quizTitle: "GraphQL Schema Design",
    courseTitle: "GraphQL with Node.js",
    score: 7,
    totalQuestions: 8,
    status: "passed",
    completedAt: "2024-07-15T09:45:00Z",
  },
  {
    id: "quiz-007",
    quizTitle: "Vue.js Components Quiz",
    courseTitle: "Vue.js Fundamentals",
    score: 4,
    totalQuestions: 10,
    status: "failed",
    completedAt: "2024-07-14T15:10:00Z",
  },
  {
    id: "quiz-008",
    quizTitle: "AWS Services Overview",
    courseTitle: "AWS Cloud Practitioner",
    score: 18,
    totalQuestions: 20,
    status: "passed",
    completedAt: "2024-07-13T12:00:00Z",
  },
];

export function QuizResultsPage() {
  const passedCount = mockQuizResults.filter(
    (result) => result.status === "passed"
  ).length;
  const failedCount = mockQuizResults.filter(
    (result) => result.status === "failed"
  ).length;
  const totalScore = mockQuizResults.reduce(
    (sum, result) => sum + result.score,
    0
  );
  const totalQuestions = mockQuizResults.reduce(
    (sum, result) => sum + result.totalQuestions,
    0
  );
  const averageScore =
    totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
        <p className="text-muted-foreground">
          View your quiz performance and track your learning progress
        </p>
      </div>

      {/* Quiz Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQuizResults.length}</div>
            <p className="text-xs text-muted-foreground">
              Completed assessments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {passedCount}
            </div>
            <p className="text-xs text-muted-foreground">Successful attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-muted-foreground">Need improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Attempts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <QuizResultsList quizResults={mockQuizResults} />
        </CardContent>
      </Card>
    </div>
  );
}
