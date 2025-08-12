import { AlertCircle, RefreshCw, Wifi, WifiOff, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  variant = "default",
  showRetry = true,
  onRetry,
  retryText = "Try Again"
}: LoadingErrorProps) {
  
  // Determine error type and message
  const getErrorInfo = () => {
    if (message) {
      return { 
        title: "Error",
        description: message,
        icon: AlertCircle
      };
    }

    if (error) {
      // Network errors
      if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
        return {
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          icon: WifiOff
        };
      }

      // API errors
      if (error.status) {
        switch (error.status) {
          case 401:
            return {
              title: "Authentication Error",
              description: "Your session has expired. Please log in again.",
              icon: AlertCircle
            };
          case 403:
            return {
              title: "Access Denied",
              description: "You don't have permission to access this resource.",
              icon: AlertCircle
            };
          case 404:
            return {
              title: "Not Found",
              description: "The requested resource could not be found.",
              icon: Info
            };
          case 500:
            return {
              title: "Server Error",
              description: "Something went wrong on our end. Please try again later.",
              icon: AlertCircle
            };
          default:
            return {
              title: "Request Failed",
              description: error.data?.message || "An unexpected error occurred.",
              icon: AlertCircle
            };
        }
      }

      // Generic error with message
      if (error.message) {
        return {
          title: "Error",
          description: error.message,
          icon: AlertCircle
        };
      }
    }

    // Default error
    return {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      icon: AlertCircle
    };
  };

  const { title, description, icon: Icon } = getErrorInfo();

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-destructive">
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

  if (variant === "card") {
    return (
      <Card className="w-full border-destructive/50">
        <CardContent className="py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10">
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
            </div>
            <div className="text-center space-y-2 sm:space-y-3 max-w-md">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                {description}
              </p>
            </div>
            {showRetry && onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] w-full p-4 sm:p-6">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 max-w-md">
        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
        </div>
        <div className="text-center space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            {description}
          </p>
        </div>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
}

// Specialized error components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <LoadingError
      variant="card"
      message="Unable to connect to the server. Please check your internet connection."
      onRetry={onRetry}
      retryText="Retry Connection"
    />
  );
}

export function CourseLoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <LoadingError
      variant="card"
      message="Failed to load courses. Please try again."
      onRetry={onRetry}
      retryText="Reload Courses"
    />
  );
}
