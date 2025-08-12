'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  type File,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Play,
  FileText,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EnhancedFileUploadProps {
  accept: Record<string, string[]>;
  maxSize: number;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  error?: string;
  label: string;
  type: 'document' | 'video';
}

export function EnhancedFileUpload({
  accept,
  maxSize,
  onFileSelect,
  onFileRemove,
  selectedFile,
  error,
  label,
  type,
}: EnhancedFileUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setUploadError(
            `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
          );
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setUploadError('File type not supported');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);

        // Create preview URL for videos
        if (type === 'video') {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }
      }
    },
    [maxSize, onFileSelect, type]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    onFileRemove();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const getFileIcon = () => {
    if (type === 'video') return <Play className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const renderPreview = () => {
    if (!selectedFile) return null;

    if (type === 'video' && previewUrl) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Video Preview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <video
                src={previewUrl}
                controls
                className="w-full h-full rounded-lg"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    if (type === 'document') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Document Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {selectedFile.type === 'application/pdf' ? (
                <iframe
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-96 border rounded"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Preview not available for DOCX files. File:{' '}
                    {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <CardContent className="p-6">
            <div {...getRootProps()} className="cursor-pointer text-center">
              <input {...getInputProps()} />
              <div
                className={`transition-transform duration-200 ${
                  isDragActive ? 'scale-110' : ''
                }`}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop file or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum size: {maxSize / (1024 * 1024)}MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon()}
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center gap-2">
                {renderPreview()}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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
