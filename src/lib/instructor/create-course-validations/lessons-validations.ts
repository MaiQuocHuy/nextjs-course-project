// import { z } from "zod"

// export const documentSchema = z.object({
//   file: z
//     .instanceof(File)
//     .refine(
//       (file) => {
//         const allowedTypes = [
//           "application/pdf",
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ]
//         return allowedTypes.includes(file.type)
//       },
//       { message: "Only PDF and DOCX files are allowed" },
//     )
//     .refine((file) => file.size <= 10 * 1024 * 1024, { message: "File size must not exceed 10MB" }),
//   status: z.enum(["publish", "unpublish"]).default("publish"),
// })

// export const videoSchema = z.object({
//   file: z
//     .instanceof(File)
//     .refine(
//       (file) => {
//         const allowedTypes = ["video/mp4", "video/webm", "video/ogg"]
//         return allowedTypes.includes(file.type)
//       },
//       { message: "Only MP4, WebM, and OGG video files are allowed" },
//     )
//     .refine((file) => file.size <= 500 * 1024 * 1024, { message: "Video size must not exceed 500MB" }),
// })

// export const quizQuestionSchema = z.object({
//   id: z.string(),
//   question: z.string().min(1, "Question cannot be empty"),
//   options: z.array(z.string()).min(2, "Must have at least 2 options"),
//   correctAnswer: z.number().min(0, "Must select correct answer"),
//   explanation: z.string().optional(),
// })

// export const lessonSchema = z.object({
//   title: z.string().min(1, "Lesson title cannot be empty"),
//   order: z.number().min(1),
//   documents: z.array(documentSchema).default([]),
//   type: z.enum(["video", "quiz"]),
//   video: videoSchema.optional(),
//   quizType: z.enum(["ai", "upload", "template"]).optional(),
//   quizFile: z.instanceof(File).optional(),
//   questions: z.array(quizQuestionSchema).default([]),
// })

// export const sectionSchema = z.object({
//   title: z.string().min(1, "Section title cannot be empty"),
//   order: z.number().min(1),
//   lessons: z.array(lessonSchema).min(1, "Each section must have at least one lesson"),
// })

// export const courseCreationSchema = z.object({
//   sections: z.array(sectionSchema).min(1, "Course must have at least one section"),
// })

// // Export the inferred types
// export type DocumentType = z.infer<typeof documentSchema>
// export type VideoType = z.infer<typeof videoSchema>
// export type QuizQuestionType = z.infer<typeof quizQuestionSchema>
// export type LessonType = z.infer<typeof lessonSchema>
// export type SectionType = z.infer<typeof sectionSchema>
// export type CourseCreationType = z.infer<typeof courseCreationSchema>

import { z } from 'zod';

export const documentSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return allowedTypes.includes(file.type);
      },
      { message: 'Only PDF and DOCX files are allowed' }
    )
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size must not exceed 10MB',
    }),
  status: z.enum(['publish', 'unpublish']).default('publish'),
});

export const videoSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        return allowedTypes.includes(file.type);
      },
      { message: 'Only MP4, WebM, and OGG video files are allowed' }
    )
    .refine((file) => file.size <= 500 * 1024 * 1024, {
      message: 'Video size must not exceed 500MB',
    }),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question cannot be empty'),
  options: z.array(z.string()).min(2, 'Must have at least 2 options'),
  correctAnswer: z.number().min(0, 'Must select correct answer'),
  explanation: z.string().optional(),
});

export const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title cannot be empty'),
  order: z.number().min(1),
  type: z.enum(['video', 'quiz']),
  // Make documents required but allow empty array
  documents: z.array(documentSchema).default([]),
  // Make questions required but allow empty array
  questions: z.array(quizQuestionSchema).default([]),
  // Keep optional fields as optional but ensure they're handled properly
  video: videoSchema.optional(),
  quizType: z.enum(['ai', 'upload', 'template']).optional(),
  quizFile: z.instanceof(File).optional(),
});

export const sectionSchema = z.object({
  title: z.string().min(1, 'Section title cannot be empty'),
  order: z.number().min(1),
  lessons: z
    .array(lessonSchema)
    .min(1, 'Each section must have at least one lesson'),
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
