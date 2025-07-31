import { z } from 'zod';

// Course form validation schema
const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Course title is required')
    .min(5, 'Course title must be at least 5 characters')
    .max(100, 'Course title must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-_:()&.,!?]+$/,
      'Course title contains invalid characters'
    ),

  description: z
    .string()
    .min(1, 'Course description is required')
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .refine(
      (desc) => desc.trim().split(/\s+/).length >= 10,
      'Description must contain at least 10 words'
    ),

  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(999.99, 'Price cannot exceed $999.99')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),

  category: z
    .string()
    .min(1, 'Category is required')
    .refine(
      (cat) =>
        [
          'programming',
          'design',
          'data-science',
          'business',
          'marketing',
          'photography',
          'music',
          'language',
          'health',
          'lifestyle',
        ].includes(cat),
      'Please select a valid category'
    ),

  level: z
    .string()
    .min(1, 'Select level is required')
    .refine(
      (level) => ['beginner', 'intermediate', 'advanced'].includes(level),
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
          ),
  // .refine(
  //   (file) =>
  //     [
  //       'image/jpeg',
  //       'image/jpg',
  //       'image/png',
  //       'image/webp',
  //       'image/gif',
  //     ].includes(file.type),
  //   'Only JPEG, PNG, WebP, and GIF images are supported'
  // ),
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

// const mediaUploadSchema = z.object({
//   files: z
//     .array(z.union([imageFileSchema, videoFileSchema]))
//     .max(5, 'Maximum 5 files allowed'),
//   totalSize: z
//     .number()
//     .max(1000 * 1024 * 1024, 'Total upload size must be less than 1GB'),
// });

export const fullCourseFormSchema = z.object({
  ...courseFormSchema.shape,
  ...imageFileSchema.shape,
});

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
