"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string, completed: boolean) => void;
}

export function MarkCompleteButton({
  lessonId,
  isCompleted,
  onToggleComplete,
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onToggleComplete(lessonId, !isCompleted);
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "w-full flex items-center gap-2 transition-all",
        isCompleted
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-primary hover:bg-primary/90"
      )}
    >
      {isCompleted ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isLoading
        ? "Updating..."
        : isCompleted
        ? "Mark as Incomplete"
        : "Mark as Complete"}
    </Button>
  );
}
