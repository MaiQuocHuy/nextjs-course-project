'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Play,
  FileText,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DocxViewer } from './DocxViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import type { DocumentType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import TxTViewer from './TxTViewer';
import { VideoViewer } from './VideoViewer';

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
  }, [videoFile, videoPreviewUrl]);

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
            setUploadError('Only PDF, DOCX, Excel, and TXT files are allowed');
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
      'text/plain': ['.txt'],
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
          setUploadError(
            'Only MP4, MPEG, QuickTime, AVI, WMV, WebM, and OGG video files are allowed'
          );
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
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (
      file.type.includes('spreadsheet') ||
      file.type.includes('excel')
    ) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    } else {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPreviewContent = (file: File) => {
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={URL.createObjectURL(file)}
          className="w-full h-full border rounded"
          title="PDF Preview"
        />
      );
    } else if (file.type === 'text/plain') {
      return <TxTViewer file={file} />;
    } else if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return <DocxViewer file={file} />;
    }
    return null;
  };

  const renderDocumentPreview = (file: File) => {
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
            {getPreviewContent(file)}
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
                        Supports PDF, DOCX, Excel, and TXT files. Maximum size:
                        10MB each
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
            <>
              <VideoViewer
                videoFile={videoFile}
                videoPreviewUrl={videoPreviewUrl}
                handleVideoRemove={handleVideoRemove}
                mode="edit"
              />
            </>
          )}
        </div>
      )}

      {/* Display uploaded video */}
      {videoFile && !onVideoSelect && !onVideoRemove && (
        <VideoViewer
          videoFile={videoFile}
          videoPreviewUrl={videoPreviewUrl}
          handleVideoRemove={handleVideoRemove}
        />
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
