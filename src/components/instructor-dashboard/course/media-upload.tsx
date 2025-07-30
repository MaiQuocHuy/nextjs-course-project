'use client';

import type React from 'react';
import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  Play,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadedFile } from '@/types/learning';
import { imageFileSchema } from '@/lib/validations/course';

interface MediaUploadProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesChange?: (files: UploadedFile | null) => void;
  className?: string;
}

export function MediaUpload({
  accept = 'image/*,video/*',
  maxFiles = 1,
  maxSize = 100,
  onFilesChange,
  className,
}: MediaUploadProps) {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [globalError, setGlobalError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced validation function using Zod
  const validateFileWithZod = async (
    file: File
  ): Promise<{ isValid: boolean; error?: string; metadata?: any }> => {
    try {
      const isImage = file.type.startsWith('image/');
      // const isVideo = file.type.startsWith('video/');

      // if (isImage) {
      //   // Get image dimensions
      //   // const dimensions = await getImageDimensions(file);

      //   // const result = imageFileSchema.parse({
      //   //   file,
      //   //   // dimensions,
      //   // });

      //   imageFileSchema.parse({
      //     file,
      //     // dimensions,
      //   });

      //   return {
      //     isValid: true,
      //     metadata: {
      //       type: 'image',
      //       // dimensions,
      //       // aspectRatio: dimensions.width / dimensions.height,
      //     },
      //   };
      // }
      // else if (isVideo) {
      //   videoFileSchema.parse({
      //     file,
      //   });

      //   return {
      //     isValid: true,
      //     metadata: {
      //       type: 'video',
      //     },
      //   };
      // } else {
      //   return {
      //     isValid: false,
      //     error: 'Only image and video files are allowed',
      //   };
      // }
      if (isImage) {
        imageFileSchema.parse({
          file,
        });

        return {
          isValid: true,
          metadata: {
            type: 'image',
          },
        };
      } else {
        return {
          isValid: false,
          error: 'Only image file is allowed',
        };
      }
    } catch (error) {
      // console.log(error);

      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.issues[0]?.message || 'File validation failed',
        };
      }
      return { isValid: false, error: 'Unknown validation error' };
    }
  };

  // Helper function to get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });
  };

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        // For videos, create a thumbnail
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          resolve(canvas.toDataURL());
        };
        video.src = URL.createObjectURL(file);
      }
    });
  };

  // const processFiles = async (fileList: FileList) => {
  //   setGlobalError('');

  //   // if (files.length + fileList.length > maxFiles) {
  //   //   setGlobalError(`Maximum ${maxFiles} files allowed`);
  //   //   return;
  //   // }

  //   // Calculate total size including existing files
  //   // const existingSize = files.reduce(
  //   //   (total, file) => total + file.file.size,
  //   //   0
  //   // );
  //   // const newFilesSize = Array.from(fileList).reduce(
  //   //   (total, file) => total + file.size,
  //   //   0
  //   // );

  //   // try {
  //   //   // Validate total size with Zod
  //   //   mediaUploadSchema.parse({
  //   //     files: [...files, ...Array.from(fileList)].map((file) => ({ file })),
  //   //     totalSize: existingSize + newFilesSize,
  //   //   });
  //   // } catch (error) {
  //   //   if (error instanceof z.ZodError) {
  //   //     setGlobalError(error.issues[0]?.message || 'Upload validation failed');
  //   //     return;
  //   //   }
  //   // }

  //   const newFiles: UploadedFile[] = [];

  //   for (let i = 0; i < fileList.length; i++) {
  //     const file = fileList[i];

  //     // Use Zod validation
  //     const validation = await validateFileWithZod(file);

  //     if (!validation.isValid) {
  //       setGlobalError(validation.error || 'File validation failed');
  //       continue;
  //     }

  //     const preview = await createFilePreview(file);
  //     const uploadedFile: UploadedFile = {
  //       id: Math.random().toString(36).substr(2, 9),
  //       file,
  //       preview,
  //       type: file.type.startsWith('image/') ? 'image' : 'video',
  //       progress: 0,
  //       status: 'uploading',
  //       metadata: validation.metadata,
  //     };

  //     newFiles.push(uploadedFile);
  //   }

  //   if (newFiles.length > 0) {
  //     const updatedFiles = [...files, ...newFiles];
  //     setFiles(updatedFiles);
  //     console.log(updatedFiles);

  //     onFilesChange?.(updatedFiles);

  //     // Start uploads
  //     newFiles.forEach((file) => {
  //       simulateUpload(file.id).catch(() => {});
  //     });
  //   }
  // };

  const processFiles = async (file: File) => {
    setGlobalError('');

    // Use Zod validation
    const validation = await validateFileWithZod(file);

    if (!validation.isValid) {
      setGlobalError(validation.error || 'File validation failed');
    } else {
      const preview = await createFilePreview(file);
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        status: 'success',
      };

      setFile(uploadedFile);
      onFilesChange?.(uploadedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFilesChange?.(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {file === null ? (
        <>
          {/* Upload Area */}
          <div
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group',
              'hover:border-primary/50 hover:bg-accent/20',
              isDragOver
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border',
              file && 'border-primary/30 bg-gradient-card'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              // multiple
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              <div
                className={cn(
                  'mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300',
                  isDragOver && 'bg-primary/20 scale-110'
                )}
              >
                <Upload
                  className={cn(
                    'w-8 h-8 text-primary transition-all duration-300',
                    isDragOver && 'scale-110'
                  )}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isDragOver ? 'Drop files here' : 'Upload media files'}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop your images or videos, or{' '}
                  <span className="text-primary font-medium">browse files</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports images and videos up to {maxSize}MB each
                </p>
              </div>
            </div>

            {/* Animated overlay */}
            <div
              className={cn(
                'absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 transition-opacity duration-300',
                isDragOver && 'opacity-100'
              )}
            />
          </div>

          {/* Global Error */}
          {globalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <>
          {/* File List */}
          {file && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Uploaded Files (1/{maxFiles})
              </h4>

              <div className="grid gap-3">
                <div
                  key={file.id}
                  className={cn(
                    'relative group bg-card border rounded-lg p-4 transition-all duration-300',
                    'hover:shadow-card hover:border-primary/30',
                    file.status === 'success' &&
                      'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
                    file.status === 'error' &&
                      'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                  )}
                >
                  <div className="flex items-center space-x-4">
                    {/* Preview */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={file.preview || '/placeholder.svg'}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                      {file.type === 'video' && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {file.type === 'image' ? (
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Play className="w-4 h-4 text-purple-500" />
                        )}
                        <p className="font-medium truncate">{file.file.name}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.file.size)}</span>

                        {/* Image metadata */}
                        {/* {file.type === 'image' && file.metadata?.dimensions && (
                        <>
                          <span>•</span>
                          <span>
                            {file.metadata.dimensions.width} ×{' '}
                            {file.metadata.dimensions.height}
                          </span>
                          <span>•</span>
                          <span>
                            Ratio: {file.metadata.aspectRatio?.toFixed(2)}
                          </span>
                        </>
                      )} */}

                        {/* Video metadata */}
                        {/* {file.type === 'video' &&
                        file.metadata?.formattedDuration && (
                          <>
                            <span>•</span>
                            <span>{file.metadata.formattedDuration}</span>
                          </>
                        )} */}
                      </div>

                      {/* Error Message */}
                      {file.status === 'error' && file.error && (
                        <div className="mt-2 flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {file.error}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center space-x-2">
                      {file.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      )}

                      {file && file.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
