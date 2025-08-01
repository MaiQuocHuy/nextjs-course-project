import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingProps {
  message?: string;
  variant?: "default" | "card" | "inline";
  size?: "sm" | "md" | "lg";
}

export function Loading({
  message = "Loading...",
  variant = "default",
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-muted-foreground`}
        />
        <span className={`${textSizeClasses[size]} text-muted-foreground`}>
          {message}
        </span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className="w-full">
        <CardContent className="py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="relative">
              <Loader2
                className={`${sizeClasses[size]} animate-spin text-primary`}
              />
            </div>
            <div className="text-center space-y-1 sm:space-y-2">
              <p
                className={`${textSizeClasses[size]} font-medium text-foreground`}
              >
                {message}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Please wait while we load your content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] w-full p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <div className="relative">
          <Loader2
            className={`${sizeClasses[size]} animate-spin text-primary`}
          />
        </div>
        <div className="text-center space-y-1 sm:space-y-2">
          <p className={`${textSizeClasses[size]} font-medium text-foreground`}>
            {message}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading components for specific use cases
export function CoursesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted animate-pulse rounded-md"></div>
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-3">
              <div className="aspect-video bg-muted animate-pulse rounded-md mb-3"></div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                </div>
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            <div className="p-3 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-2 bg-muted animate-pulse rounded-full"></div>
                </div>
                <div className="h-10 bg-muted animate-pulse rounded-md"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DashboardStatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ActivityFeedLoadingSkeleton() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 space-y-4 pb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-start space-x-4 py-4 ${
                i !== 4 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                    <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full"></div>
                    <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
