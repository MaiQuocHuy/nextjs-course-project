'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

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
  FileSpreadsheet,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropReorder } from './create-course/create-lessons/drag-drop-reorder';
import {
  courseCreationSchema,
  QuizQuestionType,
  type CourseCreationType,
  type LessonType,
  type SectionType,
} from '@/utils/instructor/create-course-validations/lessons-validations';
import { CombinedFileUpload } from './create-course/create-lessons/file-upload/combined-file-upload';
import EnhancedFileUpload from './create-course/create-lessons/file-upload/enhanced-file-upload';
import {
  parseExcelFile,
  validateExcelFormat,
} from '@/utils/instructor/create-course-validations/excel-parser';
import { EnhancedQuizEditor } from './create-course/create-lessons/quiz/enhanced-quiz-editor';
import {
  getCharacterCount,
  getWordCount,
} from '@/utils/instructor/create-course-validations/course-basic-info-validation';
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
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useGenerateQuestionsMutation } from '@/services/instructor/courses/quizzes-api';
import WarningAlert from '@/components/instructor/commom/WarningAlert';

interface SectionsLessonsManagerProps {
  courseId: string;
  mode: 'view' | 'edit' | 'create';
  sections?: SectionType[];
  onSectionsChange?: (sections: SectionType[]) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  canEditContent?: boolean;
  setProgress?: (progress: number) => void;
}

export default function SectionsLessonsManager2({
  courseId,
  mode,
  sections: initialSections,
  onSectionsChange,
  onCancel,
  isLoading = false,
  canEditContent,
  setProgress,
}: SectionsLessonsManagerProps) {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'create'>(
    mode
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  const [step, setStep] = useState<'create' | 'review' | 'success'>('create');
  const [lessonsData, setLessonsData] = useState<CourseCreationType | null>(
    null
  );
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [isValidInputs, setIsValidInput] = useState(true);
  const [isReorderedContent, setIsReorderedContent] = useState({
    isReorder: false,
    sectionId: '',
    lessonId: '',
  });
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

  const dispatch: AppDispatch = useDispatch();

  const [updatedSections] = useUpdateSectionMutation();
  const [createSection] = useCreateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [reorderSections] = useReorderSectionsMutation();

  const [createLesson] = useCreateLessonMutation();
  const [createLessonWithQuiz] = useCreateLessonWithQuizMutation();
  const [updateVideoLessons] = useUpdateVideoLessonMutation();
  const [updateQuizLessons] = useUpdateQuizLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [reorderLessons] = useReorderLessonsMutation();

  const [generateQuestions, { isLoading: isGeneratingQuizs }] =
    useGenerateQuestionsMutation();

  const form = useForm<CourseCreationType>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      sections: initialSections
        ? initialSections
        : [
            {
              id: `section-${crypto.randomUUID()}`,
              title: '',
              description: '',
              orderIndex: 0,
              isCollapsed: false,
              lessons: [
                {
                  id: `lesson-${crypto.randomUUID()}`,
                  title: 'Set up React Environment',
                  orderIndex: 0,
                  type: 'VIDEO',
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
    formState: { errors, dirtyFields },
  } = form;

  const watchedSections = watch('sections');

  // Get input errors
  useEffect(() => {
    const formData = form.getValues();
    const validationResult = courseCreationSchema.safeParse(formData);
    // console.log('Form Data:', formData);
    if (!validationResult.success) {
      setIsValidInput(false);
      // console.log('Validation Errors:', validationResult.error.issues);
    } else {
      setIsValidInput(true);
    }
  }, [form.formState]);

  // Toggle functions
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

  // CRUD operations
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
    loadingAnimation(true, dispatch, 'Deleting section. Please wait...');
    try {
      const currentSections = form.getValues('sections');
      let isDeleteSuccess = true;
      // Check if the deleted section is existed or not.
      // If no then just delete section in client side.
      // else perform delete both client and server side.
      const deletedSection = currentSections[sectionIndex];
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
        loadingAnimation(false, dispatch);
        toast.success('Delete section successfully!');
      } else {
        loadingAnimation(false, dispatch);
        toast.error('Delete section failed!');
      }
    } catch (error) {
      console.log(error);
      loadingAnimation(false, dispatch);
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
    loadingAnimation(true, dispatch, 'Deleting lesson. Please wait...');
    try {
      let isDeleteSuccess = true;
      const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
      if (currentLessons.length > 1) {
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
          loadingAnimation(false, dispatch);
          toast.success('Delete lesson successfully!');
        } else {
          loadingAnimation(false, dispatch);
          toast.error('Delete lesson fail!');
        }
      }
    } catch (error) {
      console.log(error);
      loadingAnimation(false, dispatch);
      toast.error('Delete lesson fail!');
      return;
    }
  };

  const generateQuizWithAI = async (
    sectionIndex: number,
    lessonIndex: number
  ) => {
    const file = form.getValues(
      `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.documents.0.file`
    );
    if (file) {
      try {
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        const cleanedText = value.trim();

        const data = await generateQuestions({
          text: cleanedText,
          numQuestions: 5,
        }).unwrap();

        // console.log('Generated questions data:', data);

        // Kiểm tra xem data có phải array không
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
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

        console.log('Generated questions data:', generatedQuizzes);
        form.setValue(
          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
          generatedQuizzes
        );

        toast.success('Generate quiz successfully!');
      } catch (err: any) {
        console.error('Generate error:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          originalError: err,
        });
        toast.error(err?.data?.message || err?.message || 'Generate failed');
      }
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

      if (!validateExcelFormat(excelData)) {
        throw new Error('Invalid Excel format');
      }

      const questions: QuizQuestionType[] = excelData.map((data, index) => ({
        id: `excel-q-${Date.now()}-${index}`,
        question: data.question,
        options: [
          data.option1,
          data.option2,
          data.option3,
          data.option4,
          data.option5,
          data.option6,
        ].filter(Boolean),
        correctAnswer: data.correctAnswer - 1, // Convert to 0-based index
        explanation: data.explanation,
        order: index + 1,
      }));

      form.setValue(
        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
        questions
      );
      form.setValue(
        `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`,
        file
      );
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      // Handle error - show toast or alert
    } finally {
      setIsParsingExcel(false);
    }
  };

  const handleModeToggle = () => {
    if (currentMode === 'edit') {
      onCancel?.();
    }
    setCurrentMode(currentMode === 'view' ? 'edit' : 'view');
  };

  // const handleReorderLesson = async (
  //   sectionIndex: number,
  //   index1: number,
  //   index2: number
  // ) => {
  //   // loadingAnimation(true, dispatch, 'Reordering lessons...');

  //   try {
  //     const currentLessons = watchedSections[sectionIndex].lessons;
  //     // Create new lesson in database before conduct reorder lessons
  //     if (
  //       (currentLessons[index1].id.includes('new-lesson') &&
  //         !currentLessons[index2].id.includes('new-lesson')) ||
  //       (!currentLessons[index1].id.includes('new-lesson') &&
  //         currentLessons[index2].id.includes('new-lesson'))
  //     ) {
  //       let response = null;
  //       const section = watchedSections[sectionIndex];
  //       let lesson: LessonType = {
  //         id: '',
  //         title: '',
  //         orderIndex: 0,
  //         type: 'VIDEO',
  //       };
  //       if (currentLessons[index1].id.includes('new-lesson')) {
  //         lesson = section.lessons[index1];
  //       } else {
  //         lesson = section.lessons[index2];
  //       }
  //       response = await createNewLesson(section, lesson);
  //       if (response) {
  //         // const [movedLesson] = currentLessons.splice(index1, 1);
  //         // currentLessons.splice(index2, 0, movedLesson);
  //         // form.setValue(`sections.${sectionIndex}.lessons`, currentLessons);
  //         // loadingAnimation(false, dispatch);
  //         // toast.success('Reorder lessons succesfully!');
  //       } else {
  //         loadingAnimation(false, dispatch);
  //         toast.error('Reorder lessons failed!');
  //       }
  //     }
  //     // Perform reorder these two lessons
  //   } catch (error) {
  //     loadingAnimation(false, dispatch);
  //     toast.error('Reorder lessons failed!');
  //   }
  // };

  const renderLesson = (
    sectionIndex: number,
    lesson: LessonType,
    lessonIndex: number
  ) => {
    const isExpanded = expandedLessons.has(lesson.id);

    return (
      <Collapsible key={lesson.id} defaultOpen={lessonIndex === 0}>
        <Card key={lesson.id} className="ml-4 gap-2">
          <CollapsibleTrigger asChild>
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleLesson(lesson.id)}
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

                {/* Action buttons */}
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Remove lesson */}
                  {currentMode === 'edit' &&
                    watchedSections[sectionIndex]?.lessons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(lesson.id);

                          if (lesson.id.includes('new-lesson')) {
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
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              {currentMode === 'view' ? (
                <>
                  {/* Documents list in view mode */}
                  {lesson.quiz &&
                    lesson.quiz.documents &&
                    lesson.quiz.documents.length > 0 && (
                      <CombinedFileUpload documents={lesson.quiz.documents} />
                    )}

                  {/* Lesson video */}
                  {lesson.video && lesson.video.file && (
                    <CombinedFileUpload videoFile={lesson.video.file} />
                  )}

                  {/* Quiz questions preview in view mode */}
                  {lesson.quiz &&
                    lesson.quiz.questions &&
                    lesson.quiz.questions.length > 0 && (
                      <EnhancedQuizEditor
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
                            <CombinedFileUpload
                              videoFile={form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.video.file`
                              )}
                              onVideoSelect={(file) => {
                                field.onChange(file);
                              }}
                              onVideoRemove={() => {
                                field.onChange(undefined);
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
                      {(lesson.quiz === null || currentMode === 'create') && (
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
                                    onValueChange={field.onChange}
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
                              <CombinedFileUpload
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
                                  disabled={isGeneratingQuizs}
                                >
                                  {isGeneratingQuizs
                                    ? 'Generating quizzes...'
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
                              <Alert>
                                <FileSpreadsheet className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>
                                    Excel File Format Instructions:
                                  </strong>
                                  <br />
                                  Your Excel file should have the following
                                  columns:
                                  <br />• Column A: Question
                                  <br />• Column B: Option 1
                                  <br />• Column C: Option 2
                                  <br />• Column D: Option 3 (optional)
                                  <br />• Column E: Option 4 (optional)
                                  <br />• Column F: Option 5 (optional)
                                  <br />• Column G: Option 6 (optional)
                                  <br />• Column H: Correct Answer (number 1-6)
                                  <br />• Column I: Explanation (optional)
                                </AlertDescription>
                              </Alert>

                              <EnhancedFileUpload
                                accept={{
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                    ['.xlsx'],
                                  'application/vnd.ms-excel': ['.xls'],
                                }}
                                maxSize={5 * 1024 * 1024}
                                onFileSelect={(file) =>
                                  handleExcelUpload(
                                    file,
                                    sectionIndex,
                                    lessonIndex
                                  )
                                }
                                onFileRemove={() => {
                                  form.setValue(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`,
                                    undefined
                                  );
                                  form.setValue(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
                                    []
                                  );
                                }}
                                selectedFile={form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`
                                )}
                                label="Upload Quiz File (Excel)"
                                type="document"
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
                                  <EnhancedQuizEditor
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
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => toggleSection(section.id)}
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
                {currentMode === 'edit' && watchedSections.length > 1 && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (section.id.includes('new-section')) {
                          removeSection(sectionIndex);
                        } else {
                          setSelectedSection({ index: sectionIndex });
                          setIsDeleteSectionDialogOpen(true);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                          Course Title{' '}
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
                          Course Description{' '}
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
                      const updatedLessons = reorderedLessons.map(
                        (lesson, index) => ({
                          ...lesson,
                          orderIndex: index,
                        })
                      );
                      form.setValue(
                        `sections.${sectionIndex}.lessons`,
                        updatedLessons
                      );
                      setIsReorderedContent((prev) => ({
                        ...prev,
                        isReorder: true,
                        sectionId: watchedSections[sectionIndex].id || '',
                      }));
                    }}
                    // onReorder2={(index1, index2) =>
                    //   handleReorderLesson(sectionIndex, index1, index2)
                    // }
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
                      onClick={() => addLesson(sectionIndex)}
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

  const createNewLesson = async (section: SectionType, lesson: LessonType) => {
    let result = false;

    try {
      let response = null;
      if (lesson.type === 'VIDEO') {
        const lessonData = {
          title: lesson.title,
          type: lesson.type.toUpperCase(),
          videoFile: lesson.video?.file,
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
          const lessonIndex = response.data.orderIndex;
          console.log(lessonId, lessonIndex);

          form.setValue(
            `sections.${section.orderIndex}.lessons.${lessonIndex}.id`,
            lessonId
          );
          form.setValue(
            `sections.${section.orderIndex}.lessons.${lessonIndex}.orderIndex`,
            lessonIndex
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
          const secIndex = response.data.orderIndex;
          if (secIndex) {
            form.setValue(`sections.${secIndex}.id`, sectionId);
            form.setValue(`sections.${secIndex}.orderIndex`, secIndex);
          }
        }
        data = response.data;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return data;
  };

  const handleSave = async () => {
    // console.log(formData);
    const sections = form.watch('sections');
    let isUpdateSuccess = true;
    try {
      loadingAnimation(
        true,
        dispatch,
        'Section(s) and lesson(s) are being updated...'
      );

      // const sections = formData.sections;
      for (const [idx, sec] of sections.entries()) {
        if (dirtyFields.sections) {
          // Update section's title and description if have
          if (
            dirtyFields.sections[idx]?.title ||
            dirtyFields.sections[idx]?.description
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
          const changedLessons = dirtyFields.sections[idx]?.lessons;
          if (changedLessons) {
            for (const [lessonIdx, les] of sec.lessons.entries()) {
              if (changedLessons[lessonIdx]) {
                if (sec.id && !sec.id.includes('new-section')) {
                  // Create new lesson
                  if (les.id.includes('new-lesson')) {
                    const result = await createNewLesson(sec, les);
                    if (result === false) {
                      isUpdateSuccess = false;
                      break;
                    }
                  } else {
                    // Update existed lesson
                    const result = await updateExistedLesson(sec.id, les);
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
      // if (isReorderedContent.isReorder) {
      //   // Reorder quizs
      //   if (
      //     isReorderedContent.sectionId !== '' &&
      //     isReorderedContent.lessonId !== ''
      //   ) {
      //   } else if (isReorderedContent.sectionId !== '') {
      //     // Reorder lessons
      //     const section = sections.find(
      //       (sec) => sec.id === isReorderedContent.sectionId
      //     );
      //     if (section) {
      //       const lessons = section.lessons;
      //       if (lessons && lessons.length > 0) {
      //         const lessonIds = lessons.map((les) => les.id);
      //         const data = {
      //           sectionId: section.id,
      //           lessonOrder: lessonIds,
      //         };
      //         const res = await reorderLessons(data);
      //         if ('statusCode' in res && res.statusCode === 200) {
      //           setIsReorderedContent((prev) => ({
      //             ...prev,
      //             isReorder: false,
      //             sectionId: '',
      //           }));
      //         }
      //       }
      //     }
      //   } else {
      //     // Reorder sections
      //     const sectionIds = sections.map((sec) => sec.id);
      //     const data = {
      //       courseId: courseId,
      //       sectionOrder: sectionIds,
      //     };
      //     const res = await reorderSections(data);
      //     if ('statusCode' in res && res.statusCode === 200) {
      //       setIsReorderedContent((prev) => ({ ...prev, isReorder: false }));
      //     }
      //   }
      // }

      if (isUpdateSuccess) {
        form.reset({ sections });
        loadingAnimation(false, dispatch);
        toast.success('Update Section(s) and lesson(s) successfully!');
      } else {
        loadingAnimation(false, dispatch);
        toast.error('Update failed!');
      }
    } catch (error) {
      console.error('Update error:', error);
      loadingAnimation(false, dispatch);
      toast.error('Update failed!');
    }
  };

  const handleSubmitForm = (data: CourseCreationType) => {
    // console.log(data);
    setLessonsData(data);
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    loadingAnimation(
      true,
      dispatch,
      'Creating section(s) and lesson(s). Please wait...'
    );

    let isCreateSuccess = false;
    if (lessonsData) {
      try {
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
      } catch (error) {
        console.error('Create error:', error);
      }
    }

    if (isCreateSuccess) {
      loadingAnimation(false, dispatch);
      setStep('success');
      setProgress?.(100); // Update progress to 100% on success
    } else {
      loadingAnimation(false, dispatch);
      toast.error('Create section(s) and lesson(s) failed!');
    }
  };

  if (step === 'success') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              Course Created Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your course has been submitted to admin for approval. You will
              receive a notification when the course is approved.
            </p>
            <Button
              onClick={() => (window.location.href = '/instructor/courses')}
            >
              Back to Course List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'review') {
    const formData = form.getValues();

    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Review Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Section {section.orderIndex + 1}: {section.title}
                </h3>

                {section.lessons.map((lesson) => (
                  <Card key={lesson.id} className="ml-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {lesson.type === 'VIDEO' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Lesson {lesson.orderIndex + 1}: {lesson.title}
                        </span>
                        <Badge
                          variant={
                            lesson.type === 'VIDEO' ? 'default' : 'secondary'
                          }
                        >
                          {lesson.type === 'VIDEO' ? 'VIDEO' : 'QUIZ'}
                        </Badge>
                      </div>

                      {lesson.quiz &&
                        lesson.quiz.questions &&
                        lesson.quiz.questions.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Quiz: {lesson.quiz.questions.length} questions
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-amber-400 text-base">
                Please review all information before submitting. After
                submitting, you must wait for the administrator to approve the
                course.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('create')}>
                Back to Edit
              </Button>
              <Button onClick={handleFinalSubmit}>
                Confirm and Submit for Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
                onClick={handleModeToggle}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              {/* Save changes button */}
              {isValidInputs &&
                (dirtyFields.sections || isReorderedContent.isReorder) && (
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
            </>
          )}

          {currentMode === 'view' && canEditContent && (
            <Button onClick={handleModeToggle} disabled={isLoading}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-6"
        >
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
                  const updatedSections = reorderedSections.map(
                    (section, index) => ({
                      ...section,
                      orderIndex: index,
                    })
                  );
                  form.setValue('sections', updatedSections);
                  setIsReorderedContent((prev) => ({
                    ...prev,
                    isReorder: true,
                  }));
                }}
                renderItem={renderSection}
                className="space-y-6"
              />
            )}

            {/* Add section button (edit mode only) */}
            {currentMode !== 'view' && (
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    addSection();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
                {mode === 'create' && (
                  <Button type="submit">Save and Review</Button>
                )}
              </div>
            )}
          </div>
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
    </div>
  );
}
