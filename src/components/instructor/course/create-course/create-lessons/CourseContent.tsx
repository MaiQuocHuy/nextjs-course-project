'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import pdfToText from 'react-pdftotext';
import {
  Plus,
  Trash2,
  BookOpen,
  Video,
  Brain,
  AlertCircle,
  ChevronRight,
  FileText,
  Edit3,
  Save,
  X,
  Upload,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/instructor/commom/Collapsible';
import { Textarea } from '@/components/ui/textarea';
import { DragDropReorder } from './DragDropReorder';
import {
  courseContentSchema,
  QuizQuestionType,
  QuizType,
  VideoType,
  type CourseContentType,
  type LessonType,
  type SectionType,
} from '@/utils/instructor/course/create-course-validations/course-content-validations';
import { parseExcelFile } from '@/utils/instructor/course/excel/excel-parser';
import { QuizEditor } from './quiz/QuizEditor';
import {
  getCharacterCount,
  getWordCount,
} from '@/utils/instructor/course/course-helper-functions';
import {
  useCreateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  useUpdateSectionMutation,
} from '@/services/instructor/courses/sections-api';
import {
  useCreateLessonMutation,
  useCreateLessonWithQuizMutation,
  useDeleteLessonMutation,
  useReorderLessonsMutation,
  useUpdateVideoLessonMutation,
  useUpdateQuizLessonMutation,
} from '@/services/instructor/courses/lessons-api';
import { toast } from 'sonner';
import { useGenerateQuestionsMutation } from '@/services/instructor/courses/quizzes-api';
import WarningAlert from '@/components/instructor/commom/WarningAlert';
import { useUpdateCourseStatusMutation } from '@/services/instructor/courses/courses-api';
import CreateCourseSuccess from './CreateCourseSuccess';
import ReviewCourse from './ReviewCourse';
import TogglePublishCourse from '../../TogglePublishCourse';
import ExcelFileFormatIns from './ExcelFileFormatIns';
import VideoUpload from './file-upload/VideoUpload';
import DocumentUpload from './file-upload/DocumentUpload';
import ExcelFileUpload from './file-upload/ExcelFileUpload';

interface CourseContentProps {
  courseId: string;
  mode: 'view' | 'edit' | 'create';
  sections?: SectionType[];
  onSectionsChange?: (sections: SectionType[]) => void;
  onSave?: () => void;
  onCancel?: () => void;
  canEditContent?: boolean;
  setProgress?: (progress: number) => void;
}

export default function CourseContent({
  courseId,
  mode,
  sections: initialSections,
  onSectionsChange,
  onCancel,
  canEditContent,
  setProgress,
}: CourseContentProps) {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'create'>(
    mode
  );
  const [step, setStep] = useState<'create' | 'review' | 'success'>('create');
  const [courseStatus, setCourseStatus] = useState<'draft' | 'published'>(
    'draft'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canSaveChanges, setCanSaveChanges] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  const [lessonsData, setLessonsData] = useState<CourseContentType | null>(
    null
  );

  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [isValidInputs, setIsValidInput] = useState(true);

  const [isReorderSection, setReorderSection] = useState(false);
  const [isReorderLesson, setReorderLesson] = useState<number[]>([]);

  const [selectedSection, setSelectedSection] = useState<{
    index: number;
  } | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{
    sectionIndex: number;
    lessonIndex: number;
  } | null>(null);

  const [isDeleteSectionDialogOpen, setIsDeleteSectionDialogOpen] =
    useState(false);
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] =
    useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [tempSections, setTempSections] = useState<SectionType[]>([]);

  const [updateCourseStatus, { isLoading: isUpdatingCourseStatus }] =
    useUpdateCourseStatusMutation();

  const [updatedSections, { isLoading: isUpdatingSections }] =
    useUpdateSectionMutation();
  const [createSection, { isLoading: isCreatingSection }] =
    useCreateSectionMutation();
  const [deleteSection, { isLoading: isDeletingSection }] =
    useDeleteSectionMutation();
  const [reorderSections, { isLoading: isReorderingSections }] =
    useReorderSectionsMutation();

  const [createLesson, { isLoading: isCreatingLesson }] =
    useCreateLessonMutation();
  const [createLessonWithQuiz, { isLoading: isCreatingLessonWithQuiz }] =
    useCreateLessonWithQuizMutation();
  const [updateVideoLessons, { isLoading: isUpdatingVideoLessons }] =
    useUpdateVideoLessonMutation();
  const [updateQuizLessons, { isLoading: isUpdatingQuizLessons }] =
    useUpdateQuizLessonMutation();
  const [deleteLesson, { isLoading: isDeletingLesson }] =
    useDeleteLessonMutation();
  const [reorderLessons, { isLoading: isReorderingLessons }] =
    useReorderLessonsMutation();

  const [generateQuestions, { isLoading: isGeneratingQuizs }] =
    useGenerateQuestionsMutation();

  const form = useForm({
    defaultValues: {
      sections: initialSections
        ? initialSections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) => ({
              ...lesson,
              type: (lesson.type || 'VIDEO') as 'VIDEO' | 'QUIZ',
            })),
          }))
        : [
            {
              id: `new-section-${crypto.randomUUID()}`,
              title: '',
              description: '',
              orderIndex: 0,
              isCollapsed: false,
              lessons: [
                {
                  id: `new-lesson-${crypto.randomUUID()}`,
                  title: '',
                  orderIndex: 0,
                  type: 'VIDEO' as const,
                  isCollapsed: false,
                },
              ],
            },
          ],
    },
    mode: 'onChange',
  });

  const {
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = form;

  const watchedSections = watch('sections');
  
  // Get input errors
  useEffect(() => {
    const formData = form.getValues();
    try {
      const validationResult = courseContentSchema.safeParse(formData);
      if (!validationResult.success) {
        setIsValidInput(false);
        // console.log('Validation Errors:', validationResult.error.issues);
      } else {
        setIsValidInput(true);
      }
    } catch (error) {
      setIsValidInput(true); // If validation fails, allow form to continue
    }
  }, [form.formState]);

  useEffect(() => {
    if (
      isCreatingSection ||
      isUpdatingSections ||
      isReorderingSections ||
      isCreatingLesson ||
      isCreatingLessonWithQuiz ||
      isUpdatingQuizLessons ||
      isUpdatingVideoLessons ||
      isReorderingLessons
    ) {
      setIsSaving(true);
    } else {
      setIsSaving(false);
    }
  }, [
    isCreatingSection,
    isUpdatingSections,
    isReorderingSections,
    isCreatingLesson,
    isCreatingLessonWithQuiz,
    isUpdatingQuizLessons,
    isUpdatingVideoLessons,
    isReorderingLessons,
  ]);

  // Controlling loading state
  useEffect(() => {
    if (
      isSaving ||
      isUpdatingCourseStatus ||
      isDeletingSection ||
      isDeletingLesson ||
      isGeneratingQuizs
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isSaving,
    isUpdatingCourseStatus,
    isDeletingSection,
    isDeletingLesson,
    isGeneratingQuizs,
  ]);

  // Check if there are any changes to enable save button
  useEffect(() => {
    if (
      isValidInputs &&
      isLoading === false &&
      (isDirty || isReorderLesson.length > 0 || isReorderSection)
    ) {
      setCanSaveChanges(true);
    } else {
      setCanSaveChanges(false);
    }
  }, [
    dirtyFields,
    isValidInputs,
    isReorderLesson,
    isReorderSection,
    isLoading,
  ]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const addSection = () => {
    const newSection: SectionType = {
      id: `new-section-${crypto.randomUUID()}`,
      description: '',
      title: '',
      orderIndex: watchedSections.length,
      isCollapsed: false,
      lessons: [
        {
          id: `new-lesson-${crypto.randomUUID()}`,
          title: '',
          orderIndex: 0,
          type: 'VIDEO',
          isCollapsed: false,
        },
      ],
    };
    const currentSections = form.getValues('sections');
    const updatedSections = [...currentSections, newSection];
    form.setValue('sections', updatedSections);
    onSectionsChange?.(updatedSections);
  };

  const removeSection = async (sectionIndex: number) => {
    toast.info('Deleting section. Please wait...');

    let isDeleteSuccess = true;
    const currentSections = form.getValues('sections');
    const deletedSection = currentSections[sectionIndex];

    try {
      // Check if the deleted section is existed or not.
      // If no then just delete section in client side.
      // else perform delete both client and server side.
      if (deletedSection && !deletedSection.id.includes('new-section')) {
        const data = {
          courseId,
          sectionId: deletedSection.id,
        };
        const res = await deleteSection(data).unwrap();
        if (res) {
          if (res.statusCode !== 200) {
            isDeleteSuccess = false;
          }
        }
      }

      if (isDeleteSuccess) {
        // Handling reoder UI
        const updatedSections = currentSections.filter(
          (_, index) => index !== sectionIndex
        );
        updatedSections.forEach((section, idx) => {
          section.orderIndex = idx;
        });
        form.setValue('sections', updatedSections);
        toast.success('Delete section successfully!');
      } else {
        toast.error('Delete section failed!');
      }
    } catch (error) {
      // console.log(error);
      toast.error('Delete section failed!');
      return;
    }
  };

  const addLesson = (sectionIndex: number) => {
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
    const newLesson: LessonType = {
      id: `new-lesson-${crypto.randomUUID()}`,
      title: '',
      orderIndex: currentLessons.length,
      type: 'VIDEO',
      isCollapsed: false,
    };

    form.setValue(`sections.${sectionIndex}.lessons`, [
      ...currentLessons,
      newLesson,
    ]);
  };

  const removeLesson = async (sectionIndex: number, lessonIndex: number) => {
    toast.info('Deleting lesson. Please wait...');
    let isDeleteSuccess = true;
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);

    if (currentLessons.length > 1) {
      try {
        // Check if the deleted lesson is existed or not.
        // If no then just delete lesson in client side.
        // else perform delete both client and server side.
        const section = form.getValues(`sections.${sectionIndex}`);
        if (section && !section.id.includes('new-section')) {
          const deletedLesson = currentLessons[lessonIndex];
          if (deletedLesson && !deletedLesson.id.includes('new-lesson')) {
            const data = {
              sectionId: section.id,
              lessonId: deletedLesson.id,
            };
            const res = await deleteLesson(data).unwrap();
            if (!res || res.statusCode !== 200) {
              isDeleteSuccess = false;
            }
          }
        }

        if (isDeleteSuccess) {
          // Reorder index of lesson
          const updatedLessons = currentLessons.filter(
            (_, index) => index !== lessonIndex
          );
          updatedLessons.forEach((lesson, idx) => {
            lesson.orderIndex = idx;
          });
          form.setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
          const currentFormData = form.getValues();
          form.reset(currentFormData);

          toast.success('Delete lesson successfully!');
        } else {
          toast.error('Delete lesson fail!');
        }
      } catch (error) {
        // console.log(error);
        toast.error('Delete lesson fail!');
      }
    } else {
      toast.error('Each section must have at least one lesson!');
    }
  };

  const generateQuizWithAI = async (
    sectionIndex: number,
    lessonIndex: number
  ) => {
    const documents = form.getValues(
      `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`
    );

    if (documents && documents.length > 0) {
      try {
        // Extract text from multiple documents with different formats
        const extractedTexts: string[] = [];

        for (const doc of documents) {
          const file = doc.file;
          if (!file) continue;

          const fileType = file.type;

          if (
            fileType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) {
            try {
              const mammoth = (await import('mammoth')).default;
              const arrayBuffer = await file.arrayBuffer();
              const { value } = await mammoth.extractRawText({ arrayBuffer });
              const trimmedText = value.trim();
              if (trimmedText) {
                extractedTexts.push(trimmedText);
              }
            } catch (error) {
              console.error('Error extracting text from DOCX:', error);
              toast.error(`Failed to process DOCX: ${file.name}`);
            }
          } else if (fileType === 'text/plain') {
            try {
              const text = await file.text();
              const trimmedText = text.trim();
              if (trimmedText) {
                extractedTexts.push(trimmedText);
              }
            } catch (error) {
              console.error('Error extracting text from TXT:', error);
              toast.error(`Failed to process TXT: ${file.name}`);
            }
          } else if (fileType === 'application/pdf') {
            try {
              const parsedText = await pdfToText(file);
              const trimmedText = parsedText.trim();
              if (trimmedText) extractedTexts.push(trimmedText);
            } catch (pdfError) {
              console.error('Error extracting text from PDF:', pdfError);
              toast.error(`Failed to process PDF: ${file.name}`);
            }
          }
        }

        if (extractedTexts.length === 0) {
          toast.error('No text could be extracted from the documents');
          return;
        }

        toast.info(`Processing ${extractedTexts.length} document(s)...`);

        // Send extracted texts to API
        const data = await generateQuestions({
          texts: extractedTexts,
          numQuestions: 5,
        }).unwrap();

        // Kiểm tra xem data có phải array không
        if (!Array.isArray(data)) {
          toast.error('Generate failed');
          throw new Error(
            'Invalid response format: expected array of questions'
          );
        }

        const generatedQuizzes = data.map((q: any, idx: number) => {
          // Chuyển đổi options thành format { A: string, B: string, C: string, D: string }
          const originalOptions = q.options ?? {};
          const optionLabels = ['A', 'B', 'C', 'D'] as const;
          const optionsObj: { A: string; B: string; C: string; D: string } = {
            A: '',
            B: '',
            C: '',
            D: '',
          };

          let labelIndex = 0;
          Object.entries(originalOptions).forEach(([key, value]) => {
            if (labelIndex < optionLabels.length) {
              optionsObj[optionLabels[labelIndex]] = String(value);
              labelIndex++;
            }
          });

          // Tìm correct answer key mới
          let newCorrectAnswer = q.correctAnswer ?? '';
          if (originalOptions[newCorrectAnswer]) {
            const originalKeys = Object.keys(originalOptions);
            const originalIndex = originalKeys.indexOf(newCorrectAnswer);
            if (originalIndex >= 0 && originalIndex < optionLabels.length) {
              newCorrectAnswer = optionLabels[originalIndex];
            }
          }

          return {
            id: q.id || uuidv4(),
            questionText: q.questionText ?? q.question ?? '',
            options: optionsObj,
            correctAnswer: newCorrectAnswer,
            explanation: q.explanation ?? '',
            orderIndex: idx,
          };
        });

        form.setValue(
          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
          generatedQuizzes
        );

        toast.success('Generate quiz successfully!');
      } catch (err: any) {
        console.error('Generate error:', err);
        toast.error(err?.data?.message || err?.message || 'Generate failed');
      }
    } else {
      toast.error('Generate failed');
    }
  };

  const handleExcelUpload = async (
    file: File,
    sectionIndex: number,
    lessonIndex: number
  ) => {
    setIsParsingExcel(true);

    try {
      const excelData = await parseExcelFile(file);

      const questions: QuizQuestionType[] = excelData.map((data, index) => ({
        id: `excel-${crypto.randomUUID()}`,
        questionText: data.question,
        options: {
          A: data.option1,
          B: data.option2,
          C: data.option3,
          D: data.option4,
        },
        correctAnswer: data.correctAnswer,
        orderIndex: index,
        explanation: data.explanation,
      }));

      form.setValue(
        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
        questions
      );
      toast.success('Excel file parsed successfully!');
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error((error as Error).message || 'Failed to parse Excel file');
    } finally {
      setIsParsingExcel(false);
    }
  };

  const handleModeToggle = () => {
    if (currentMode === 'edit') {
      onCancel?.();
    }

    if (currentMode === 'edit') {
      if (isDirty) {
        setIsCancelDialogOpen(true);
      } else {
        setCurrentMode('view');
      }
    } else if (currentMode === 'view') {
      setCurrentMode('edit');
    }
  };

  const hasVideo = (video: VideoType) => {
    return !!video?.file;
  };

  const hasQuiz = (quiz: QuizType) => {
    let hasQuiz = false;
    if (quiz) {
      if (
        (quiz.questions && quiz.questions.length > 0) ||
        (quiz.documents && quiz.documents.length > 0) ||
        quiz.excelFile
      ) {
        hasQuiz = true;
      }
    }
    return hasQuiz;
  };

  const isEmptyLesson = (lessons: LessonType[]) => {
    let isEmptyLesson = false;
    for (const lesson of lessons) {
      if (
        lesson.title.trim() === '' &&
        !hasVideo(lesson.video) &&
        !hasQuiz(lesson.quiz)
      ) {
        isEmptyLesson = true;
        break;
      } else {
        continue;
      }
    }
    return isEmptyLesson;
  };

  const isEmptyComponent = (sectionIndex: number) => {
    const section = form.getValues(`sections.${sectionIndex}`);

    if (section) {
      const lessons = section.lessons;
      if (
        section.title.trim() === '' &&
        section.description.trim() === '' &&
        isEmptyLesson(lessons)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const renderLesson = (
    sectionIndex: number,
    lesson: LessonType,
    lessonIndex: number
  ) => {
    const isExpanded = expandedLessons.has(lesson.id);

    return (
      <Collapsible
        key={lesson.id}
        defaultOpen={
          (lessonIndex === 0 && currentMode === 'create') ||
          lesson.id.includes('new-lesson')
        }
      >
        <Card key={lesson.id} className="ml-4 gap-2">
          <CollapsibleTrigger asChild>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 py-1"
              onClick={() => toggleLesson(lesson.id)}
              aria-disabled={isLoading}
            >
              <CardTitle className="text-base flex items-center justify-between">
                {/* Lesson title */}
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                  {lesson.type === 'VIDEO' ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  <span>Lesson {lesson.orderIndex + 1}</span>
                  {lesson.title && (
                    <span className="text-sm font-normal text-muted-foreground">
                      - {lesson.title}
                    </span>
                  )}
                  <Badge
                    variant={lesson.type === 'VIDEO' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {lesson.type === 'VIDEO' ? 'Video' : 'Quiz'}
                  </Badge>
                </div>

                {/* Remove lesson */}
                {currentMode !== 'view' &&
                  watchedSections[sectionIndex]?.lessons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (
                          isEmptyLesson(watchedSections[sectionIndex].lessons)
                        ) {
                          removeLesson(sectionIndex, lessonIndex);
                        } else {
                          setSelectedLesson({ sectionIndex, lessonIndex });
                          setIsDeleteLessonDialogOpen(true);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              {currentMode === 'view' ? (
                <>
                  {/* Lesson video */}
                  {lesson.video && lesson.video.file && (
                    <VideoUpload videoFile={lesson.video.file} />
                  )}

                  {/* Quiz questions preview in view mode */}
                  {lesson.quiz &&
                    lesson.quiz.questions &&
                    lesson.quiz.questions.length > 0 && (
                      <QuizEditor
                        canEdit={false}
                        questions={lesson.quiz.questions}
                        onQuestionsChange={(questions) => {
                          form.setValue(
                            `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
                            questions
                          );
                        }}
                      />
                    )}
                </>
              ) : (
                <>
                  {/* Edit mode form fields */}
                  {/* Lesson title input */}
                  <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter lesson title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lesson type input */}
                  {(currentMode === 'create' ||
                    (currentMode === 'edit' &&
                      lesson.id.includes('new-lesson'))) && (
                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.lessons.${lessonIndex}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lesson Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              {/* Video type */}
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="VIDEO"
                                  id={`video-${sectionIndex}-${lessonIndex}`}
                                />
                                <Label
                                  htmlFor={`video-${sectionIndex}-${lessonIndex}`}
                                >
                                  <Video className="h-4 w-4 inline mr-2" />
                                  Video
                                </Label>
                              </div>

                              {/* Quiz type */}
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="QUIZ"
                                  id={`quiz-${sectionIndex}-${lessonIndex}`}
                                />
                                <Label
                                  htmlFor={`quiz-${sectionIndex}-${lessonIndex}`}
                                >
                                  <Brain className="h-4 w-4 inline mr-2" />
                                  Quiz
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Video upload */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                  ) === 'VIDEO' && (
                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.lessons.${lessonIndex}.video.file`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <VideoUpload
                              videoFile={form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.video.file`
                              )}
                              onVideoChange={(file) => {
                                field.onChange(file);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Quiz section */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                  ) === 'QUIZ' && (
                    <div className="space-y-3">
                      {(currentMode === 'create' ||
                        (currentMode === 'edit' &&
                          lesson.id.includes('new-lesson'))) && (
                        <div className="space-y-4">
                          {/* Quiz method */}
                          <FormField
                            control={form.control}
                            name={`sections.${sectionIndex}.lessons.${lessonIndex}.quizType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quiz Creation Method</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(e) => {
                                      // Reset quiz data when quiz type changes
                                      form.setValue(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
                                        []
                                      );

                                      const hasDocuments = form.getValues(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`
                                      );
                                      if (hasDocuments) {
                                        form.setValue(
                                          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`,
                                          []
                                        );
                                      }

                                      const hasExcelFile = form.getValues(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.excelFile`
                                      );
                                      if (hasExcelFile) {
                                        form.setValue(
                                          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.excelFile`,
                                          undefined
                                        );
                                      }

                                      field.onChange(e);
                                    }}
                                    value={field.value}
                                    className="flex gap-6"
                                  >
                                    {/* Generate with AI */}
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="ai"
                                        id={`ai-${sectionIndex}-${lessonIndex}`}
                                      />
                                      <Label
                                        htmlFor={`ai-${sectionIndex}-${lessonIndex}`}
                                      >
                                        <Brain className="h-4 w-4 inline mr-2" />
                                        Generate with AI
                                      </Label>
                                    </div>

                                    {/* Upload Excel File */}
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="upload"
                                        id={`upload-${sectionIndex}-${lessonIndex}`}
                                      />
                                      <Label
                                        htmlFor={`upload-${sectionIndex}-${lessonIndex}`}
                                      >
                                        <Upload className="h-4 w-4 inline mr-2" />
                                        Upload Excel File
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Generated quiz with AI */}
                          {form.watch(
                            `sections.${sectionIndex}.lessons.${lessonIndex}.quizType`
                          ) === 'ai' && (
                            <div className="space-y-2">
                              {/* Multiple Documents Upload */}
                              <DocumentUpload
                                documents={
                                  form.watch(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`
                                  ) || []
                                }
                                onDocumentsChange={(documents) => {
                                  form.setValue(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`,
                                    documents
                                  );
                                }}
                              />

                              {/* Generated Quiz Button */}
                              {Boolean(
                                form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents`
                                )?.length
                              ) && (
                                <Button
                                  type="button"
                                  onClick={() =>
                                    generateQuizWithAI(
                                      sectionIndex,
                                      lessonIndex
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  {isGeneratingQuizs
                                    ? 'Generating quiz...'
                                    : 'Generate Questions with AI'}
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Generated quiz by excel file upload */}
                          {form.watch(
                            `sections.${sectionIndex}.lessons.${lessonIndex}.quizType`
                          ) === 'upload' && (
                            <div className="space-y-4">
                              <ExcelFileFormatIns />

                              <ExcelFileUpload
                                excelFile={form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.excelFile`
                                )}
                                onExcelFileChange={(excelFile) => {
                                  form.setValue(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.excelFile`,
                                    excelFile
                                  );
                                  if (excelFile && excelFile.file) {
                                    handleExcelUpload(
                                      excelFile.file,
                                      sectionIndex,
                                      lessonIndex
                                    );
                                  }
                                }}
                              />

                              {isParsingExcel && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    Parsing Excel file...
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* List of generated questions */}
                      {form.watch(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz`
                      ) &&
                        form.watch(
                          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`
                        )?.length > 0 && (
                          <FormField
                            control={form.control}
                            name={`sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <QuizEditor
                                    canEdit={true}
                                    questions={form.watch(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`
                                    )}
                                    onQuestionsChange={(questions) => {
                                      field.onChange(questions);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const renderSection = (section: SectionType, sectionIndex: number) => {
    const isExpanded = expandedSections.has(section.id);

    return (
      <Collapsible key={section.id} defaultOpen={sectionIndex === 0}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 py-1"
              onClick={() => toggleSection(section.id)}
              aria-disabled={isLoading}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      'h-5 w-5 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                  <BookOpen className="h-5 w-5" />
                  <span>Section {section.orderIndex + 1}</span>
                  {section.title && (
                    <span className="text-base font-normal text-muted-foreground">
                      - {section.title}
                    </span>
                  )}
                </div>

                {/* Button remove section */}
                {currentMode !== 'view' && watchedSections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isEmptyComponent(sectionIndex)) {
                        removeSection(sectionIndex);
                      } else {
                        setSelectedSection({ index: sectionIndex });
                        setIsDeleteSectionDialogOpen(true);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {currentMode === 'view' ? (
                <>
                  {/* View mode content */}
                  {section.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Edit mode form fields */}
                  {/* Title input */}
                  <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Section Title{' '}
                          <strong className="text-red-500">*</strong>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Enter section title"
                              {...field}
                              className={cn(
                                errors.sections?.[sectionIndex]?.title &&
                                  'border-red-500',
                                !errors.sections?.[sectionIndex]?.title &&
                                  field.value &&
                                  'border-green-500'
                              )}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{field.value.length}/255 characters</span>
                              {!errors.sections?.[sectionIndex]?.title &&
                                field.value && (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Valid title
                                  </span>
                                )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Create a clear, descriptive title that tells students
                          what they'll learn
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Description input */}
                  <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Section Description{' '}
                          <strong className="text-red-500">*</strong>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Describe what students will learn, what skills they'll gain, and why they should take this course..."
                              className={cn(
                                'min-h-32 resize-none',
                                errors.sections?.[sectionIndex]?.description &&
                                  'border-red-500',
                                !errors.sections?.[sectionIndex]?.description &&
                                  field.value &&
                                  'border-green-500'
                              )}
                              {...field}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <div className="space-x-4">
                                <span>
                                  {field.value
                                    ? getCharacterCount(field.value)
                                    : 0}
                                  /255 characters
                                </span>
                              </div>
                              {!errors.sections?.[sectionIndex]?.description &&
                                field.value &&
                                getWordCount(field.value) >= 20 && (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Good description
                                  </span>
                                )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Write a compelling description that explains the value
                          and outcomes of your course
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Lessons */}
              <div className="space-y-4">
                <h4 className="font-medium">
                  Lessons ({section.lessons.length})
                </h4>

                {/* Render lessons in edit mode */}
                <div className="space-y-4">
                  <DragDropReorder
                    items={watchedSections[sectionIndex]?.lessons || []}
                    onReorder={(reorderedLessons) => {
                      getTempSections();
                      form.setValue(
                        `sections.${sectionIndex}.lessons`,
                        reorderedLessons
                      );
                      setReorderLesson((prev) => [...prev, sectionIndex]);
                    }}
                    renderItem={(lesson, lessonIndex) =>
                      renderLesson(sectionIndex, lesson, lessonIndex)
                    }
                    className="space-y-4"
                  />

                  {/* Add new lesson button */}
                  {currentMode !== 'view' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addLesson(sectionIndex);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const getTempSections = () => {
    // Create a deep copy of the sections
    const allSections = form.getValues('sections');
    const currentSections = JSON.parse(JSON.stringify(allSections));

    // Manually restore any File objects that were lost in the stringification
    currentSections.forEach((section: SectionType, secIdx: number) => {
      section.lessons.forEach((lesson, lesIdx) => {
        if (
          lesson.type === 'VIDEO' &&
          allSections[secIdx].lessons[lesIdx].video?.file
        ) {
          // Restore the original File object
          lesson.video = lesson.video || {};
          lesson.video.file = allSections[secIdx].lessons[lesIdx].video.file;
        }
      });
    });

    setTempSections(currentSections);
  };

  const createNewLesson = async (section: SectionType, lesson: LessonType) => {
    let result = false;

    try {
      let response = null;
      if (lesson.type === 'VIDEO' && lesson.video) {
        const lessonData = {
          title: lesson.title,
          type: lesson.type.toUpperCase(),
          videoFile: lesson.video.file,
        };
        response = await createLesson({
          sectionId: section.id,
          lessonData,
        }).unwrap();
      } else {
        const updatedLesson = {
          ...lesson,
          quiz: {
            ...lesson.quiz,
            // Remove documents from quiz
            documents: undefined,
            // Remove id and orderIndex from questions
            questions: lesson.quiz?.questions?.map((question) => {
              const { id, orderIndex, ...rest } = question;
              return rest;
            }),
          },
        };
        const lessonData = {
          title: updatedLesson.title,
          type: updatedLesson.type,
          quiz: updatedLesson.quiz,
        };
        response = await createLessonWithQuiz({
          sectionId: section.id,
          data: lessonData,
        }).unwrap();
      }

      // Assign id to lesson
      if (response && response.statusCode === 201 && response.data) {
        // console.log(response);
        if (currentMode === 'edit') {
          const lessonId = response.data.id;
          let currentLesIndex;

          if (tempSections.length > 0) {
            const currentSections = form.getValues('sections');
            const currentLessons = currentSections[section.orderIndex].lessons;
            if (currentLessons.length > 0) {
              currentLesIndex = currentLessons.findIndex(
                (les) => les.id === lesson.id
              );
            }
          } else {
            currentLesIndex = response.data.orderIndex;
          }
          form.setValue(
            `sections.${section.orderIndex}.lessons.${currentLesIndex}.id`,
            lessonId
          );
          form.setValue(
            `sections.${section.orderIndex}.lessons.${currentLesIndex}.orderIndex`,
            currentLesIndex
          );
        }
        result = true;
      }
    } catch (error) {
      console.error('Error:', error);
    }

    return result;
  };

  const updateExistedLesson = async (sectionId: string, lesson: LessonType) => {
    let response = null;
    let result = false;

    try {
      if (lesson.type === 'VIDEO') {
        const lessonData = {
          sectionId,
          lessonId: lesson.id,
          title: lesson.title,
          type: lesson.type,
          videoFile: lesson.video?.file,
        };
        response = await updateVideoLessons(lessonData).unwrap();
      } else {
        if (lesson.quiz) {
          const updatedQuestions = lesson.quiz.questions.map((question) => {
            const { orderIndex, ...rest } = question;
            return rest;
          });
          const lessonData = {
            sectionId,
            lessonId: lesson.id,
            questions: updatedQuestions,
          };
          response = await updateQuizLessons(lessonData).unwrap();
        }
      }

      if (response && response.statusCode === 200) {
        result = true;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return result;
  };

  const findCurrentSectionIndex = (sectionId: string) => {
    const currentSections = form.getValues('sections');
    return currentSections.findIndex((sec) => sec.id === sectionId);
  };

  const findCurrentSectionByTitleAndDesc = (section: SectionType) => {
    const currentSections = form.getValues('sections');
    return currentSections.find(
      (sec) =>
        sec.title === section.title && sec.description === section.description
    );
  };

  const createNewSection = async (section: SectionType) => {
    let data = null;
    try {
      const sectionData = {
        title: section.title,
        description: section.description,
      };
      const response = await createSection({
        courseId: courseId,
        sectionData,
      }).unwrap();
      // Create each lesson in the section
      if (response && response.statusCode === 201 && response.data) {
        // console.log(response);
        // Assign id to section. Cause in edit mode, id of a new created section is ''
        if (currentMode === 'edit') {
          const sectionId = response.data.id;
          let secIndex;
          if (tempSections.length > 0) {
            secIndex = findCurrentSectionIndex(section.id);
          } else {
            secIndex = response.data.orderIndex;
          }
          form.setValue(`sections.${secIndex}.id`, sectionId);
          form.setValue(`sections.${secIndex}.orderIndex`, secIndex);
        }
        data = response.data;
      }
    } catch (error) {
      // console.error('Error:', error);
    }
    return data;
  };

  const handleSave = async () => {
    // console.log(formData);
    let isUpdateSuccess = true;
    let sections = [];
    const currentSections = form.getValues('sections');

    // Use temporarily sections that help perform reorder sections and lessons correctly.
    // Because dirtyFields are not change indices eventhough form's values are updated.
    if (tempSections.length > 0) {
      sections = tempSections;
    } else {
      sections = currentSections;
    }
    try {
      if (dirtyFields.sections) {
        const changedSections = dirtyFields.sections;
        for (const [idx, sec] of sections.entries()) {
          // Update section's title and description if have
          if (
            changedSections[idx]?.title ||
            changedSections[idx]?.description
          ) {
            // Create new section and lesson into databse if it is not created before
            if (sec.id.includes('new-section')) {
              const data = await createNewSection(sec);
              if (data === null) {
                isUpdateSuccess = false;
                break;
              }
            } else {
              // Update existed section
              const data = {
                courseId,
                sectionId: sec.id,
                sectionData: {
                  title: sec.title,
                  description: sec.description,
                },
              };
              const response = await updatedSections(data).unwrap();
              if (!response || response.statusCode !== 200) {
                isUpdateSuccess = false;
                break;
              }
            }
          }

          // Update lesson's fields if have
          const changedLessons = changedSections[idx]?.lessons;
          if (changedLessons) {
            for (const [lessonIdx, les] of sec.lessons.entries()) {
              if (changedLessons[lessonIdx]) {
                let currentSec = sec;
                if (tempSections.length > 0) {
                  const existingSec = findCurrentSectionByTitleAndDesc(
                    sec
                  ) as SectionType;
                  if (existingSec) {
                    currentSec = existingSec;
                  }
                }

                if (currentSec.id && !currentSec.id.includes('new-section')) {
                  // Create new lesson
                  if (les.id.includes('new-lesson')) {
                    const result = await createNewLesson(currentSec, les);
                    if (result === false) {
                      isUpdateSuccess = false;
                      break;
                    }
                  } else {
                    // Update existed lesson
                    const result = await updateExistedLesson(
                      currentSec.id,
                      les
                    );
                    if (result === false) {
                      isUpdateSuccess = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Handle Reorder sections and lessons if have
      if (isReorderSection) {
        const sectionOrder = watchedSections.map((sec) => sec.id);
        const res = await reorderSections({
          courseId,
          sectionOrder,
        }).unwrap();
        if (!res || res.statusCode !== 200) {
          isUpdateSuccess = false;
        }
      }

      if (isReorderLesson.length > 0) {
        for (const sectionIndex of isReorderLesson) {
          const section = watchedSections[sectionIndex];
          const lessonOrder = section.lessons.map((les) => les.id);
          const res = await reorderLessons({
            sectionId: section.id,
            lessonOrder,
          }).unwrap();
          if (!res || res.statusCode !== 200) {
            isUpdateSuccess = false;
            break;
          }
        }
      }

      if (isUpdateSuccess) {
        form.reset({ sections: currentSections });
        setTempSections([]);
        setReorderSection(false);
        setReorderLesson([]);

        toast.success('Update Section(s) and lesson(s) successfully!');
      } else {
        toast.error('Update Section(s) and lesson(s) failed!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Update Section(s) and lesson(s) failed!');
    }
  };

  const handleSubmitForm = (data: any) => {
    try {
      // Validate the data before proceeding
      const validationResult = courseContentSchema.safeParse(data);
      if (validationResult.success) {
        setLessonsData(validationResult.data);
        setStep('review');
      } else {        
        toast.error(
          validationResult.error.issues[0].message ||
            'Please check the form for validation errors'
        );
      }
    } catch (error) {
      toast.error('Create course failed!');
    }
  };

  const handleFinalSubmit = async () => {
    let isCreateSuccess = false;
    if (lessonsData) {
      try {
        // Create section(s) and lesson(s)
        for (const section of lessonsData.sections) {
          const data = await createNewSection(section);
          // Create each lesson in the section
          if (data) {
            for (const lesson of section.lessons) {
              const result = await createNewLesson(data, lesson);
              if (result) {
                isCreateSuccess = true;
              } else {
                isCreateSuccess = false;
                break;
              }
            }
          }
        }

        // Update course status
        if (courseStatus === 'published') {
          const res = await updateCourseStatus({
            courseId,
            status: courseStatus.toUpperCase(),
          }).unwrap();
          if (!res || res.statusCode !== 200) {
            isCreateSuccess = false;
          }
        }
      } catch (error) {
        console.error('Create error:', error);
      }
    }

    if (isCreateSuccess) {
      setStep('success');
      setProgress?.(100); // Update progress to 100% on success
    } else {
      toast.error('Create section(s) and lesson(s) failed!');
    }
  };

  const handlePublishCourseToggle = (checked: boolean) => {
    setCourseStatus(checked ? 'published' : 'draft');
  };

  if (step === 'success') {
    return <CreateCourseSuccess />;
  }

  if (step === 'review') {
    const sections = form.getValues('sections');
    return (
      <ReviewCourse
        courseStatus={courseStatus}
        sections={sections}
        onBackToEdit={() => setStep('create')}
        handleFinalSubmit={handleFinalSubmit}
        isCreating={
          isCreatingSection || isCreatingLesson || isUpdatingCourseStatus
        }
      />
    );
  }

  return (
    <div>
      {/* Content */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              {/* Header */}
              <div className="flex items-center justify-between">
                {/* Header Title */}
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentMode === 'view'
                      ? 'View Course Content'
                      : currentMode === 'create'
                      ? 'Create Course Content'
                      : 'Edit Course Content'}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentMode === 'view'
                      ? 'View the content of your course'
                      : currentMode === 'create'
                      ? 'Create your course sections and lessons'
                      : 'Manage your course sections and lessons'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {currentMode === 'edit' && (
                    <>
                      {/* Cancel edit button */}
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleModeToggle();
                        }}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>

                      {/* Save changes button */}
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSave();
                        }}
                        disabled={!canSaveChanges}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            <span>Saving</span>
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </>
                  )}

                  {currentMode === 'view' && canEditContent && (
                    <Button onClick={handleModeToggle}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Content
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {currentMode === 'view' ? (
                  <div className="space-y-6">
                    {watchedSections.map((section, index) =>
                      renderSection(section, index)
                    )}
                  </div>
                ) : (
                  <DragDropReorder
                    items={watchedSections}
                    onReorder={(reorderedSections) => {
                      getTempSections();
                      form.setValue('sections', reorderedSections);
                      setReorderSection(true);
                    }}
                    renderItem={renderSection}
                    className="space-y-6"
                  />
                )}

                {/* Add section button (use for create and edit mode) */}
                {currentMode !== 'view' && (
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        addSection();
                      }}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {mode === 'create' && (
            <>
              {/* Publish course status */}
              <TogglePublishCourse
                courseStatus={courseStatus}
                isLoading={isLoading}
                handlePublishCourseToggle={handlePublishCourseToggle}
              />

              {/* Save and Review button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  Save and Review
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      {/* Warning Alert for Section Deletion */}
      {selectedSection && (
        <WarningAlert
          open={isDeleteSectionDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteSectionDialogOpen(open);
            if (!open) {
              setSelectedSection(null);
            }
          }}
          title="Are you sure you want to delete this section?"
          description="This action cannot be undone. This will permanently delete the section and all its lessons."
          onClick={() => {
            if (selectedSection) {
              removeSection(selectedSection.index);
              setIsDeleteSectionDialogOpen(false);
              setSelectedSection(null);
            }
          }}
          actionTitle="Delete Section"
        />
      )}

      {/* Warning Alert for Lesson Deletion */}
      {selectedLesson && (
        <WarningAlert
          open={isDeleteLessonDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteLessonDialogOpen(open);
            if (!open) {
              setSelectedLesson(null);
            }
          }}
          title="Are you sure you want to delete this lesson?"
          description="This action cannot be undone. This will permanently delete the lesson and all its content."
          onClick={() => {
            if (selectedLesson) {
              removeLesson(
                selectedLesson.sectionIndex,
                selectedLesson.lessonIndex
              );
              setIsDeleteLessonDialogOpen(false);
              setSelectedLesson(null);
            }
          }}
          actionTitle="Delete Lesson"
        />
      )}

      {/* Warning Alert for cancel edit */}
      {isCancelDialogOpen && (
        <WarningAlert
          open={isCancelDialogOpen}
          onOpenChange={(open) => {
            setIsCancelDialogOpen(open);
          }}
          className="bg-sidebar-primary text-white"
          title="Are you sure you want to cancel editing this lesson?"
          description="This action cannot be undone. Any unsaved changes will be lost."
          onClick={() => {
            form.reset({ sections: initialSections });
            setTempSections([]);
            setIsCancelDialogOpen(false);
            setCurrentMode('view');
          }}
          actionTitle="Cancel Editing"
        />
      )}
    </div>
  );
}
