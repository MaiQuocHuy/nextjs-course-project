'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

import type { CourseBasicInfoType } from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { CreateCourseBasicInforPage } from '@/components/instructor/course/create-course/create-basic-infor/CreateCourseBasicInforPage';
import { useRouter } from 'next/navigation';
import CreateLessonsPage2 from '@/components/instructor/course/create-course/create-lessons/create-lessons2';
import { useCreateCourseMutation } from '@/services/instructor/courses-api';
import {
  startLoading,
  stopLoading,
} from '@/store/slices/instructor/loadingAnimaSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseBasicInfo, setCourseBasicInfo] =
    useState<CourseBasicInfoType | null>();
  const [progress, setProgress] = useState(0);
  const [
    createCourse,
    { isLoading: isCreatingCourse, error: creatingCourseError },
  ] = useCreateCourseMutation();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // Handle loading state
  useEffect(() => {
    if (isCreatingCourse) {
      dispatch(startLoading('Creating course...'));
    } else {
      dispatch(stopLoading());
    }

    return () => {
      dispatch(stopLoading());
    };
  }, [isCreatingCourse, dispatch]);

  // Handle back button to go to previous step or exit
  const handleSteps = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    } else {
      router.push('/instructor/courses');
    }
  };

  // Get basic course info
  const handleCourseFormSubmit = async (data: CourseBasicInfoType) => {
    // console.log(data);

    // Create new course into database
    try {
      const res = await createCourse(data);
      // console.log(res);
      if ('data' in res && res.data.statusCode === 201) {
        const courseData: CourseBasicInfoType = {
          ...data,
          id: res.data.data.id,
        };
        // console.log(courseData);

        // Save course basic info and proceed to next step
        setCourseBasicInfo(courseData);
        setProgress(50); // Update progress to 50% after course info is saved
        setCurrentStep(2);
      }
    } catch (error) {
      toast.error('Create course failed!');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="lg" onClick={handleSteps}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Course</h1>
            <p className="text-muted-foreground">
              Build an engaging course for your students
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Creation Progress</h3>
              <span className="text-sm text-muted-foreground">
                {progress}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-3" />

            <div className="flex items-center justify-between mt-4 text-sm">
              <div
                className={`flex items-center gap-2 ${
                  courseBasicInfo ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {courseBasicInfo ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2" />
                )}
                Course Information
              </div>
              <div
                className={`flex items-center gap-2 ${
                  progress === 100 ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {progress === 100 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2" />
                )}
                Add Lessons
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Create course's basic information */}
        {currentStep === 1 && (
          <CreateCourseBasicInforPage
            mode="create"
            onSubmit={handleCourseFormSubmit}
          />
        )}

        {/* Step 2: Create Lessons */}
        {currentStep === 2 && courseBasicInfo && (
          <CreateLessonsPage2
            courseBasicInfo={courseBasicInfo}
            setProgress={setProgress}
          />
        )}
      </div>
    </div>
  );
}
