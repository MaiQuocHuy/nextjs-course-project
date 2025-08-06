'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type CourseFormData,
  getWordCount,
  getCharacterCount,
  fullCourseFormSchema,
} from '@/lib/instructor/create-course-validations/course-basic-info-validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  CheckCircle,
  X,
  BookOpen,
  DollarSign,
  FileText,
  ImageIcon,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCategoriesQuery } from '@/services/coursesApi';

interface CourseFormProps {
  onSubmit?: (data: CourseFormData) => void;
  className?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const accept = 'image/*,video/*';
const maxFiles = 1;
const maxSize = 10;
const tempTitle = 'Data Science with Python';
const tempDes =
  'Master data science concepts using Python. Learn pandas, numpy, matplotlib, seaborn, and machine learning fundamentals.';

export function CreateCourseBasicInfo({
  onSubmit,
  className,
}: CourseFormProps) {
  const { data: categories } = useGetCategoriesQuery();
  const [courseThumb, setCourseThumb] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(fullCourseFormSchema),
    defaultValues: {
      title: tempTitle,
      description: tempDes,
      price: 0,
      categoryIds: ['cat-007'],
      level: 'BEGINNER',
    },
    mode: 'onChange', // Enable real-time validation
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;

  const watchThumbnail = watch('file');

  // Clear thumbnail if file is invalid
  useEffect(() => {
    if (errors.file !== undefined) {
      setCourseThumb(null);
    }
  }, [errors.file]);

  // Set thumbnail only if file is valid
  useEffect(() => {
    // Only set thumbnail if file exists and is valid
    if (
      watchThumbnail &&
      watchThumbnail.size > 0 &&
      errors.file === undefined
    ) {
      const handleCourseThumb = async (file: File) => {
        const preview = await createFilePreview(file);
        const courseThumb: UploadedFile = {
          id: crypto.randomUUID(),
          file,
          preview,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          status: 'success',
        };
        setCourseThumb(courseThumb);
      };
      handleCourseThumb(watchThumbnail);
    } else {
      // Clear thumbnail if file is invalid or removed
      setCourseThumb(null);
    }
  }, [watchThumbnail, errors.file]);

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        // For videos, create a thumbnail
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          resolve(canvas.toDataURL());
        };
        video.src = URL.createObjectURL(file);
      }
    });
  };

  // Calculate form completion percentage
  const getFormCompletionPercentage = () => {
    const fields = [
      watch('title'),
      watch('price') >= 0,
      watch('categoryIds').length > 0,
      watch('description'),
      watchThumbnail,
    ];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleSubmit = (data: CourseFormData) => {
    // console.log('Course form data:', data);
    if (courseThumb) {
      const courseData = { ...data, file: courseThumb };
      onSubmit?.(courseData);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

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
    <div className={cn('space-y-6', className)}>
      {/* Form Progress */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Form Completion</span>
            <span className="text-sm text-muted-foreground">
              {getFormCompletionPercentage()}%
            </span>
          </div>
          <Progress value={getFormCompletionPercentage()} className="h-2" />
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-card">
            {/* Card header */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Information
              </CardTitle>
              <CardDescription>
                Provide basic information about your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Course Title <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter an engaging course title"
                          {...field}
                          className={cn(
                            errors.title && 'border-red-500',
                            !errors.title && field.value && 'border-green-500'
                          )}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{field.value.length}/100 characters</span>
                          {!errors.title && field.value && (
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
                name="description"
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
                            errors.description && 'border-red-500',
                            !errors.description &&
                              field.value &&
                              'border-green-500'
                          )}
                          {...field}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <div className="space-x-4">
                            <span>
                              {getCharacterCount(field.value)}/2000 characters
                            </span>
                            <span>
                              {getWordCount(field.value)} words (min: 10)
                            </span>
                          </div>
                          {!errors.description &&
                            field.value &&
                            getWordCount(field.value) >= 10 && (
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

              {/* Categories */}
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Categories <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value[0]}
                    >
                      <FormControl>
                        <div className="flex gap-x-4 gap-y-2 flex-wrap">
                          {categories && categories.length > 0 ? (
                            categories.map((cat) => (
                              <label
                                key={cat.id}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={cat.id}
                                  checked={field.value.includes(cat.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...field.value, cat.id]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (id: string) => id !== cat.id
                                        )
                                      );
                                    }
                                  }}
                                  className="accent-primary"
                                />
                                <span className="text-sm">{cat.name}</span>
                              </label>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No categories available
                            </span>
                          )}
                        </div>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Level */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Course Level <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            errors.level && 'border-red-500',
                            !errors.level && field.value && 'border-green-500',
                            'min-w-[150px]'
                          )}
                        >
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="flex items-center gap-2">
                      Price (USD) <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="999.99"
                          placeholder="0.00"
                          className={cn(
                            'pl-8',
                            errors.price && 'border-red-500',
                            !errors.price &&
                              field.value >= 0 &&
                              'border-green-500'
                          )}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription>
                        Set a competitive price for your course (free courses:
                        $0.00)
                      </FormDescription> */}
                  </FormItem>
                )}
              />

              {/* Course Image Upload */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Course Thumbnail{' '}
                      <strong className="text-red-500 font-medium">*</strong>
                    </FormLabel>
                    <FormControl>
                      <div>
                        {courseThumb === null ? (
                          <>
                            {/* Upload Area */}
                            <div
                              className={cn(
                                'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group',
                                'hover:border-primary/50 hover:bg-accent/20',
                                isDragOver
                                  ? 'border-primary bg-primary/5 scale-[1.02]'
                                  : 'border-border'
                              )}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files) {
                                  field.onChange(e.dataTransfer.files[0]);
                                  setIsDragOver(false);
                                }
                              }}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Input
                                type="file"
                                ref={fileInputRef}
                                accept={accept}
                                className="hidden"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.files && e.target.files[0]
                                  )
                                }
                              />

                              <div className="space-y-4">
                                <div
                                  className={cn(
                                    'mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300',
                                    isDragOver && 'bg-primary/20 scale-110'
                                  )}
                                >
                                  <Upload
                                    className={cn(
                                      'w-8 h-8 text-primary transition-all duration-300',
                                      isDragOver && 'scale-110'
                                    )}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold">
                                    {isDragOver
                                      ? 'Drop files here'
                                      : 'Upload media files'}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    Drag and drop your images or videos, or{' '}
                                    <span className="text-primary font-medium">
                                      browse files
                                    </span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Supports images and videos up to {maxSize}
                                    MB each
                                  </p>
                                </div>
                              </div>

                              {/* Animated overlay */}
                              <div
                                className={cn(
                                  'absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 transition-opacity duration-300',
                                  isDragOver && 'opacity-100'
                                )}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              Uploaded Files (1/{maxFiles})
                            </h4>

                            <div className="grid gap-3">
                              <div
                                key={courseThumb.id}
                                className={cn(
                                  'relative group bg-card border rounded-lg p-4 transition-all duration-300',
                                  'hover:shadow-card hover:border-primary/30',
                                  errors.file === undefined
                                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                                    : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                                )}
                              >
                                <div className="flex items-center space-x-4">
                                  {/* Preview */}
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={
                                        courseThumb.preview ||
                                        '/placeholder.svg'
                                      }
                                      alt={courseThumb.file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* File Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <ImageIcon className="w-4 h-4 text-blue-500" />
                                      <p className="font-medium truncate">
                                        {courseThumb.file.name}
                                      </p>
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>
                                        {formatFileSize(courseThumb.file.size)}
                                      </span>
                                    </div>

                                    {/* Error Message */}
                                    {/* {errors.file && (
                                        <div className="mt-2 flex items-center space-x-2">
                                          <AlertCircle className="w-4 h-4 text-red-500" />
                                          <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.file.message?.toString()}
                                          </p>
                                        </div>
                                      )} */}
                                  </div>

                                  {/* Status & Actions */}
                                  <div className="flex items-center space-x-2">
                                    {errors.file === undefined && (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}

                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        field.onChange(null);
                                        setCourseThumb(null);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Upload an attractive image that represents your course
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isValid === false}>
              Continue to Add Lessons
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
