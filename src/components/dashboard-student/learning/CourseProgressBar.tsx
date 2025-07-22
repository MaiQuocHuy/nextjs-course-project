import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen } from "lucide-react";

interface CourseProgressBarProps {
  totalLessons: number;
  completedLessons: number;
  courseTitle: string;
}

export function CourseProgressBar({
  totalLessons,
  completedLessons,
  courseTitle,
}: CourseProgressBarProps) {
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {courseTitle}
              </span>
              <span className="text-sm text-gray-500">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{completedLessons} completed</span>
            </div>
            <span className="text-gray-500">
              {totalLessons - completedLessons} remaining
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
