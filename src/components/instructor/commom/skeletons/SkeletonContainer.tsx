import React from 'react';
import { ErrorComponent } from '../ErrorComponent';

interface SkeletonContainerProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  loadingComponent: React.ReactNode;
  errorComponent: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function SkeletonContainer<T>({
  data,
  isLoading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  children,
}: SkeletonContainerProps<T>) {
  if (isLoading) {
    return loadingComponent;
  }

  if (error) {
    return errorComponent;
  }

  if (!data) {
    return (
      <ErrorComponent
        title="No Data Available"
        message="No data is currently available to display."
        onRetry={onRetry}
      />
    );
  }

  return <>{children(data)}</>;
}
