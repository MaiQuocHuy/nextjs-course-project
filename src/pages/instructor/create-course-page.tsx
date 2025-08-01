'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Send, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import type { CourseFormData } from '@/lib/instructor/validations/course';
import { CreateCourseBasicInfo } from '@/components/instructor/course/create-course/create-course-basic-info';
import { useRouter } from 'next/navigation';
import CreateLessonsPage from '@/components/instructor/course/create-course/create-lessons/create-lessons';
import CreateLessonsPage2 from '@/components/instructor/course/create-course/create-lessons/create-lessons2';
import { CourseCreationType } from '@/lib/instructor/create-course-validations/lessons-validations';
import { set } from 'zod';

export default function CreateCoursePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseFormData | null>(null);
  const [finalCourseData, setFinalCourseData] =
    useState<CourseCreationType | null>(null);
  const router = useRouter();

  const handleSteps = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    } else {
      router.push('/instructor/courses');
    }
  };

  const handleCourseFormSubmit = (data: CourseFormData) => {
    // console.log(data);
    setCourseData(data);
    setCurrentStep(2);
  };

  const handleFinalSubmit = (data: CourseCreationType) => {
    console.log('Final course data:', data);
    setFinalCourseData(data);
  };

  const getOverallProgress = () => {
    let progress = 0;

    // Step 1: Course form (50%)
    if (courseData) progress += 50;

    // Step 2: Media uploads (50%)
    if (finalCourseData) {
      progress += 50;
    }

    return progress;
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
                {getOverallProgress()}% Complete
              </span>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />

            <div className="flex items-center justify-between mt-4 text-sm">
              <div
                className={`flex items-center gap-2 ${
                  courseData ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {courseData ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2" />
                )}
                Course Information
              </div>
              <div
                className={`flex items-center gap-2 ${
                  finalCourseData ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {finalCourseData ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2" />
                )}
                Add Lessons
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Course Form */}
        {currentStep === 1 && (
          <CreateCourseBasicInfo onSubmit={handleCourseFormSubmit} />
        )}

        {/* Step 2: Media Upload */}
        {currentStep === 2 && (
          <CreateLessonsPage2 onSubmit={handleFinalSubmit} />
        )}
      </div>
    </div>
  );
}
