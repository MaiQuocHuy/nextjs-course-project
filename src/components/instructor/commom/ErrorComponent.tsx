import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorComponent = ({
  title = 'Error Loading Data',
  message = 'There was an error loading the data. Please try again later.',
  onRetry,
  className,
}: ErrorComponentProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Alert
        variant="destructive"
        className={cn('flex flex-col items-start w-fit', className)}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">{title}</AlertTitle>
        </div>
        <AlertDescription className="mt-2">{message}</AlertDescription>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 flex items-center gap-2"
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  );
};
