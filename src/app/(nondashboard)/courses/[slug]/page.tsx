"use client";

import { useState, use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCourseBySlugQuery } from "@/services/coursesApi";
import { CourseDetailSkeleton } from "@/components/course-detail/CourseDetailSkeleton";
import { CourseHeader } from "@/components/course-detail/CourseHeader";
import { CourseContent } from "@/components/course-detail/CourseContent";
import { InstructorProfile } from "@/components/course-detail/InstructorProfile";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showAlreadyEnrolledDialog, setShowAlreadyEnrolledDialog] =
    useState(false);

  const { slug } = use(params);

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useGetCourseBySlugQuery(slug);

  // Auto scroll to course preview when coming from Watch Demo button
  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo === "course-preview" && !isLoading && course) {
      // Wait a bit for the component to fully render
      const timer = setTimeout(() => {
        const coursePreviewElement = document.querySelector(
          "[data-course-preview]"
        );
        if (coursePreviewElement) {
          coursePreviewElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, isLoading, course]);

  const handleEnroll = async () => {
    // Kiểm tra nếu user đã enroll rồi
    if (course?.isEnrolled) {
      setShowAlreadyEnrolledDialog(true);
      return;
    }

    setIsEnrolling(true);
    try {
      // Simulate enrollment API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Make an API call to enroll the user and refetch course data
      console.log("Enrolling in course:", slug);
      // Sau khi enroll thành công, refetch để cập nhật isEnrolled
      refetch();
    } catch (error) {
      // console.error("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Course not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 -ml-2 hover:bg-white dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <CourseHeader
              course={course}
              isEnrolled={course.isEnrolled || false}
              onEnroll={handleEnroll}
              isEnrolling={isEnrolling}
              variant="full"
            />

            {/* Course Content */}
            <CourseContent
              course={course}
              sections={course.sections || []}
              isEnrolled={course.isEnrolled || false}
            />

            {/* Instructor Profile */}
            <InstructorProfile course={course} variant="full" />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compact Course Header for Desktop */}
            <div className="lg:block hidden">
              <CourseHeader
                course={course}
                isEnrolled={course.isEnrolled || false}
                onEnroll={handleEnroll}
                isEnrolling={isEnrolling}
                variant="compact"
              />
            </div>

            {/* Compact Instructor Profile for Desktop */}
            <div className="lg:block hidden">
              <InstructorProfile course={course} variant="compact" />
            </div>
          </div>
        </div>

        {/* Alert Dialog for Already Enrolled */}
        <AlertDialog
          open={showAlreadyEnrolledDialog}
          onOpenChange={setShowAlreadyEnrolledDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Already Enrolled</AlertDialogTitle>
              <AlertDialogDescription>
                You have already enrolled in this course "{course?.title}". You
                can access the course content and continue learning.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowAlreadyEnrolledDialog(false)}
              >
                Got it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
