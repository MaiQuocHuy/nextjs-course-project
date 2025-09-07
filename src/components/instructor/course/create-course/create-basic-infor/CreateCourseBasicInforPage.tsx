'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CourseBasicInfoType,
  imageFileSchema,
  fullCourseSchema,
} from '@/utils/instructor/course/create-course-validations/course-basic-info-validation';
import {
  getWordCount,
  getCharacterCount,
} from '@/utils/instructor/course/course-helper-functions';
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
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCategoriesQuery } from '@/services/coursesApi';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { toast } from 'sonner';
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseStatusMutation,
} from '@/services/instructor/courses/courses-api';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import WarningAlert from '@/components/instructor/commom/WarningAlert';
import { CourseDetail } from '@/types/instructor/courses';
import { createFileFromUrl, createFilePreview } from '@/utils/instructor/course/create-file';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseInfor?: CourseDetail;
  onCancel?: () => void;
  onSubmit?: (data: CourseBasicInfoType) => void;
}

interface Thumbnail {
  id: string;
  file: File;
  preview: string;
}

const accept = 'image/*,video/*';
const maxFiles = 1;
const maxSize = 10;

export function CreateCourseBasicInforPage({
  mode,
  courseInfor,
  onCancel,
  onSubmit,
}: CourseFormProps) {
  const { data: categories } = useGetCategoriesQuery();
  const [courseThumb, setCourseThumb] = useState<Thumbnail | null>(null);
  const [isCourseThumbUpdated, setIsCourseThumbUpdated] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseStatus, setCourseStatus] = useState<'published' | 'unpublished'>(
    'published'
  );

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [updateCourseStatus] = useUpdateCourseStatusMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const form = useForm<CourseBasicInfoType>({
    resolver: zodResolver(fullCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      categoryIds: [],
      level: 'BEGINNER',
      file: undefined,
    },
    mode: 'onChange', // Enable real-time validation
  });

  const {
    watch,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = form;
  // console.log(courseInfor);

  // Set up data for edit mode
  useEffect(() => {
    if (courseInfor) {
      const setUpData = async () => {
        const courseBasicInfo: CourseBasicInfoType = {
          title: courseInfor.title ? courseInfor.title : '',
          description: courseInfor.description ? courseInfor.description : '',
          price: courseInfor.price ? courseInfor.price : 0,
          categoryIds: [],
          level: courseInfor.level,
          file: undefined,
        };
        if (courseInfor.categories) {
          courseBasicInfo.categoryIds = courseInfor.categories.map(
            (cat) => cat.id
          );
        }
        if (courseInfor.thumbnailUrl) {
          courseBasicInfo.file = await createFileFromUrl(
            courseInfor.thumbnailUrl,
            courseInfor.title
          );
        }
        form.reset(courseBasicInfo);

        setCourseStatus(courseInfor.isPublished ? 'published' : 'unpublished');
      };
      setUpData();
    }
  }, [courseInfor]);

  const watchThumbnail = watch('file');

  // Set thumbnail only if file is valid
  useEffect(() => {
    const validateAndSetThumbnail = async () => {
      // Clear thumbnail first if there's no file
      if (!watchThumbnail || watchThumbnail.size === 0) {
        setCourseThumb(null);
        return;
      }

      try {
        // Validate the file using the schema directly
        await imageFileSchema.parseAsync({ file: watchThumbnail });

        // Only create preview if validation passes
        const preview = await createFilePreview(watchThumbnail);
        const courseThumb: Thumbnail = {
          id: crypto.randomUUID(),
          file: watchThumbnail,
          preview,
        };
        setCourseThumb(courseThumb);
      } catch (error) {
        // If validation fails, clear the thumbnail
        setCourseThumb(null);
      }
    };

    validateAndSetThumbnail();
  }, [watchThumbnail]);

  const getStatusReviewColor = (status: string) => {
    if (status) status = status.toLowerCase();
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-100 px-5 py-1 rounded-lg font-medium';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 px-5 py-1 rounded-lg font-medium';
      case 'denied':
        return 'text-red-700 bg-red-100 px-5 py-1 rounded-lg font-medium';
      case 'resubmitted':
        return 'text-purple-700 bg-purple-100 px-5 py-1 rounded-lg font-medium';
      default:
        // Draft
        return 'text-blue-700 bg-blue-100 px-5 py-1 rounded-lg font-medium';
    }
  };

  const handleSubmit = (data: CourseBasicInfoType) => {
    // console.log('Course form data:', data);
    if (mode === 'edit') {
      handleUpdateCourse(data);
    } else {
      handleCreateCourse(data);
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

  const handleCreateCourse = async (data: CourseBasicInfoType) => {
    loadingAnimation(true, dispatch, 'Creating course. Please wait...');
    try {
      const result = await createCourse(data).unwrap();
      if (result.statusCode === 201) {
        const courseData = {
          ...data,
          id: result.data.id,
        };
        loadingAnimation(false, dispatch);
        if (onSubmit) {
          onSubmit(courseData);
        }
      }
    } catch (error: any) {
      // console.error('Create course error:', error);
      loadingAnimation(false, dispatch);
      toast.error(error.message);
    }
  };

  const handleUpdateCourse = async (data: CourseBasicInfoType) => {
    // console.log(data);
    loadingAnimation(true, dispatch, 'Course is being updated. Please wait...');
    if (courseInfor) {
      const keys = Object.keys(dirtyFields) as (keyof CourseBasicInfoType)[];
      const updatedData: Partial<CourseBasicInfoType> = {
        id: courseInfor.id,
      };
      for (const key of keys) {
        updatedData[key] = data[key];
      }
      if (isCourseThumbUpdated) {
        updatedData.file = data.file;
      }

      try {
        const res = await updateCourse(updatedData).unwrap();
        if (res.statusCode === 200) {
          loadingAnimation(false, dispatch);
          form.reset(data);
          toast.success(res.message);
        }
      } catch (error: any) {
        // console.log(error);
        loadingAnimation(false, dispatch);
        toast.error(error.message);
      }
    } else {
      // Handle case where courseInfor is not available
      loadingAnimation(false, dispatch);
      toast.error('Course information is not available.');
    }
  };

  const handlePublishCourseToggle = async () => {
    loadingAnimation(true, dispatch, 'Updating course status. Please wait...');
    let isUpdateStatusSuccess = false;
    if (courseInfor && courseInfor.id) {
      try {
        const updateStatus =
          courseStatus === 'published' ? 'unpublished' : 'published';
        const res = await updateCourseStatus({
          courseId: courseInfor.id,
          status: updateStatus.toUpperCase(),
        }).unwrap();

        if (res && res.statusCode === 200) {
          isUpdateStatusSuccess = true;
        }
      } catch (error: any) {
        loadingAnimation(false, dispatch);
        toast.error(error.message);
      }
    }

    if (isUpdateStatusSuccess) {
      loadingAnimation(false, dispatch);
      toast.success('Course status updated successfully!');
      setCourseStatus((prev) => {
        if (prev === 'published') {
          return 'unpublished';
        } else {
          return 'published';
        }
      });
    } else {
      loadingAnimation(false, dispatch);
      toast.error('Course status update failed!');
    }
  };

  const handleDeleteCourse = async () => {
    loadingAnimation(true, dispatch, 'Deleting course. Please wait...');
    try {
      const res = await deleteCourse(courseInfor?.id).unwrap();
      if (res.statusCode === 200) {
        loadingAnimation(false, dispatch);
        toast.error('Delete course successfully!');
        router.push('/instructor/courses');
      }
    } catch (error) {
      loadingAnimation(false, dispatch);
      toast.error('Delete course failed!');
    }
  };

  return (
    <div className={cn('space-y-6')}>
      {/* Course actions */}
      {mode === 'edit' && courseInfor && (
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span
                    className={getStatusReviewColor(courseInfor.statusReview)}
                  >
                    {courseInfor.statusReview
                      ? courseInfor.statusReview
                      : 'Draft'}
                  </span>

                  {courseInfor.statusReview === null && (
                    <span className="text-sm text-muted-foreground">
                      Switch to publish mode to be able to submit for review
                    </span>
                  )}

                  {courseInfor.statusReview === 'DENIED' && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            View Denied Reason
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-red-600">
                              Course Rejection Reason
                            </DialogTitle>
                            <DialogDescription>
                              Your course was denied for the following reason:
                            </DialogDescription>
                          </DialogHeader>
                          <div className="border-l-4 border-red-400 bg-red-50 p-4 my-2 rounded-r">
                            <p className="text-red-700">
                              {courseInfor.reason ||
                                'No specific reason provided.'}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={courseStatus === 'published'}
                    onCheckedChange={handlePublishCourseToggle}
                  />
                  <span>
                    {courseStatus === 'published' ? 'Published' : 'Unpublished'}
                  </span>
                </div>

                {/* Delete course */}
                {courseInfor.id && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Display warning message and handle delete course if can */}
          <WarningAlert
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Are you sure you want to delete this course?"
            description="This action cannot be undone. This will permanently delete the
                  course and all its content."
            onClick={handleDeleteCourse}
            actionTitle="Delete Course"
          />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-card">
            {/* Card header */}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Information
                  </CardTitle>
                  <CardDescription>
                    Provide basic information about your course
                  </CardDescription>
                </div>
                {mode === 'edit' && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onCancel) {
                        onCancel();
                      }
                    }}
                    // disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
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
                              {getCharacterCount(field.value)}
                              /2000 characters
                            </span>
                            <span>
                              {getWordCount(field.value)} words (min: 20)
                            </span>
                          </div>
                          {!errors.description &&
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

              {/* Categories */}
              {categories && categories.length > 0 ? (
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
                        defaultValue={
                          field.value[0] ? field.value[0] : categories[0].id
                        }
                      >
                        <FormControl>
                          <div className="flex gap-x-4 gap-y-2 flex-wrap">
                            {categories.map((cat) => {
                              return (
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
                                        field.onChange([
                                          ...field.value,
                                          cat.id,
                                        ]);
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
                              );
                            })}
                          </div>
                        </FormControl>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <span className="text-muted-foreground text-sm">
                  No categories available
                </span>
              )}

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
                      defaultValue={field.value ? field.value : 'BEGINNER'}
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
                        {/* Upload Area */}
                        {courseThumb === null ? (
                          <>
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
                                onChange={(e) => {
                                  if (e.target.files) {
                                    field.onChange(e.target.files[0]);
                                  }
                                  if (mode === 'edit') {
                                    setIsCourseThumbUpdated(true);
                                  }
                                }}
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
                                      : 'Upload Image File'}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    Drag and drop your image file, or{' '}
                                    <span className="text-primary font-medium">
                                      browse file
                                    </span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Supports image up to {maxSize}
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
                                <div className="space-y-4">
                                  {/* File Info Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                      <ImageIcon className="w-4 h-4 text-blue-500" />
                                      <p className="font-medium truncate text-sm">
                                        {courseThumb.file.name}
                                      </p>
                                      <span className="text-sm text-muted-foreground">
                                        {formatFileSize(courseThumb.file.size)}
                                      </span>
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

                                  {/* Full Width Preview */}
                                  <div className="relative w-full rounded-lg overflow-hidden">
                                    {courseThumb.preview && (
                                      <img
                                        src={courseThumb.preview}
                                        alt={courseThumb.file.name}
                                        className="w-full h-auto object-cover max-h-80"
                                      />
                                    )}
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
            {mode === 'create' && (
              <Button type="submit" disabled={isValid === false}>
                Continue to Add Lessons
              </Button>
            )}

            {mode === 'edit' &&
              isValid &&
              (isDirty || isCourseThumbUpdated) && (
                <Button type="submit">Save changes</Button>
              )}
          </div>
        </form>
      </Form>
    </div>
  );
}
