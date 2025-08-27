import { Loader2, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityFeedLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-5/6 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

//dashboardheader loading skeleton
export function DashboardHeaderLoadingSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}

// Stats loading skeleton
export function StatsLoadingSkeleton({ statsCount }: { statsCount?: number }) {
  return (
    <div
      className={`grid gap-3 grid-cols-1 sm:grid-cols-2 ${
        statsCount ? `lg:grid-cols-${statsCount}` : "lg:grid-cols-4"
      }`}
    >
      {Array.from({ length: statsCount || 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 md:h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Learning loading skeleton
export function LearningLoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Sidebar Skeleton - Hidden on mobile when loading */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-4 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Mobile Loading Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-32" />
        <div className="w-6" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-4 lg:p-6 space-y-4">
        <Skeleton className="h-6 lg:h-8 w-48 lg:w-64" />
        <Skeleton className="h-48 lg:h-96 w-full" />
        <Skeleton className="h-10 lg:h-12 w-full" />
      </div>
    </div>
  );
}

// Payments loading skeleton
export function PaymentTableLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Loading */}
        <div className="block md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Loading */}
        <div className="hidden md:block">
          <div className="rounded-md border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Skeleton className="h-4 w-16" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reviews loading skeletons
export function ReviewListLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Quiz Results loading skeleton
export function QuizResultsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Comments loading skeleton
export function CommentsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Replies loading skeleton
export function RepliesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardHeader className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
