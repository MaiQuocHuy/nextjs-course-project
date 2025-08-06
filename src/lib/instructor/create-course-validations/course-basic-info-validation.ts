import { z } from 'zod';

// Course form validation schema
const courseFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Course title must be at least 5 characters')
    .max(100, 'Course title must be less than 100 characters'),

  description: z
    .string()
    .min(20, 'Course description must be at least 20 characters')
    .max(1000, 'Course description must be less than 1000 characters'),

  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(9999.99, 'Price cannot exceed $9999.99')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),

  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),

  level: z
    .string()
    .refine(
      (level) => ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(level),
      'Please select a valid Level'
    ),
});

export const imageFileSchema = z.object({
  file:
    // .instanceof(FileList).transform(list => list[0])
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(File, {
            message: 'Thmbnail is required',
          })
          .refine(
            (file) => file.type.startsWith('image/'),
            'File must be an image'
          )
          .refine(
            (file) => file.size <= 10 * 1024 * 1024, // 10MB
            'Image size must be less than 10MB'
          )
          .refine(
            (file) =>
              [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/bmp',
                'image/webp',
              ].includes(file.type),
            'Only JPEG, JPG, PNG, GIF, BMP and WebP images are supported'
          ),
});

export const videoFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('video/'), 'File must be a video')
    .refine(
      (file) => file.size <= 500 * 1024 * 1024, // 500MB
      'Video size must be less than 500MB'
    )
    .refine(
      (file) =>
        ['video/mp4', 'video/webm', 'video/mov', 'video/avi'].includes(
          file.type
        ),
      'Only MP4, WebM, MOV, and AVI videos are supported'
    ),
  duration: z
    .number()
    .max(3600, 'Video duration must be less than 1 hour')
    .optional(),
});

export const fullCourseFormSchema = z.object({
  ...courseFormSchema.shape,
  ...imageFileSchema.shape,
});

export type courseBasicInfoType = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryIds: string[];
  level: string;
  thumbnail: string;
}

export type CourseFormData = z.infer<typeof fullCourseFormSchema>;

// Helper function to get word count
export const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

// Helper function to get character count
export const getCharacterCount = (text: string): number => {
  return text.length;
};
