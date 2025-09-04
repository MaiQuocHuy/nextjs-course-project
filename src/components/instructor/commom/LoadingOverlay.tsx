import React from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function LoadingOverlay({}: {}) {
  const { content } = useSelector(
    (state: RootState) => state.loadingAnima
  );

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary" />
        <span className="text-white">{content}</span>
      </div>
    </div>
  );
}
