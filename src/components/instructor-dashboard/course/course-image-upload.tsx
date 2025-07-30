'use client';

import { z } from 'zod';
import { MediaUpload2 } from './media-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Course-specific image validation schema
// const courseImageSchema = z.object({
//   file: z
//     .instanceof(File)
//     .refine((file) => file.type.startsWith('image/'), 'Must be an image file')
//     .refine(
//       (file) => file.size <= 5 * 1024 * 1024,
//       'Image must be less than 5MB'
//     )
//     .refine(
//       (file) =>
//         ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
//           file.type
//         ),
//       'Only JPEG, PNG, and WebP formats are supported'
//     ),
//   dimensions: z
//     .object({
//       width: z
//         .number()
//         .min(800, 'Image width must be at least 800px for course thumbnails'),
//       height: z
//         .number()
//         .min(450, 'Image height must be at least 450px for course thumbnails'),
//     })
//     .refine((dims) => {
//       const aspectRatio = dims.width / dims.height;
//       return aspectRatio >= 1.6 && aspectRatio <= 1.9; // 16:9 to 16:10 aspect ratio
//     }, 'Image should have a 16:9 aspect ratio (recommended: 1920×1080)'),
// });

interface CourseImageUploadProps {
  onImageChange?: (files: any) => void;
  className?: string;
}

export function CourseImageUpload({
  onImageChange,
  className,
}: CourseImageUploadProps) {
  return (
    <div className={className}>
      {/* <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Course Thumbnail Guidelines:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Minimum size: 800×450 pixels</li>
            <li>• Recommended: 1920×1080 pixels (16:9 aspect ratio)</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Supported formats: JPEG, PNG, WebP</li>
          </ul>
        </AlertDescription>
      </Alert> */}

      <MediaUpload2
        accept="image/jpeg,image/jpg,image/png,image/webp"
        maxFiles={1}
        maxSize={5}
        onFilesChange={onImageChange}
      />
    </div>
  );
}
