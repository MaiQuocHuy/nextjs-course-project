import {
  AlertCircle,
  RefreshCw,
  WifiOff,
  MessageSquare,
  BarChart3,
  BookOpen,
  CreditCard,
  Receipt,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoadingErrorProps {
  error?: any;
  message?: string;
  variant?: "default" | "card" | "alert" | "inline";
  showRetry?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

export function LoadingError({
  error,
  message,
  variant = "card",
  showRetry = true,
  onRetry,
  retryText = "Try Again",
}: LoadingErrorProps) {
  // Determine error type and message
  const getErrorInfo = () => {
    if (message) {
      return {
        title: "Error",
        description: message,
        icon: AlertCircle,
      };
    }

    if (error) {
      // Network errors
      if (error.name === "NetworkError" || error.code === "NETWORK_ERROR") {
        return {
          title: "Connection Error",
          description:
            "Unable to connect to the server. Please check your internet connection.",
          icon: WifiOff,
        };
      }

      // API errors
      if (error.status) {
        switch (error.status) {
          case 401:
            return {
              title: "Session Expired",
              description: "Please log in again to continue.",
              icon: AlertCircle,
            };
          case 403:
            return {
              title: "Access Denied",
              description: "You don't have permission to access this resource.",
              icon: AlertCircle,
            };
          case 404:
            return {
              title: "Not Found",
              description: "The requested resource could not be found.",
              icon: AlertCircle,
            };
          case 500:
            return {
              title: "Server Error",
              description:
                "Something went wrong on our end. Please try again later.",
              icon: AlertCircle,
            };
          default:
            return {
              title: "Request Failed",
              description:
                error.data?.message || "An unexpected error occurred.",
              icon: AlertCircle,
            };
        }
      }

      // Generic error with message
      if (error.message) {
        return {
          title: "Error",
          description: error.message,
          icon: AlertCircle,
        };
      }
    }

    // Default error
    return {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      icon: AlertCircle,
    };
  };

  const { title, description, icon: Icon } = getErrorInfo();

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className="w-full">
        <Icon className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <div className="space-y-3">
            <p>{description}</p>
            {showRetry && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-8"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                {retryText}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-destructive">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{description}</span>
        {showRetry && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Default and card variant
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <Icon className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {showRetry && onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard Student Specialized Error Components

// Header Error Component
export function DashboardHeaderError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full py-3 border-none rounded-none">
      <CardContent className="py-0">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Failed to Load Data
            </span>
          </div>

          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-3 w-3 mr-2" />
              Reload Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Stats Error Component
export function StatsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full py-3">
      <CardContent className="py-0">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <BarChart3 className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Stats
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load your dashboard statistics. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Stats
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Enrolled Courses Error Component
export function EnrolledCoursesError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <BookOpen className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Courses
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load your enrolled courses. Please check your connection
              and try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Courses
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Activity Feed Error Component
export function ActivityFeedError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-0">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
            <BarChart3 className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="font-medium text-foreground">
              Activity Feed Unavailable
            </h4>
            <p className="text-xs text-muted-foreground">
              Unable to load recent activities.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Reviews Error Component
export function ReviewsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <MessageSquare className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Reviews
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load your course reviews. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Reviews
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="w-full">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                <CreditCard className="h-6 w-6 text-destructive" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-lg font-semibold text-foreground">
                  Payment History Unavailable
                </h3>
                <p className="text-sm text-muted-foreground">
                  Unable to load your payment history. Please try again.
                </p>
              </div>
              {onRetry && (
                <Button variant="outline" onClick={onRetry} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Payments
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// Learning Page Error Component
export function LearningPageError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 border-none">
      <Card className="w-full border-none shadow-none">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
              <BookOpen className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center space-y-4 max-w-lg">
              <h3 className="text-2xl font-semibold text-foreground">
                Unable to Load Course Content
              </h3>
              <p className="text-lg text-muted-foreground">
                We're having trouble loading your course content. This could be
                due to a network issue or the content may be temporarily
                unavailable.
              </p>
              <p className="text-base text-muted-foreground">
                Please check your internet connection and try again.
              </p>
            </div>
            {onRetry && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={onRetry} size="lg">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reload Course
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  size="lg"
                >
                  Refresh Page
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quiz Result Error Component
export function QuizResultError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <BookOpen className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Quiz Results
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load your quiz results. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Quiz Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Comments error loading
export function CommentsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <MessageCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Comments
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load comments for this lesson. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Comments
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Replies error loading
export function RepliesError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full">
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <MessageCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              Failed to Load Replies
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to load replies for this comment. Please try again.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Replies
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
