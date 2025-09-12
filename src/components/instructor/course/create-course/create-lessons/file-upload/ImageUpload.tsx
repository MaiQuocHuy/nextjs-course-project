'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FileUploadContainer from './FileUploadContainer';
import { cn } from '@/lib/utils';

const acceptedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

const acceptedImageExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.webp',
];

interface ImageUploadProps {
  imageFile?: File;
  onImageChange: (file: File | undefined) => void;
  maxSize?: number; // in bytes
  required?: boolean;
  imageFileName?: string;
  label?: string;
}

const ImageUpload = ({
  imageFile,
  onImageChange,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  required = false,
  imageFileName = 'Upload image',
  label = 'Upload Image',
}: ImageUploadProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleFilesAccepted = (files: File[]) => {
    if (files.length > 0) {
      onImageChange(files[0]);
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
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <strong className="text-red-500">*</strong>}
      </Label>

      {!imageFile ? (
        <FileUploadContainer
          onFilesAccepted={handleFilesAccepted}
          allowedFileTypes={[...acceptedImageTypes, ...acceptedImageExtensions]}
          allowMultiple={false}
          maxFileSize={maxSize}
          instructionText="Drag & drop image or click to select"
          supportText={`Supports JPG, PNG, GIF, WEBP. Maximum size: ${(
            maxSize /
            (1024 * 1024)
          ).toFixed(2)}MB`}
          dragActiveText="Drop the image here..."
          icon={
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          }
        />
      ) : (
        <>
          {imagePreviewUrl && (
              <div className="grid gap-3">
                <div
                  className={cn(
                    'relative group bg-card border rounded-lg p-4 transition-all duration-300',
                    'hover:shadow-card hover:border-primary/30',
                    'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                  )}
                >
                  <div className="space-y-4 px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        <p className="font-medium truncate text-sm">
                          {imageFileName}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(imageFile.size)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (imagePreviewUrl)
                              URL.revokeObjectURL(imagePreviewUrl);
                            onImageChange(undefined);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative w-full rounded-md overflow-hidden">
                      <img
                        src={imagePreviewUrl}
                        alt="Uploaded image"
                        className="w-full h-auto max-h-90"
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUpload;
