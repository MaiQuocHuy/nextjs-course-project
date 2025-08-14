'use client';

import { useState, useCallback, useEffect } from 'react';
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
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Play,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { DocumentType } from '@/utils/instructor/create-course-validations/lessons-validations';
import { vi } from 'zod/v4/locales';

interface CombinedFileUploadProps {
  documents?: DocumentType[];
  onDocumentsChange?: (documents: DocumentType[]) => void;
  // Video props are optional
  videoFile?: File;
  onVideoSelect?: (file: File) => void;
  onVideoRemove?: () => void;
}

export function CombinedFileUpload({
  documents,
  onDocumentsChange,
  videoFile,
  onVideoSelect,
  onVideoRemove,
}: CombinedFileUploadProps) {
  const [uploadError, setUploadError] = useState<string>('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (videoFile && !videoPreviewUrl) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
    }
  }, [videoFile]);

  // Document Dropzone
  const onDocumentDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (onDocumentsChange && documents !== undefined) {
        setUploadError('');

        if (rejectedFiles.length > 0) {
          const rejection = rejectedFiles[0];
          if (rejection.errors[0]?.code === 'file-too-large') {
            setUploadError(`File too large. Maximum size: 10MB`);
          } else if (rejection.errors[0]?.code === 'file-invalid-type') {
            setUploadError('File type not supported');
          }
          return;
        }

        if (acceptedFiles.length > 0) {
          const newDocuments = acceptedFiles.map((file) => ({
            file,
          }));
          onDocumentsChange([...documents, ...newDocuments]);
        }
      }
    },
    [documents, onDocumentsChange]
  );

  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    isDragActive: isDocDragActive,
  } = useDropzone({
    onDrop: onDocumentDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  // Video Dropzone
  const onVideoDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (onVideoSelect === undefined) return;

      setUploadError('');

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setUploadError(`Video too large. Maximum size: 100MB`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setUploadError('Video type not supported');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onVideoSelect(file);

        // Create preview URL for videos
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
      }
    },
    [onVideoSelect]
  );

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogg'],
    },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  const removeDocument = (index: number) => {
    if (!onDocumentsChange || !documents) return;
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);
  };

  const handleVideoRemove = () => {
    if (onVideoRemove) {
      onVideoRemove();
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl('');
      }
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf')
      return <FileText className="h-4 w-4 text-red-500" />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel'))
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const canPreviewDocument = (file: File) => {
    return file.type === 'application/pdf';
  };

  const renderDocumentPreview = (file: File) => {
    if (!canPreviewDocument(file)) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent
          style={{
            width: '90vw',
            maxWidth: '90vw',
            maxHeight: '95vh',
            padding: '15px',
          }}
        >
          <DialogHeader>
            <DialogTitle>Document Preview - {file.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto" style={{ height: '85vh' }}>
            <iframe
              src={URL.createObjectURL(file)}
              className="w-full h-full border rounded"
              title="PDF Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderVideoPreview = () => {
    if (!videoFile || !videoPreviewUrl) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent
          style={{
            width: '90vw',
            maxWidth: '900px',
            maxHeight: '95vh',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          <div
            style={{
              width: '100%',
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <video
              src={videoPreviewUrl}
              controls
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: '#000',
                borderRadius: '12px',
              }}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-3">
      {/* Multi Document Upload */}
      <div className="space-y-2">
        {documents && onDocumentsChange && (
          <>
            {/* Upload area */}
            <div>
              <Label className="text-sm font-medium">
                Related Documents <strong className="text-red-500">*</strong>
              </Label>
              <Card
                className={`border-2 border-dashed transition-all duration-200 ${
                  isDocDragActive
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <CardContent className="p-6">
                  <div
                    {...getDocRootProps()}
                    className="cursor-pointer text-center"
                  >
                    <input {...getDocInputProps()} />
                    <div
                      className={`transition-transform duration-200 ${
                        isDocDragActive ? 'scale-110' : ''
                      }`}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {isDocDragActive
                          ? 'Drop the files here...'
                          : 'Drag & drop files or click to select'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, Excel files. Maximum size: 10MB each
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Uploaded Documents ({documents.length})
                </Label>
                {documents.map((document, index) => (
                  <Card
                    key={index}
                    className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  >
                    <CardContent className="px-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getFileIcon(document.file)}
                            <span className="text-sm font-medium">
                              {document.file.name}
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Size:{' '}
                            {(document.file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderDocumentPreview(document.file)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Upload */}
      {onVideoSelect && onVideoRemove && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Upload Lesson Video <strong className="text-red-500">*</strong>
          </Label>
          {!videoFile ? (
            <Card
              className={`border-2 border-dashed transition-all duration-200 ${
                isVideoDragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
            >
              <CardContent className="p-6">
                <div
                  {...getVideoRootProps()}
                  className="cursor-pointer text-center"
                >
                  <input {...getVideoInputProps()} />
                  <div
                    className={`transition-transform duration-200 ${
                      isVideoDragActive ? 'scale-110' : ''
                    }`}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {isVideoDragActive
                        ? 'Drop the video here...'
                        : 'Drag & drop video or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports MP4, WEBM, OGG. Maximum size: 100MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {videoFile.name}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    {renderVideoPreview()}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleVideoRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Display uploaded video */}
      {videoFile && !onVideoSelect && !onVideoRemove && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Video</Label>

          <Card>
            <CardContent className="px-3">
              <div className="space-y-3">
                {/* Video Information */}
                <div className="space-x-2">
                  <span className="text-sm font-medium">{videoFile.name}</span>
                  <span className="mt-2 text-xs text-muted-foreground">
                    Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                {/* Video */}
                {videoPreviewUrl && (
                  <div
                    style={{
                      width: '100%',
                      height: '60vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <video
                      src={videoPreviewUrl}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        background: '#000',
                        borderRadius: '12px',
                      }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
