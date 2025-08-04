"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetCourseWithSectionsQuery } from "@/services/student/studentApi";
import { LearningSidebar } from "./LearningSidebar";
import { LearningContent } from "./LearningContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Menu, X } from "lucide-react";
import type { Lesson, Section } from "@/types/student";

interface LearningPageClientProps {
  courseId: string;
}

export default function LearningPageClient({
  courseId,
}: LearningPageClientProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch course with sections
  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = useGetCourseWithSectionsQuery(courseId);

  // Find current lesson and section
  const { currentLesson, currentSection } = useMemo(() => {
    if (!courseData?.sections || !selectedLessonId) {
      return { currentLesson: undefined, currentSection: undefined };
    }

    for (const section of courseData.sections) {
      const lesson = section.lessons.find((l) => l.id === selectedLessonId);
      if (lesson) {
        return { currentLesson: lesson, currentSection: section };
      }
    }

    return { currentLesson: undefined, currentSection: undefined };
  }, [courseData?.sections, selectedLessonId]);

  // Set default lesson (first lesson of first section)
  useEffect(() => {
    if (
      courseData?.sections &&
      courseData.sections.length > 0 &&
      !selectedLessonId
    ) {
      const firstSection = courseData.sections[0];
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        setSelectedLessonId(firstSection.lessons[0].id);
      }
    }
  }, [courseData?.sections, selectedLessonId]);

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleMarkComplete = (lessonId: string) => {
    // In a real app, this would make an API call to mark the lesson as complete
    console.log("Marking lesson as complete:", lessonId);
    // You would typically refetch the data or update the cache here
    refetch();
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Sidebar Skeleton - Hidden on mobile when loading */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        {/* Mobile Loading Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
          <div className="w-6" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-4 lg:p-6 space-y-4">
          <Skeleton className="h-6 lg:h-8 w-48 lg:w-64" />
          <Skeleton className="h-48 lg:h-96 w-full" />
          <Skeleton className="h-10 lg:h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <p className="text-sm">
              Failed to load course content. Please try again.
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg lg:text-xl font-semibold mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            The requested course could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        w-full sm:w-80 bg-white fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:border-r lg:border-gray-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <LearningSidebar
          course={courseData.course}
          sections={courseData.sections}
          currentLessonId={selectedLessonId}
          progress={courseData.progress}
          onSelectLesson={handleSelectLesson}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold truncate text-sm sm:text-base px-2">
            {courseData.course.title}
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Learning Content */}
        <div className="flex-1 bg-white overflow-hidden">
          <LearningContent
            currentLesson={currentLesson}
            section={currentSection}
            onMarkComplete={handleMarkComplete}
          />
        </div>
      </div>
    </div>
  );
}
