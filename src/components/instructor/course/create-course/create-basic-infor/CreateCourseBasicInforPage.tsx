'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  type CourseBasicInfoType,
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
import { CourseDetail } from '@/types/instructor/courses/course-details';
import { createFileFromUrl } from '@/utils/instructor/course/create-file';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import ImageUpload from '../create-lessons/file-upload/ImageUpload';
import FileUploadErrorContainer from '../create-lessons/file-upload/upload-error/FileUploadErrorContainer';

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseInfo?: CourseDetail;
  onCancel?: () => void;
  onSubmit?: (data: CourseBasicInfoType) => void;
  onRefetchData?: () => void;
}

const maxSize = 10 * 1024 * 1024; // 10MB

export function CreateCourseBasicInforPage({
  mode,
  courseInfo,
  onCancel,
  onSubmit,
  onRefetchData,
}: CourseFormProps) {
  const [isCourseThumbUpdated, setIsCourseThumbUpdated] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseStatus, setCourseStatus] = useState<'published' | 'unpublished'>(
    'published'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [canSaveChanges, setCanSaveChanges] = useState(false);

  const { data: categories, refetch: refetchCategories } =
    useGetCategoriesQuery();

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [updateCourseStatus, { isLoading: isUpdatingStatus }] =
    useUpdateCourseStatusMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

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
    mode: 'onChange',
  });

  const {
    watch,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = form;

  // Set up data for edit mode
  useEffect(() => {
    if (courseInfo) {
      const setUpData = async () => {
        const courseBasicInfo: CourseBasicInfoType = {
          title: courseInfo.title ? courseInfo.title : '',
          description: courseInfo.description ? courseInfo.description : '',
          price: courseInfo.price ? courseInfo.price : 0,
          categoryIds: [],
          level: courseInfo.level,
          file: undefined,
        };
        if (courseInfo.categories) {
          courseBasicInfo.categoryIds = courseInfo.categories.map(
            (cat) => cat.id
          );
        }
        if (courseInfo.thumbnailUrl) {
          courseBasicInfo.file = await createFileFromUrl(
            courseInfo.thumbnailUrl,
            courseInfo.title
          );
        }
        form.reset(courseBasicInfo);

        setCourseStatus(courseInfo.isPublished ? 'published' : 'unpublished');
      };
      setUpData();
    }
  }, [courseInfo]);

  // Enable save changes button if form is valid and dirty
  useEffect(() => {
    const isCourseUpdated = isValid && (isDirty || isCourseThumbUpdated);
    setCanSaveChanges(isCourseUpdated);
  }, [isValid, isDirty, isCourseThumbUpdated]);

  // Enable loading state
  useEffect(() => {
    setIsLoading(isCreating || isUpdating || isDeleting || isUpdatingStatus);
  }, [isCreating, isUpdating, isDeleting, isUpdatingStatus]);

  const imageFile = watch('file');

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
    if (courseInfo && canSaveChanges) {
      const keys = Object.keys(dirtyFields) as (keyof CourseBasicInfoType)[];
      const updatedData: Partial<CourseBasicInfoType> = {
        id: courseInfo.id,
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
      // Handle case where courseInfo is not available
      loadingAnimation(false, dispatch);
      toast.error('Course information is not available.');
    }
  };

  const handlePublishCourseToggle = async () => {
    loadingAnimation(true, dispatch, 'Updating course status. Please wait...');
    let isUpdateStatusSuccess = false;
    if (courseInfo && courseInfo.id) {
      try {
        const updateStatus =
          courseStatus === 'published' ? 'unpublished' : 'published';
        const res = await updateCourseStatus({
          courseId: courseInfo.id,
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
      const res = await deleteCourse(courseInfo?.id).unwrap();
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

  const handleRefetchData = () => {
    refetchCategories();
    if (onRefetchData) {
      onRefetchData();
    }
  };

  return (
    <div className={cn('space-y-6')}>
      {/* Course actions */}
      {mode === 'edit' && courseInfo && (
        <div className="space-y-3">
          <Button variant="outline" onClick={handleRefetchData} disabled={isLoading}>
            Refetch
          </Button>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span
                    className={getStatusReviewColor(courseInfo.statusReview)}
                  >
                    {courseInfo.statusReview
                      ? courseInfo.statusReview
                      : 'Draft'}
                  </span>

                  {courseInfo.statusReview === null && (
                    <span className="text-sm text-muted-foreground">
                      Switch to publish mode to be able to submit for review
                    </span>
                  )}

                  {courseInfo.statusReview === 'DENIED' && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            disabled={isLoading}
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
                              {courseInfo.reason ||
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
                {courseInfo.id && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onCancel) {
                          onCancel();
                        }
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant={'default'}
                      disabled={!canSaveChanges || isLoading}
                    >
                      Save changes
                    </Button>
                  </div>
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
                              (min: 20 characters)
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
                    <FormControl>
                      <ImageUpload
                        imageFile={imageFile}
                        onImageChange={(file) => {
                          field.onChange(file);
                          if (mode === 'edit') {
                            setIsCourseThumbUpdated(true);
                          }
                        }}
                        maxSize={maxSize}
                        label="Course Thumbnail"
                        imageFileName={imageFile && imageFile.name}
                        required
                      />
                    </FormControl>
                    {errors.file && (
                      <FileUploadErrorContainer
                        error={errors.file.message?.toString()}
                      />
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            {mode === 'create' && (
              <Button type="submit" disabled={isValid === false || isLoading}>
                Continue to Add Lessons
              </Button>
            )}
          </div>
        </form>
      </Form>

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
  );
}
