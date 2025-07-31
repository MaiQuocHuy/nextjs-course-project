'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  accept: Record<string, string[]>;
  maxSize: number;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  error?: string;
  label: string;
}

export function FileUpload({
  accept,
  maxSize,
  onFileSelect,
  onFileRemove,
  selectedFile,
  error,
  label,
}: FileUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setUploadError(
            `File quá lớn. Kích thước tối đa: ${maxSize / (1024 * 1024)}MB`
          );
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setUploadError('Định dạng file không được hỗ trợ');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25'
          }`}
        >
          <CardContent className="p-6">
            <div {...getRootProps()} className="cursor-pointer text-center">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? 'Thả file vào đây...'
                  : 'Kéo thả file hoặc click để chọn'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Kích thước tối đa: {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(error || uploadError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
