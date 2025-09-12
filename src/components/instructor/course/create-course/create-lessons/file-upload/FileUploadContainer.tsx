'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import FileUploadError from './upload-error/FileUploadError';

export interface FileUploadContainerProps {
  onFilesAccepted: (files: File[]) => void;
  allowedFileTypes: string[];
  allowMultiple?: boolean;
  maxFileSize?: number;
  instructionText?: string;
  supportText?: string;
  dragActiveText?: string;
  icon?: React.ReactNode;
  errorTitle?: string;
}

const FileUploadContainer = ({
  onFilesAccepted,
  allowedFileTypes,
  allowMultiple = false,
  maxFileSize = 10 * 1024 * 1024, // Default 10MB
  instructionText = 'Drag & drop files or click to select',
  supportText = 'Maximum size: 10MB each',
  dragActiveText = 'Drop the files here...',
  icon = <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />,
  errorTitle = 'Upload Error:',
}: FileUploadContainerProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const validateFiles = (
    files: File[]
  ): { accepted: File[]; rejected: File[]; errors: string[] } => {
    const accepted: File[] = [];
    const rejected: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      let isValid = true;
      let errorMessage = '';

      // Check file type
      const isValidType = allowedFileTypes.some(
        (type) =>
          file.type === type ||
          (type.startsWith('.') &&
            file.name.toLowerCase().endsWith(type.toLowerCase()))
      );

      if (!isValidType) {
        isValid = false;
        errorMessage = `File type not supported: ${file.type}`;
        if (!errors.includes(errorMessage)) errors.push(errorMessage);
      }

      // Check file size
      if (file.size > maxFileSize) {
        isValid = false;
        errorMessage = `File too large. Maximum size: ${(
          maxFileSize /
          (1024 * 1024)
        ).toFixed(2)}MB`;
        if (!errors.includes(errorMessage)) errors.push(errorMessage);
      }

      if (isValid) {
        accepted.push(file);
      } else {
        rejected.push(file);
      }
    });

    return { accepted, rejected, errors };
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setErrors([]); // Clear previous errors

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        const {
          accepted,
          rejected,
          errors: validationErrors,
        } = validateFiles(droppedFiles);

        if (accepted.length > 0) {
          // If multiple files aren't allowed, just take the first one
          if (!allowMultiple) {
            onFilesAccepted([accepted[0]]);
          } else {
            onFilesAccepted(accepted);
          }
        }

        if (rejected.length > 0) {
          setErrors(validationErrors);
        }
      }
    },
    [allowMultiple, maxFileSize, onFilesAccepted, allowedFileTypes]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      setErrors([]); // Clear previous errors
      const selectedFiles = Array.from(e.target.files);
      const {
        accepted,
        rejected,
        errors: validationErrors,
      } = validateFiles(selectedFiles);

      if (accepted.length > 0) {
        // If multiple files aren't allowed, just take the first one
        if (!allowMultiple) {
          onFilesAccepted([accepted[0]]);
        } else {
          onFilesAccepted(accepted);
        }
      }

      if (rejected.length > 0) {
        setErrors(validationErrors);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [allowMultiple, maxFileSize, onFilesAccepted, allowedFileTypes]
  );

  return (
    <div className="space-y-2">
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-6">
          <div className="cursor-pointer text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              className="hidden"
              accept={allowedFileTypes
                .filter((type) => type.startsWith('.')) // Only use extension formats for the accept attribute
                .join(',')}
              onChange={handleFileInputChange}
            />
            <div
              className={`transition-transform duration-200 ${
                isDragActive ? 'scale-110' : ''
              }`}
            >
              {icon}
              <p className="text-sm text-muted-foreground">
                {isDragActive ? dragActiveText : instructionText}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {supportText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display validation errors */}
      {errors.length > 0 && (
        <FileUploadError
          errors={errors}
          title={errorTitle}
          maxDisplayErrors={3}
          dialogTitle="File Upload Errors"
        />
      )}
    </div>
  );
};

export default FileUploadContainer;
