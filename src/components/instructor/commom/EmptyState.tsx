import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileQuestion, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  illustration?: string;
  showRetry?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export const EmptyState = ({
  title = 'No data available',
  message,
  icon,
  illustration,
  showRetry = true,
  retryLabel = 'Refresh Data',
  onRetry,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className
      )}
    >
      {illustration && (
        <div className="mb-4 relative h-40 w-40">
          <Image
            src={illustration || '/images/empty_data.png'}
            alt="No data illustration"
            fill
            className="object-contain"
          />
        </div>
      )}

      {!illustration && icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          {icon || <FileQuestion className="h-8 w-8 text-muted-foreground" />}
        </div>
      )}

      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}

      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
        {message}
      </p>

      {showRetry && onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
