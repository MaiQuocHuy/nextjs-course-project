"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  type: "no-results" | "no-courses" | "error";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case "no-results":
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          title: title || "No courses found",
          description:
            description ||
            "Try adjusting your filters or search terms to find more courses.",
          actionLabel: actionLabel || "Clear filters",
          actionIcon: <RefreshCw className="w-4 h-4" />,
        };
      case "error":
        return {
          icon: <RefreshCw className="w-16 h-16 text-red-400" />,
          title: title || "Something went wrong",
          description:
            description || "We couldn't load the courses. Please try again.",
          actionLabel: actionLabel || "Try again",
          actionIcon: <RefreshCw className="w-4 h-4" />,
        };
      case "no-courses":
      default:
        return {
          icon: <BookOpen className="w-16 h-16 text-gray-400" />,
          title: title || "No courses available",
          description:
            description ||
            "There are no courses available at the moment. Check back later!",
          actionLabel: actionLabel || "Refresh",
          actionIcon: <RefreshCw className="w-4 h-4" />,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {/* Icon */}
        <div className="mb-6">{content.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {content.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {content.description}
        </p>

        {/* Action Button */}
        {onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            className="flex items-center gap-2"
          >
            {content.actionIcon}
            {content.actionLabel}
          </Button>
        )}

        {/* Additional suggestions for no-results */}
        {type === "no-results" && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Search suggestions:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Try different keywords</li>
              <li>• Check your spelling</li>
              <li>• Use more general terms</li>
              <li>• Remove some filters</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
