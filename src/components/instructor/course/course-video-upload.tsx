'use client';

import { z } from 'zod';
import { Info } from 'lucide-react';
import { MediaUpload } from './media-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadedFile } from '@/types/learning';

// Course video validation schema
const courseVideoSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('video/'), 'Must be a video file')
    .refine(
      (file) => file.size <= 200 * 1024 * 1024,
      'Video must be less than 200MB'
    )
    .refine(
      (file) => ['video/mp4', 'video/webm'].includes(file.type),
      'Only MP4 and WebM formats are supported'
    ),
  duration: z
    .number()
    .min(30, 'Video must be at least 30 seconds long')
    .max(1800, 'Video must be less than 30 minutes long'),
});

interface CourseVideoUploadProps {
  onVideoChange?: (files: UploadedFile | null) => void;
  className?: string;
  type?: 'intro' | 'lesson';
}

export function CourseVideoUpload({
  onVideoChange,
  className,
  type = 'lesson',
}: CourseVideoUploadProps) {
  const maxDuration = type === 'intro' ? 300 : 1800; // 5 min for intro, 30 min for lessons
  const maxSize = type === 'intro' ? 50 : 200; // 50MB for intro, 200MB for lessons

  return (
    <div className={className}>
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>
            {type === 'intro' ? 'Introduction' : 'Lesson'} Video Guidelines:
          </strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              • Duration: 30 seconds -{' '}
              {type === 'intro' ? '5 minutes' : '30 minutes'}
            </li>
            <li>• Maximum file size: {maxSize}MB</li>
            <li>• Supported formats: MP4, WebM</li>
            <li>• Recommended resolution: 1920×1080 (1080p)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <MediaUpload
        accept="video/mp4,video/webm"
        maxFiles={type === 'intro' ? 1 : 10}
        maxSize={maxSize}
        onFilesChange={onVideoChange}
      />
    </div>
  );
}
