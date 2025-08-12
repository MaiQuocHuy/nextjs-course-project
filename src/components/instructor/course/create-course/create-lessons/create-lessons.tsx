'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  BookOpen,
  Video,
  Brain,
  Upload,
  CheckCircle,
  AlertCircle,
  LayoutTemplateIcon as Template,
  X,
} from 'lucide-react';
import { CourseSummary } from '@/components/instructor/course/create-course/create-lessons/course-summary';
import { EnhancedFileUpload } from '@/components/instructor/course/create-course/create-lessons/file-upload/enhanced-file-upload';
import { QuizEditor } from '@/components/instructor/course/create-course/create-lessons/quiz/quiz-editor';
import { QuizTemplates } from '@/components/instructor/course/create-course/create-lessons/quiz/quiz-templates';
import {
  courseCreationSchema,
  type CourseCreationType,
  type QuizQuestionType,
  type LessonType,
} from '@/lib/instructor/create-course-validations/lessons-validations';

// Mock course data
const mockCourse = {
  title: 'React Programming: From Basics to Advanced',
  description:
    'A comprehensive course on React, covering everything from basic concepts to advanced techniques like hooks, context, and performance optimization.',
  category: 'Programming',
  level: 'Intermediate',
  price: 199,
  thumbnail: '/placeholder.svg?height=200&width=300&text=React+Course',
};

export default function CreateLessonsPage() {
  const [step, setStep] = useState<'create' | 'review' | 'success'>('create');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [showTemplates, setShowTemplates] = useState<{
    sectionIndex: number;
    lessonIndex: number;
  } | null>(null);

  const form = useForm<CourseCreationType>({
    resolver: zodResolver(courseCreationSchema),
    defaultValues: {
      sections: [
        {
          title: '',
          order: 1,
          lessons: [
            {
              title: '',
              order: 1,
              type: 'video',
              documents: [],
              questions: [],
            },
          ],
        },
      ],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  const addSection = () => {
    appendSection({
      title: '',
      order: sectionFields.length + 1,
      lessons: [
        {
          title: '',
          order: 1,
          type: 'video',
          documents: [],
          questions: [],
        },
      ],
    });
  };

  const addLesson = (sectionIndex: number) => {
    const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`);
    const newLesson: LessonType = {
      title: '',
      order: currentLessons.length + 1,
      type: 'video',
      documents: [],
      questions: [],
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
      form.setValue(`sections.${sectionIndex}.lessons`, updatedLessons);
    }
  };

  const generateQuizWithAI = async (
    sectionIndex: number,
    lessonIndex: number
  ) => {
    setIsGeneratingQuiz(true);

    // Simulate AI quiz generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockQuestions: QuizQuestionType[] = [
      {
        id: `q1-${Date.now()}`,
        question: 'What is React?',
        options: ['JavaScript Library', 'CSS Framework', 'Database', 'Server'],
        correctAnswer: 0,
        explanation:
          'React is a JavaScript library for building user interfaces.',
      },
      {
        id: `q2-${Date.now()}`,
        question: 'Which hook is used to manage state in React?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation:
          'useState is the most basic hook for managing state in functional components.',
      },
    ];

    form.setValue(
      `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
      mockQuestions
    );
    setIsGeneratingQuiz(false);
  };

  const handleTemplateSelect = (
    sectionIndex: number,
    lessonIndex: number,
    questions: QuizQuestionType[]
  ) => {
    form.setValue(
      `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
      questions
    );
    setShowTemplates(null);
  };

  const onSubmit = (data: CourseCreationType) => {
    console.log('Form data:', data);
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep('success');
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
        <CourseSummary course={mockCourse} />

        <Card>
          <CardHeader>
            <CardTitle>Review Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Section {section.order}: {section.title}
                </h3>

                {section.lessons.map((lesson, lessonIndex) => (
                  <Card key={lessonIndex} className="ml-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {lesson.type === 'video' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Lesson {lesson.order}: {lesson.title}
                        </span>
                        <Badge
                          variant={
                            lesson.type === 'video' ? 'default' : 'secondary'
                          }
                        >
                          {lesson.type === 'video' ? 'Video' : 'Quiz'}
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
                submission, you won't be able to edit until admin approval.
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
    <div className="container mx-auto py-8">
      <CourseSummary course={mockCourse} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {sectionFields.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Section {sectionIndex + 1}</span>
                  </div>
                  {sectionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section Title */}
                <FormField
                  control={form.control}
                  name={`sections.${sectionIndex}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="font-medium">Lessons</h4>

                  {form
                    .watch(`sections.${sectionIndex}.lessons`)
                    ?.map((lesson, lessonIndex) => (
                      <Card key={lessonIndex}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>Lesson {lessonIndex + 1}</span>
                            {form.watch(`sections.${sectionIndex}.lessons`)
                              .length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeLesson(sectionIndex, lessonIndex)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {/* Lesson Title */}
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

                          {/* Related Documents */}
                          <div>
                            <Label>Related Documents (optional)</Label>
                            <EnhancedFileUpload
                              accept={{
                                'application/pdf': ['.pdf'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                  ['.docx'],
                              }}
                              maxSize={10 * 1024 * 1024}
                              onFileSelect={(file) => {
                                const currentDocs =
                                  form.getValues(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                  ) || [];
                                form.setValue(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.documents`,
                                  [
                                    ...currentDocs,
                                    { file, status: 'publish' as const },
                                  ]
                                );
                              }}
                              onFileRemove={() => {
                                form.setValue(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.documents`,
                                  []
                                );
                              }}
                              selectedFile={
                                form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                )?.[0]?.file
                              }
                              label="Upload Documents (PDF, DOCX)"
                              type="document"
                            />

                            {form.watch(
                              `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                            )?.length > 0 && (
                              <div className="mt-2">
                                <Label>Document Visibility</Label>
                                <Select
                                  value={
                                    form.watch(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                    )?.[0]?.status || 'publish'
                                  }
                                  onValueChange={(
                                    value: 'publish' | 'unpublish'
                                  ) => {
                                    const currentDocs = form.getValues(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.documents`
                                    );
                                    if (currentDocs && currentDocs.length > 0) {
                                      const updatedDocs = currentDocs.map(
                                        (doc) => ({ ...doc, status: value })
                                      );
                                      form.setValue(
                                        `sections.${sectionIndex}.lessons.${lessonIndex}.documents`,
                                        updatedDocs
                                      );
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="publish">
                                      Publish - Visible to students
                                    </SelectItem>
                                    <SelectItem value="unpublish">
                                      Unpublish - AI use only
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          {/* Lesson Type */}
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
                                        value="video"
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
                                        value="quiz"
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
                          ) === 'video' && (
                            <EnhancedFileUpload
                              accept={{
                                'video/mp4': ['.mp4'],
                                'video/webm': ['.webm'],
                                'video/ogg': ['.ogg'],
                              }}
                              maxSize={500 * 1024 * 1024}
                              onFileSelect={(file) => {
                                form.setValue(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.video`,
                                  { file }
                                );
                              }}
                              onFileRemove={() => {
                                form.setValue(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.video`,
                                  undefined
                                );
                              }}
                              selectedFile={
                                form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.video`
                                )?.file
                              }
                              label="Upload Lesson Video"
                              type="video"
                            />
                          )}

                          {/* Quiz Creation */}
                          {form.watch(
                            `sections.${sectionIndex}.lessons.${lessonIndex}.type`
                          ) === 'quiz' && (
                            <div className="space-y-4">
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
                                            value="template"
                                            id={`template-${sectionIndex}-${lessonIndex}`}
                                          />
                                          <Label
                                            htmlFor={`template-${sectionIndex}-${lessonIndex}`}
                                          >
                                            <Template className="h-4 w-4 inline mr-2" />
                                            Use Template
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
                                            Upload File
                                          </Label>
                                        </div>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Quiz Creation with AI */}
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
                                        You need to upload related documents for
                                        AI to generate questions.
                                      </AlertDescription>
                                    </Alert>
                                  )}

                                  <Button
                                    type="button"
                                    onClick={() =>
                                      generateQuizWithAI(
                                        sectionIndex,
                                        lessonIndex
                                      )
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

                              {/* Quiz Creation with template */}
                              {form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.quizType`
                              ) === 'template' && (
                                <div className="space-y-4">
                                  {!showTemplates ||
                                  showTemplates.sectionIndex !== sectionIndex ||
                                  showTemplates.lessonIndex !== lessonIndex ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        setShowTemplates({
                                          sectionIndex,
                                          lessonIndex,
                                        })
                                      }
                                    >
                                      <Template className="h-4 w-4 mr-2" />
                                      Browse Templates
                                    </Button>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium">
                                          Choose a Quiz Template
                                        </h4>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setShowTemplates(null)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <QuizTemplates
                                        onTemplateSelect={(questions) =>
                                          handleTemplateSelect(
                                            sectionIndex,
                                            lessonIndex,
                                            questions
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Quiz Creation with file upload */}
                              {form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.quizType`
                              ) === 'upload' && (
                                <EnhancedFileUpload
                                  accept={{
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                      ['.xlsx'],
                                    'application/vnd.ms-excel': ['.xls'],
                                  }}
                                  maxSize={5 * 1024 * 1024}
                                  onFileSelect={(file) => {
                                    form.setValue(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`,
                                      file
                                    );
                                  }}
                                  onFileRemove={() => {
                                    form.setValue(
                                      `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`,
                                      undefined
                                    );
                                  }}
                                  selectedFile={form.watch(
                                    `sections.${sectionIndex}.lessons.${lessonIndex}.quizFile`
                                  )}
                                  label="Upload Quiz File (Excel)"
                                  type="document"
                                />
                              )}

                              {form.watch(
                                `sections.${sectionIndex}.lessons.${lessonIndex}.questions`
                              ) &&
                                form.watch(
                                  `sections.${sectionIndex}.lessons.${lessonIndex}.questions`
                                ).length > 0 && (
                                  <QuizEditor
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
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addLesson(sectionIndex)}
                    className="ml-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

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
