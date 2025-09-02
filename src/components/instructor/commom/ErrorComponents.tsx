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

export const DashboardError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Dashboard Data Error"
      message="We couldn't load your dashboard data. This could be due to a temporary issue with the server or your connection."
      onRetry={onRetry}
      className="max-w-lg w-full"
    />
  );
};

export const TableError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Couldn't Load Table Data"
      message="There was an error retrieving the table data. Please try refreshing."
      onRetry={onRetry}
    />
  );
};

export const ChartError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Chart Data Error"
      message="We couldn't load the chart data. Please try again."
      onRetry={onRetry}
      className="h-[200px] flex items-center justify-center"
    />
  );
};

export const StatsCardError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Stats Card Data Error"
      message="We couldn't load the statistics card data. Please try again."
      onRetry={onRetry}
      className="h-[200px] flex items-center justify-center"
    />
  );
};
