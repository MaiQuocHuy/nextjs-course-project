'use client';

import { useEffect, useState } from 'react';
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
import {
  Plus,
  Trash2,
  BookOpen,
  Video,
  Brain,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { CourseSummary } from '@/components/instructor/course/create-course/create-lessons/course-summary';
import EnhancedFileUpload from '@/components/instructor/course/create-course/create-lessons/file-upload/enhanced-file-upload';
import { EnhancedQuizEditor } from '@/components/instructor/course/create-course/create-lessons/quiz/enhanced-quiz-editor';
import { DragDropReorder } from '@/components/instructor/course/create-course/create-lessons/drag-drop-reorder';
import {
  courseCreationSchema,
  type CourseCreationType,
  type QuizQuestionType,
  type LessonType,
  type SectionType,
} from '@/utils/instructor/create-course-validations/lessons-validations';
import {
  parseExcelFile,
  validateExcelFormat,
} from '@/utils/instructor/create-course-validations/excel-parser';
import { CombinedFileUpload } from './file-upload/combined-file-upload';
import {
  CourseBasicInfoType,
  getCharacterCount,
  getWordCount,
} from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateLessonMutation,
  useCreateSectionMutation,
} from '@/services/instructor/courses-api';
import {
  startLoading,
  stopLoading,
} from '@/store/slices/instructor/loadingAnimaSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

const tempTitle = 'Complete Web Development Bootcamp';
const tempDes =
  'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive web development course. Perfect for beginners who want to become full-stack developers.';

interface CreateLessonsPageProps {
  courseBasicInfo: CourseBasicInfoType;
  setProgress: (progress: number) => void;
}

export default function CreateLessonsPage({
  courseBasicInfo,
  setProgress,
}: CreateLessonsPageProps) {
  const form = useForm<CourseCreationType>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      sections: [
        {
          id: `section-${crypto.randomUUID()}`,
          title: tempTitle,
          description: tempDes,
          orderIndex: 0,
          isCollapsed: false,
          lessons: [
            {
              id: `lesson-${crypto.randomUUID()}`,
              title: 'Set up React Environment',
              orderIndex: 0,
              type: 'VIDEO',
              video: {},
              documents: [], // Multiple documents
              questions: [],
              isCollapsed: false,
            },
          ],
        },
        {
          id: `section-${crypto.randomUUID()}`,
          title: tempTitle + '2',
          description: tempDes + '2',
          orderIndex: 1,
          isCollapsed: false,
          lessons: [
            {
              id: `lesson-${crypto.randomUUID()}`,
              title: 'Set up React Environment 2',
              orderIndex: 0,
              type: 'VIDEO',
              documents: [], // Multiple documents
              questions: [],
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  });

  const {
    formState: { errors },
  } = form;

  const [createSection, { isLoading: isCreatingSection }] =
    useCreateSectionMutation();
  const [createLesson, { isLoading: isCreatingLesson }] =
    useCreateLessonMutation();

  const [step, setStep] = useState<'create' | 'review' | 'success'>('create');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [lessonsData, setLessonsData] = useState<CourseCreationType | null>(
    null
  );
  const dispatch: AppDispatch = useDispatch();

  // Handle loading state
  useEffect(() => {
    if (isCreatingSection || isCreatingLesson) {
      dispatch(startLoading('Creating section(s) and lesson(s)...'));
    } else {
      dispatch(stopLoading());
    }

    return () => {
      dispatch(stopLoading());
    };
  }, [isCreatingSection, isCreatingLesson, dispatch]);

  const handleRemoveSec = (sectionIndex: number) => {
    const currentSections = form.getValues('sections');
    // Remove specific section
    const updatedSections = currentSections.filter(
      (_, index) => index !== sectionIndex
    );
    // Reorder
    updatedSections.forEach((section, idx) => {
      section.orderIndex = idx;
    });
    form.setValue('sections', updatedSections);
  };

  const addSection = () => {
    const newSection: SectionType = {
      id: `section-${crypto.randomUUID()}`,
      description: '',
      title: '',
      orderIndex: form.watch('sections').length,
      isCollapsed: false,
      lessons: [
        {
          id: `lesson-${crypto.randomUUID()}`,
          title: '',
          orderIndex: 1,
          type: 'VIDEO',
          documents: [],
          questions: [],
          isCollapsed: false,
        },
      ],
    };
    const currentSections = form.getValues('sections');
    form.setValue('sections', [...currentSections, newSection]);
  };

  const addLesson = (sectionIndex: number) => {
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
    const newLesson: LessonType = {
      id: `lesson-${crypto.randomUUID()}`,
      title: '',
      orderIndex: currentLessons.length,
      type: 'VIDEO',
      documents: [],
      questions: [],
      isCollapsed: false,
    };

    form.setValue(`sections.${sectionIndex}.lessons`, [
      ...currentLessons,
      newLesson,
    ]);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
    if (currentLessons.length > 1) {
      const updatedLessons = currentLessons.filter(
        (_, index) => index !== lessonIndex
      );
      // Reorder remaining lessons
      updatedLessons.forEach((lesson, idx) => {
        lesson.orderIndex = idx;
      });
      form.setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
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
        order: 1,
      },
      {
        id: `q2-${Date.now()}`,
        question: 'Which hook is used to manage state in React?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation:
          'useState is the most basic hook for managing state in functional components.',
        order: 2,
      },
    ];

    form.setValue(
      `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
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

  const onSubmitData = (data: CourseCreationType) => {
    console.log('Form data:', data);
    setStep('review');
    setLessonsData(data);
  };

  const handleFinalSubmit = async () => {
    if (lessonsData) {
      let isCreatedSuccessfully = true;
      const courseId = courseBasicInfo ? courseBasicInfo.id : '';
      try {
        for (const section of lessonsData.sections) {
          // Create each section
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
              const sectionId = createSecRes.data.id;
              for (const lesson of section.lessons) {
                const lessonData = {
                  title: lesson.title,
                  type: lesson.type.toUpperCase(),
                  videoFile: lesson.video?.file,
                };
                const createLessRes = await createLesson({
                  sectionId,
                  lessonData,
                }).unwrap();
                if (
                  'statusCode' in createLessRes &&
                  createLessRes.statusCode !== 201
                ) {
                  isCreatedSuccessfully = false;
                  return;
                }
              }
            }
          } else {
            isCreatedSuccessfully = false;
            return;
          }
        }
      } catch (error) {
        isCreatedSuccessfully = false;
        console.error('Error creating sections and lessons:', error);
      }

      if (isCreatedSuccessfully) {
        setStep('success');
        setProgress(100); // Update progress to 100% on success
      }
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
        {courseBasicInfo && <CourseSummary course={courseBasicInfo} />}

        <Card>
          <CardHeader>
            <CardTitle>Review Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.sections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Section {section.orderIndex + 1}: {section.title}
                </h3>

                {section.lessons.map((lesson, lessonIndex) => (
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

                      {lesson.documents && lesson.documents.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Documents: {lesson.documents.length} files
                        </div>
                      )}

                      {lesson.questions && lesson.questions.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Quiz: {lesson.questions.length} questions
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
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
                {isCreatingSection || isCreatingLesson
                  ? 'Creating sections and lessons...'
                  : 'Confirm and Submit for Approval'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderSection = (section: SectionType, sectionIndex: number) => (
    <Collapsible key={section.id} defaultOpen={!section.isCollapsed}>
      <Card>
        <CollapsibleTrigger asChild>
          {/* Section title and order */}
          <CardHeader className="cursor-pointer hover:bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 transition-transform data-[state=open]:rotate-90" />
                <BookOpen className="h-5 w-5" />
                <span>Section {section.orderIndex + 1}</span>

                {section.title && (
                  <span className="text-base font-normal text-muted-foreground">
                    - {section.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {form.watch('sections').length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSec(sectionIndex)}
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
            {/* Enter section Title */}
            <FormField
              control={form.control}
              name={`sections.${sectionIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Course Title <strong className="text-red-500">*</strong>
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
                    Create a clear, descriptive title that tells students what
                    they'll learn
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name={`sections.${sectionIndex}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description (Optional)</FormLabel>
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
                            {field.value ? getCharacterCount(field.value) : 0}
                            /255 characters
                          </span>
                          {/* <span>
                            {getWordCount(field.value)} words (min: 10)
                          </span> */}
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
                    Write a compelling description that explains the value and
                    outcomes of your course
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Lessons */}
            <div className="space-y-4">
              <h4 className="font-medium">Lessons</h4>

              <DragDropReorder
                items={form.watch(`sections.${sectionIndex}.lessons`)} // Pass full lesson objects
                onReorder={(reorderedLessons) => {
                  // Update the order property and reorder
                  const updatedLessons = reorderedLessons.map(
                    (lesson, index) => ({
                      ...lesson,
                      order: index,
                    })
                  );
                  form.setValue(
                    `sections.${sectionIndex}.lessons`,
                    updatedLessons
                  );
                }}
                renderItem={(lesson, lessonIndex) =>
                  renderLesson(sectionIndex, lesson, lessonIndex)
                }
                className="space-y-4"
              />

              {/* Add lesson button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => addLesson(sectionIndex)}
                className="ml-16"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  const renderLesson = (
    sectionIndex: number,
    lesson: LessonType,
    lessonIndex: number
  ) => {
    return (
      <Collapsible key={lesson.id} defaultOpen={!lesson.isCollapsed}>
        <Card className="ml-4">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50">
              {/* Lesson title */}
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
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
                    {lesson.type === 'VIDEO' ? 'Video' : 'QUIZ'}
                  </Badge>
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {form.watch(`sections.${sectionIndex}.lessons`).length >
                    1 && (
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
            <CardContent className="space-y-7">
              {/* Lesson title input */}
              <FormField
                control={form.control}
                name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title..." {...field} />
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

              {/* Lesosn type */}
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
                  <CombinedFileUpload
                    videoFile={
                      form.watch(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.video`
                      )?.file
                    }
                    onVideoSelect={(file) => {
                      form.setValue(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.video`,
                        { file }
                      );
                    }}
                    onVideoRemove={() => {
                      form.setValue(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.video`,
                        undefined
                      );
                    }}
                  />
                </div>
              )}

              {/* Quiz section */}
              {form.watch(
                `sections.${sectionIndex}.lessons.${lessonIndex}.type`
              ) === 'QUIZ' && (
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
                            You need to upload related documents for AI to
                            generate questions.
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
                          <strong>Excel File Format Instructions:</strong>
                          <br />
                          Your Excel file should have the following columns:
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
                          handleExcelUpload(file, sectionIndex, lessonIndex)
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

                  {/* List of generated questions */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.questions`
                  ).length > 0 && (
                    <EnhancedQuizEditor
                      canEdit={true}
                      questions={form.watch(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.questions`
                      )}
                      onQuestionsChange={(questions) => {
                        form.setValue(
                          `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
                          questions
                        );
                      }}
                    />
                  )}

                  {/* Warning alert */}
                  {form.watch(
                    `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                  ) === 'QUIZ' &&
                    form.watch(
                      `sections.${sectionIndex}.lessons.${lessonIndex}.questions`
                    ).length === 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Quiz lessons must have at least one question.
                        </AlertDescription>
                      </Alert>
                    )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {courseBasicInfo && <CourseSummary course={courseBasicInfo} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitData)} className="space-y-6">
          <DragDropReorder
            items={form.watch('sections')}
            onReorder={(reorderedSections) => {
              // Update the order property and reorder
              const updatedSections = reorderedSections.map(
                (section, index) => ({
                  ...section,
                  order: index,
                })
              );
              form.setValue('sections', updatedSections);
            }}
            renderItem={renderSection}
            className="space-y-6"
          />

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>

            <Button type="submit">Save and Review</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
