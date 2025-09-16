"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCourseWithSections } from "@/hooks/student/useSection";
import { LearningSidebar } from "./LearningSidebar";
import { LearningContent } from "./LearningContent";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { LearningLoadingSkeleton } from "../ui/Loading";
import { LearningPageError } from "../ui";
import { ChatBubble } from "@/components/chat";

interface LearningPageClientProps {
  courseId: string;
}

export default function LearningPageClient({
  courseId,
}: LearningPageClientProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Storage key for persisting current lesson
  const lessonStorageKey = `current-lesson-${courseId}`;

  // Fetch course with sections
  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = useCourseWithSections(courseId);

  // Load saved lesson from localStorage and set default lesson
  useEffect(() => {
    if (
      courseData?.sections &&
      courseData.sections.length > 0 &&
      !selectedLessonId
    ) {
      // First try to load saved lesson
      const savedLessonId = localStorage.getItem(lessonStorageKey);
      if (savedLessonId) {
        // Verify that the saved lesson still exists in the course
        const lessonExists = courseData.sections.some((section) =>
          section.lessons.some((lesson) => lesson.id === savedLessonId)
        );
        if (lessonExists) {
          setSelectedLessonId(savedLessonId);
          return;
        }
      }

      // If no saved lesson or saved lesson doesn't exist, use first lesson
      const firstSection = courseData.sections[0];
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        const firstLessonId = firstSection.lessons[0].id;
        setSelectedLessonId(firstLessonId);
        localStorage.setItem(lessonStorageKey, firstLessonId);
      }
    }
  }, [courseData?.sections, selectedLessonId, lessonStorageKey]);

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

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    // Save selected lesson to localStorage
    localStorage.setItem(lessonStorageKey, lessonId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleMarkComplete = (lessonId: string) => {
    // Callback from LearningContent - just log for now
    // The actual API call is handled in LearningContent component
    console.log("Lesson marked as complete:", lessonId);
  };

  if (isLoading) {
    return <LearningLoadingSkeleton />;
  }

  if (error) {
    return <LearningPageError onRetry={refetch} />;
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
            courseId={courseId}
            onMarkComplete={handleMarkComplete}
            onRefetchCourse={refetch}
          />
        </div>
      </div>

      {/* Course Chat Bubble */}
      <ChatBubble courseId={courseId} />
    </div>
  );
}
