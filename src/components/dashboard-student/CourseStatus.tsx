import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";

interface CourseStatusProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function CourseStatus({
  status,
  className,
  showIcon = true,
}: CourseStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return {
          label: "Completed",
          variant: "secondary" as const,
          className:
            "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
          icon: CheckCircle,
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          variant: "secondary" as const,
          className:
            "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
          icon: Clock,
        };
      case "NOT_STARTED":
      default:
        return {
          label: "Not Started",
          variant: "outline" as const,
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
          icon: PlayCircle,
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {showIcon && <IconComponent className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
