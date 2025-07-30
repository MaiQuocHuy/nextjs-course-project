'use client';

import { useEffect, useState } from 'react';
import { CourseForm } from '@/components/instructor-dashboard/course/course-form';
import { CourseImageUpload } from '@/components/instructor-dashboard/course/course-image-upload';
import { CourseVideoUpload } from '@/components/instructor-dashboard/course/course-video-upload';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, CheckCircle } from 'lucide-react';
import type { CourseFormData } from '@/lib/validations/course';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseFormData | null>(null);

  const handleCourseFormSubmit = (data: CourseFormData) => {
    console.log(data);
    setCourseData(data);
    setCurrentStep(2);
  };

  const handleFinalSubmit = () => {};

  const getOverallProgress = () => {
    let progress = 0;

    // Step 1: Course form (50%)
    if (courseData) progress += 50;

    // Step 2: Media uploads (50%)
    if (currentStep >= 2) {
      let mediaProgress = 0;

      progress += mediaProgress;
    }

    return progress;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => (currentStep > 1 ? setCurrentStep(1) : null)}
          >
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
                  currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {currentStep >= 2 ? (
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
        {currentStep === 1 && <CourseForm onSubmit={handleCourseFormSubmit} />}

        {/* Step 2: Media Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Course Summary */}
            {courseData && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Course Summary</CardTitle>
                  <CardDescription>
                    Review your course information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <span>
                      <strong>Title:</strong> {courseData.title}
                    </span>
                    <span>
                      <strong>Price:</strong> ${courseData.price.toFixed(2)}
                    </span>
                    <span>
                      <strong>Category:</strong> {courseData.category}
                    </span>
                  </div>
                  <img
                    src={courseData.file && courseData.file.preview}
                    alt={courseData.file.title}
                  />
                </CardContent>
              </Card>
            )}

            {/* Introduction Video */}
            {/* <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Introduction Video</CardTitle>
                <CardDescription>
                  Upload a short video introducing your course (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseVideoUpload type="intro" onVideoChange={setIntroVideo} />
              </CardContent>
            </Card> */}

            {/* Lesson Videos */}
            {/* <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Lesson Videos</CardTitle>
                <CardDescription>
                  Upload videos for your course lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseVideoUpload
                  type="lesson"
                  onVideoChange={setLessonVideos}
                />
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Course Details
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleFinalSubmit}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleFinalSubmit}
                      // disabled={courseThumb && courseThumb.status === 'success'}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publish Course
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
