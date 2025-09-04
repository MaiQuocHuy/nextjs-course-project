'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import type { CourseBasicInfoType } from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { CreateCourseBasicInforPage } from '@/components/instructor/course/create-course/create-basic-infor/CreateCourseBasicInforPage';
import { useRouter } from 'next/navigation';
import WarningAlert from '../../commom/WarningAlert';
import SectionsLessonsManager2 from '../SectionsLessonsManager2';

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseBasicInfo, setCourseBasicInfo] =
    useState<CourseBasicInfoType | null>();
  const [progress, setProgress] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();

  // Handle back button to go to previous step or exit
  const handleSteps = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleExitCreateCourse = () => {
    router.push('/instructor/courses');
  };

  // Create new course into database
  const handleCourseFormSubmit = async (data: CourseBasicInfoType) => {
    // console.log(data);
    setCourseBasicInfo(data);
    setProgress(50); // Update progress to 50% after course info is saved
    setCurrentStep(2);
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

        {/* Step 2: Create Sections and Lessons */}
        {currentStep === 2 && courseBasicInfo && courseBasicInfo.id && (
          <SectionsLessonsManager2
            courseId={courseBasicInfo.id}
            mode="create"
            setProgress={(progress) => setProgress(progress)}
          />
        )}

        {/* {currentStep === 1 && (
          <SectionsLessonsManager2
            courseId='abc'
            mode="create"
            setProgress={(progress) => setProgress(progress)}
          />
        )} */}

        <WarningAlert
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Are you sure you want to exit!"
          description="You are creating course's information. If you exit, these information will not be saved."
          onClick={handleExitCreateCourse}
          actionTitle="Exit"
        />
      </div>
    </div>
  );
}
