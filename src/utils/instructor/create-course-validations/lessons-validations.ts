import { z } from 'zod';

export const documentSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        return allowedTypes.includes(file.type);
      },
      { message: 'Only PDF, DOCX, and Excel files are allowed' }
    )
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size must not exceed 10MB',
    }),
});

export const videoSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedTypes = [
          'video/mp4',
          'video/mpeg',
          'video/quicktime',
          'video/x-msvideo', // AVI
          'video/x-ms-wmv', // WMV
          'video/webm',
          'video/ogg',
        ];
        // Get the base MIME type without parameters
        const baseType = file.type.split(';')[0].trim();
        return allowedTypes.includes(baseType);
      },
      {
        message:
          'Only MP4, MPEG, QuickTime, AVI, WMV, WebM, and OGG video files are allowed',
      }
    )
    .refine((file) => file.size <= 100 * 1024 * 1024, {
      message: 'Video size must not exceed 100MB',
    })
    .nullish(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  questionText: z.string().min(1, 'Question cannot be empty'),
  options: z.object({
    A: z.string().min(1, 'Option A cannot be empty'),
    B: z.string().min(1, 'Option B cannot be empty'),
    C: z.string().min(1, 'Option C cannot be empty'),
    D: z.string().min(1, 'Option D cannot be empty'),
  }),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional(),
  orderIndex: z.number().min(0),
});

export const quizSchema = z.object({
  questions: z.array(quizQuestionSchema),
  documents: z.array(documentSchema).optional(),
});

export const lessonSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, 'Lesson title cannot be empty'),
    orderIndex: z.number().min(0),
    type: z.enum(['VIDEO', 'QUIZ']).default('VIDEO'),
    video: videoSchema.nullish(),
    quiz: quizSchema.nullish(),
    quizType: z.enum(['ai', 'upload']).optional(),
    quizFile: z.instanceof(File).optional(),
    isCollapsed: z.boolean().default(false).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'VIDEO') {
        return data.video && data.video.file;
      }
      if (data.type === 'QUIZ') {
        return data.quiz && data.quiz.questions.length > 0;
      }
    },
    {
      message:
        'Video lessons must have a video file, and quiz lessons must have at least one question',
    }
  );

export const sectionSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, 'Course title is required')
    .min(3, 'Course title must be at least 3 characters')
    .max(255, 'Course title must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Course title is required')
    .min(5, 'Course title must be at least 5 characters')
    .max(255, 'Description must be less than 255 characters'),
  orderIndex: z.number().min(0),
  lessons: z
    .array(lessonSchema)
    .min(1, 'Each section must have at least one lesson'),
  isCollapsed: z.boolean().default(false).optional(),
});

export const courseCreationSchema = z.object({
  sections: z
    .array(sectionSchema)
    .min(1, 'Course must have at least one section'),
});

// Export the inferred types
export type DocumentType = z.infer<typeof documentSchema>;
export type VideoType = z.infer<typeof videoSchema>;
export type QuizQuestionType = z.infer<typeof quizQuestionSchema>;
export type LessonType = z.infer<typeof lessonSchema>;
export type SectionType = z.infer<typeof sectionSchema>;
export type CourseCreationType = z.infer<typeof courseCreationSchema>;
