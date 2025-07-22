import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  completedLessons: number;
  totalLessons: number;
}

export function CourseProgress({
  completedLessons,
  totalLessons,
}: CourseProgressProps) {
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {completedLessons}/{totalLessons} lessons ({progressPercentage}%)
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
