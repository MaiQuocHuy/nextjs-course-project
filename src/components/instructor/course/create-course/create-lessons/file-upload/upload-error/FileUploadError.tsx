'use client';

import React from 'react';
import FileUploadErrorContainer from './FileUploadErrorContainer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FileUploadErrorProps {
  errors: string | string[];
  title?: string;
  maxDisplayErrors?: number;
  dialogTitle?: string;
}

/**
 * A component to display file upload errors
 * Can handle both single error messages and arrays of error messages
 */
const FileUploadError: React.FC<FileUploadErrorProps> = ({
  errors,
  title = 'Error:',
  maxDisplayErrors = 3,
  dialogTitle = 'Validation Errors',
}) => {
  // Convert single error to array for consistent handling
  const errorArray = typeof errors === 'string' ? [errors] : errors;

  if (errorArray.length === 0) return null;

  // If only one error, display it directly
  if (errorArray.length === 1) {
    return <FileUploadErrorContainer error={errorArray[0]} />;
  }  

  return (
    <FileUploadErrorContainer>
      <div className="flex flex-col gap-1 w-full">
        <span className="font-medium">{title}</span>
        {errorArray.slice(0, maxDisplayErrors).map((error, index) => (
          <span key={index} className="text-sm">
            • {error}
          </span>
        ))}
        {errorArray.length > maxDisplayErrors && (
          <div className="flex justify-center w-full mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  View all {errorArray.length} errors
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  <div className="text-sm space-y-1">
                    {errorArray.map((error, index) => (
                      <p key={index}>• {error}</p>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </FileUploadErrorContainer>
  );
};

export default FileUploadError;
