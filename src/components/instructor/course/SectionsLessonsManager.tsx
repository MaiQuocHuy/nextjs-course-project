'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/instructor/course/course-detail/Collapsible';
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
import { DragDropReorder } from '../course/create-course/create-lessons/drag-drop-reorder';
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
  useCreateLessonMutation,
  useCreateSectionMutation,
  useDeleteLessonMutation,
  useDeleteSectionMutation,
  useReorderLessonsMutation,
  useReorderSectionsMutation,
  useUpdateLessonMutation,
  useUpdateSectionMutation,
} from '@/services/instructor/courses-api';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

// Types
interface StudentComment {
  id: string;
  studentName: string;
  studentAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
  replies?: StudentComment[];
}

export interface LessonWithComments extends LessonType {
  comments?: StudentComment[];
  completionRate?: number;
  avgRating?: number;
  totalViews?: number;
}

export interface SectionWithComments extends Omit<SectionType, 'lessons'> {
  lessons: LessonWithComments[];
  totalStudents?: number;
  completionRate?: number;
}

interface SectionsLessonsManagerProps {
  courseId: string;
  mode: 'view' | 'edit' | 'create';
  sections: SectionWithComments[];
  onSectionsChange?: (sections: SectionWithComments[]) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  canEditContent: boolean;
}

export default function SectionsLessonsManager({
  courseId,
  mode,
  sections: initialSections,
  onSectionsChange,
  onCancel,
  isLoading = false,
  canEditContent,
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
  // const [expandedComments, setExpandedComments] = useState<Set<string>>(
  //   new Set()
  // );
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [isValidInputs, setIsValidInput] = useState(true);
  const [isReorderedContent, setIsReorderedContent] = useState({
    isReorder: false,
    sectionId: '',
    lessonId: '',
  });
  const dispatch: AppDispatch = useDispatch();
  const [updatedSections] = useUpdateSectionMutation();
  const [createSection] = useCreateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [reorderSections] = useReorderSectionsMutation();

  const [updatedLessons] = useUpdateLessonMutation();
  const [createLesson] = useCreateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [reorderLessons] = useReorderLessonsMutation();

  const form = useForm<CourseCreationType>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      sections: initialSections,
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
      console.log('Validation Errors:', validationResult.error.issues);
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

  // const toggleComments = (lessonId: string) => {
  //   const newExpanded = new Set(expandedComments);
  //   if (newExpanded.has(lessonId)) {
  //     newExpanded.delete(lessonId);
  //   } else {
  //     newExpanded.add(lessonId);
  //   }
  //   setExpandedComments(newExpanded);
  // };

  // CRUD operations

  const addSection = () => {
    const newSection: SectionWithComments = {
      id: `new-section-${crypto.randomUUID()}`,
      description: '',
      title: '',
      orderIndex: watchedSections.length,
      isCollapsed: false,
      lessons: [
        {
          id: '',
          title: '',
          orderIndex: 0,
          type: 'VIDEO',
          documents: [],
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
    try {
      loadingAnimation(true, dispatch, 'Deleting section. Please wait...');
      const currentSections = form.getValues('sections');

      // Check if the deleted section is existed or not.
      // If no then just delete section in client side.
      // else perform delete both client and server side.
      const deletedSection = currentSections[sectionIndex];
      if (deletedSection && !deletedSection.id.includes('new-section')) {
        const data = {
          courseId,
          sectionId: deletedSection.id,
        };
        await deleteSection(data);
      }

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
    } catch (error) {
      console.log(error);
      loadingAnimation(false, dispatch);
      toast.error('Delete section failed!');
      return;
    }
  };

  const addLesson = (sectionIndex: number) => {
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
    const newLesson: LessonWithComments = {
      id: `new-lesson-${crypto.randomUUID()}`,
      title: '',
      orderIndex: currentLessons.length,
      type: 'VIDEO',
      documents: [],
      isCollapsed: false,
    };

    form.setValue(`sections.${sectionIndex}.lessons`, [
      ...currentLessons,
      newLesson,
    ]);
  };

  const removeLesson = async (sectionIndex: number, lessonIndex: number) => {
    try {
      loadingAnimation(true, dispatch, 'Deleting lesson. Please wait...');
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
            await deleteLesson(data).unwrap();
          }
        }

        // Reorder index of lesson
        const updatedLessons = currentLessons.filter(
          (_, index) => index !== lessonIndex
        );
        updatedLessons.forEach((lesson, idx) => {
          lesson.orderIndex = idx;
        });
        form.setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
      }
      const currentFormData = form.getValues();
      form.reset(currentFormData);
      loadingAnimation(false, dispatch);
      toast.success('Delete lesson successfully!');
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
    setIsGeneratingQuiz(true);

    // Simulate AI quiz generation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockQuestions: QuizQuestionType[] = [
      {
        id: `q1-${Date.now()}`,
        question: 'What is React?',
        options: ['JavaScript Library', 'CSS Framework', 'Database', 'Server'],
        correctAnswer: 0,
        explanation:
          'React is a JavaScript library for building user interfaces.',
        order: 0,
      },
      {
        id: `q2-${Date.now()}`,
        question: 'Which hook is used to manage state in React?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation:
          'useState is the most basic hook for managing state in functional components.',
        order: 1,
      },
    ];

    form.setValue(
      `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
      mockQuestions
    );

    setIsGeneratingQuiz(false);
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
        `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
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

  // Change to edit mode
  const handleModeToggle = () => {
    if (currentMode === 'edit') {
      onCancel?.();
    }
    setCurrentMode(currentMode === 'view' ? 'edit' : 'view');
  };

  const createNewLesson = async (section: SectionType, lesson: LessonType) => {
    try {
      const lessonData = {
        title: lesson.title,
        type: lesson.type.toUpperCase(),
        videoFile: lesson.video?.file,
      };
      const createLesRes = await createLesson({
        sectionId: section.id,
        lessonData,
      }).unwrap();

      // Assign id to lesson
      if ('statusCode' in createLesRes && createLesRes.statusCode === 201) {
        // console.log(createLesRes);
        if (currentMode === 'edit') {
          if (section.orderIndex) {
            const lessonId = createLesRes.data.id;
            const lessonIndex = createLesRes.data.orderIndex;
            form.setValue(
              `sections.${section.orderIndex}.lessons.${lessonIndex}.id`,
              lessonId
            );
            form.setValue(
              `sections.${section.orderIndex}.lessons.${lessonIndex}.orderIndex`,
              lessonIndex
            );
          }
        }
      }
    } catch (error) {
      loadingAnimation(false, dispatch);
      toast.error('Error!');
      return;
    }
  };

  const createNewSection = async (section: SectionType) => {
    try {
      const sectionData = {
        title: section.title,
        description: section.description,
      };
      const createSecRes = await createSection({
        courseId,
        sectionData,
      }).unwrap();
      // Create each lesson in the section
      if ('statusCode' in createSecRes && createSecRes.statusCode === 201) {
        if ('data' in createSecRes) {
          // console.log(createSecRes);
          // Assign id to section. Cause in edit mode, id of a new created section is ''
          if (currentMode === 'edit') {
            const sectionId = createSecRes.data.id;
            const secIndex = createSecRes.data.orderIndex;
            if (secIndex) {
              form.setValue(`sections.${secIndex}.id`, sectionId);
              form.setValue(`sections.${secIndex}.orderIndex`, secIndex);
            }
          }

          // // Create lessons if have
          // const sectionData = { ...section };
          // sectionData.id = sectionId;
          // if (secIndex) {
          //   sectionData.orderIndex = secIndex;
          //   // await createNewLesson(sectionData);
          // }
          // for (const lesson of section.lessons) {
          //   await createNewLesson(sectionData, lesson);
          // }
        }
      }
    } catch (error) {
      loadingAnimation(false, dispatch);
      toast.error('Error!');
      return;
    }
  };

  const handleSave = async () => {
    // console.log(formData);
    const sections = form.watch('sections');
    try {
      loadingAnimation(
        true,
        dispatch,
        'Section(s) and lesson(s) is being updated'
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
              await createNewSection(sec);
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
              await updatedSections(data).unwrap();
            }
          }

          // Update lesson's fields if have
          const changedLessons = dirtyFields.sections[idx]?.lessons;          
          if (changedLessons) {
            for (const [lessonIdx, les] of sec.lessons.entries()) {
              if (changedLessons[lessonIdx]) {
                if (sec.id) {
                  // Create new lesson                  
                  if (les.id.includes('new-lesson')) {
                    await createNewLesson(sec, les);
                  } else {
                    // Update existed lessons
                    const lessonData = {
                      sectionId: sec.id,
                      lessonId: les.id,
                      title: les.title,
                      type: les.type,
                      videoFile: les.video?.file,
                    };
                    await updatedLessons(lessonData);
                  }
                }
              }
            }
          }
        }
      }

      // Handle Reorder sections and lessons if have
      if (isReorderedContent.isReorder) {
        // Reorder quizs
        if (
          isReorderedContent.sectionId !== '' &&
          isReorderedContent.lessonId !== ''
        ) {
        } else if (isReorderedContent.sectionId !== '') {
          // Reorder lessons
          const section = sections.find(
            (sec) => sec.id === isReorderedContent.sectionId
          );
          if (section) {
            const lessons = section.lessons;
            console.log('lessons: ', lessons);
            
            if (lessons && lessons.length > 0) {
              const lessonIds = lessons.map((les) => les.id);
              const data = {
                sectionId: section.id,
                lessonOrder: lessonIds,
              };
              const res = await reorderLessons(data);
              if ('statusCode' in res && res.statusCode === 200) {
                setIsReorderedContent((prev) => ({
                  ...prev,
                  isReorder: false,
                  sectionId: '',
                }));
              }
            }
          }
        } else {
          // Reorder sections
          const sectionIds = sections.map((sec) => sec.id);
          const data = {
            courseId,
            sectionOrder: sectionIds,
          };
          const res = await reorderSections(data);
          if ('statusCode' in res && res.statusCode === 200) {
            setIsReorderedContent((prev) => ({ ...prev, isReorder: false }));
          }
        }
      }
    } catch (error) {
      // console.error('Update error:', error);
      loadingAnimation(false, dispatch);
      toast.error('Update failed!');
      return;
    }

    form.reset({sections});
    loadingAnimation(false, dispatch);
    toast.success('Update Section(s) and lesson(s) successfully!');
  };

  const renderLesson = (
    sectionIndex: number,
    lesson: LessonWithComments,
    lessonIndex: number
  ) => {
    const isExpanded = expandedLessons.has(lesson.id);

    return (
      <Collapsible key={lesson.id} defaultOpen={lessonIndex === 0}>
        <Card key={lesson.id} className="ml-4 gap-2">
          <CollapsibleTrigger>
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
                        onClick={() => removeLesson(sectionIndex, lessonIndex)}
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
                  {/* Lesson title in view mode */}
                  {/* {lesson.title && (
                    <div>
                      <h4 className="font-medium mb-2">{lesson.title}</h4>
                    </div>
                  )} */}

                  {/* Documents list in view mode */}
                  {lesson.documents && lesson.documents.length > 0 && (
                    <CombinedFileUpload documents={lesson.documents} />
                  )}

                  {/* Lesson video */}
                  {lesson.video && lesson.video?.file && (
                    <CombinedFileUpload videoFile={lesson.video?.file} />
                  )}

                  {/* Quiz questions preview in view mode */}
                  {lesson.questions && lesson.questions.length > 0 && (
                    <EnhancedQuizEditor
                      canEdit={false}
                      questions={lesson.questions}
                      onQuestionsChange={(questions) => {
                        form.setValue(
                          `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
                          questions
                        );
                      }}
                    />
                  )}

                  {/* Lesson statistics */}
                  {/* {renderLessonStats(lesson)} */}

                  {/* Student comments */}
                  {/* {renderStudentComments(lesson)} */}
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

                  {/* Multiple Documents Upload */}
                  <CombinedFileUpload
                    documents={
                      form.watch(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                      ) || []
                    }
                    onDocumentsChange={(documents) => {
                      form.setValue(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.documents`,
                        documents
                      );
                    }}
                  />

                  {/* Lesson type input */}
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

                  {/* Video upload */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                  ) === 'VIDEO' && (
                    <div>
                      <FormField
                        control={form.control}
                        name={`sections.${sectionIndex}.lessons.${lessonIndex}.video`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CombinedFileUpload
                                videoFile={form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.video.file`
                                )}
                                onVideoSelect={(file) => {
                                  field.onChange(() => {
                                    form.setValue(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.video.file`,
                                      file
                                    );
                                  });
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
                    </div>
                  )}

                  {/* Quiz section */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                  ) === 'QUIZ' && (
                    <div>
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
                            <div className="space-y-4">
                              {(!form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                              ) ||
                                form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                )?.length === 0) && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    You need to upload related documents for AI
                                    to generate questions.
                                  </AlertDescription>
                                </Alert>
                              )}

                              <Button
                                type="button"
                                onClick={() =>
                                  generateQuizWithAI(sectionIndex, lessonIndex)
                                }
                                disabled={
                                  isGeneratingQuiz ||
                                  !form.watch(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                  )?.length
                                }
                              >
                                {isGeneratingQuiz
                                  ? 'Generating Questions...'
                                  : 'Generate Questions with AI'}
                              </Button>
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
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
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

                          {/* Warning alert */}
                          {/* {form.watch(
                            `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                          ) === 'QUIZ' &&
                            form.watch(
                              `sections.${sectionIndex}.lessons.${lessonIndex}.quiz`
                            ) === null && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Quiz lessons must have at least one question.
                                </AlertDescription>
                              </Alert>
                            )} */}
                        </div>
                      )}

                      {/* List of generated questions */}
                      {form.watch(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.quiz`
                      ) &&
                        form.watch(
                          `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`
                        ).length > 0 && (
                          <EnhancedQuizEditor
                            canEdit={true}
                            questions={form.watch(
                              `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`
                            )}
                            onQuestionsChange={(questions) => {
                              form.setValue(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.quiz.questions`,
                                questions
                              );
                            }}
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

  // Render section
  const renderSection = (
    section: SectionWithComments,
    sectionIndex: number
  ) => {
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
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentMode === 'edit' && watchedSections.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
                {currentMode === 'edit' ? (
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
                      renderItem={(lesson, lessonIndex) =>
                        renderLesson(sectionIndex, lesson, lessonIndex)
                      }
                      className="space-y-4"
                    />

                    {/* Add new lesson button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(sectionIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.lessons.map((lesson, lessonIndex) =>
                      renderLesson(sectionIndex, lesson, lessonIndex)
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {currentMode === 'view' ? 'Course Content' : 'Edit Course Content'}
          </h2>
          <p className="text-muted-foreground">
            {currentMode === 'view'
              ? 'View your course sections and lessons with student engagement data'
              : 'Manage your course sections and lessons'}
          </p>
        </div>
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
        <div className="space-y-6">
          {currentMode === 'edit' ? (
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
                setIsReorderedContent((prev) => ({ ...prev, isReorder: true }));
              }}
              renderItem={renderSection}
              className="space-y-6"
            />
          ) : (
            <div className="space-y-6">
              {watchedSections.map((section, index) =>
                renderSection(section, index)
              )}
            </div>
          )}

          {/* Add section button (edit mode only) */}
          {currentMode === 'edit' && (
            <Button type="button" variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
