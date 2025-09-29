'use client';

import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { Label } from '@/components/ui/label';
import FileUploadContainer from './FileUploadContainer';
import { VideoViewer } from '../preview/VideoViewer';

const acceptedVideoTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
];

const acceptedVideoExtensions = [
  '.mp4',
  '.webm',
  '.ogg',
  '.mpeg',
  '.mov',
  '.avi',
  '.wmv',
];

interface VideoUploadProps {
  videoFile?: File | null;
  onVideoChange?: (file: File | undefined) => void;
  maxSize?: number; // in bytes
  required?: boolean;
  label?: string;
  mode?: 'view' | 'edit';
}

const VideoUpload = ({
  videoFile,
  onVideoChange,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  required = false,
  label = 'Upload Lesson Video',
  mode = 'edit',
}: VideoUploadProps) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const handleFilesAccepted = (files: File[]) => {
    if (!onVideoChange) return;
    if (files.length > 0) {
      onVideoChange(files[0]);
    }
  };

  const handleVideoRemove = () => {
    if (!onVideoChange) return;
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    onVideoChange(undefined);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <strong className="text-red-500">*</strong>}
      </Label>

      {!videoFile ? (
        <FileUploadContainer
          onFilesAccepted={handleFilesAccepted}
          allowedFileTypes={[...acceptedVideoTypes, ...acceptedVideoExtensions]}
          allowMultiple={false}
          maxFileSize={maxSize}
          instructionText="Drag & drop video or click to select"
          supportText={`Supports MP4, WEBM, OGG, etc. Maximum size: ${(
            maxSize /
            (1024 * 1024)
          ).toFixed(2)}MB`}
          dragActiveText="Drop the video here..."
          icon={
            <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          }
        />
      ) : (
        <VideoViewer
          videoFile={videoFile}
          videoPreviewUrl={videoPreviewUrl}
          onVideoRemove={handleVideoRemove}
          mode={mode}
        />
      )}
    </div>
  );
};

export default VideoUpload;
