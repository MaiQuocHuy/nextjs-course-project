import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface CourseStatusProps {
  isCompleted: boolean;
}

export function CourseStatus({ isCompleted }: CourseStatusProps) {
  if (isCompleted) {
    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 flex-shrink-0"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="bg-blue-100 text-blue-800 flex-shrink-0"
    >
      <Clock className="h-3 w-3 mr-1" />
      In Progress
    </Badge>
  );
}
