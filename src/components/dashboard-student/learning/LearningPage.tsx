"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  VideoPlayer,
  CourseProgressBar,
  MarkCompleteButton,
  Quiz,
  LearningSidebar,
  MobileLearningSidebar,
} from "@/components/dashboard-student/learning";
import { mockCourse, mockQuizzes } from "@/lib/mock-learning-data";
import { Lesson } from "@/types/learning";

interface LearningPageProps {
  courseId: string;
}

export function LearningPage({ courseId }: LearningPageProps) {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson");

  // State for lesson completion
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(
      mockCourse.sections
        .flatMap((section) => section.lessons)
        .filter((lesson) => lesson.isCompleted)
        .map((lesson) => lesson.id)
    )
  );

  // Find current lesson
  const currentLesson = useMemo(() => {
    if (!lessonId) {
      // Default to first incomplete lesson or first lesson
      return (
        mockCourse.sections
          .flatMap((section) => section.lessons)
          .find((lesson) => !completedLessons.has(lesson.id)) ||
        mockCourse.sections[0]?.lessons[0]
      );
    }

    return mockCourse.sections
      .flatMap((section) => section.lessons)
      .find((lesson) => lesson.id === lessonId);
  }, [lessonId, completedLessons]);

  // Get quiz for current lesson
  const currentQuiz = currentLesson?.hasQuiz
    ? mockQuizzes[currentLesson.id]
    : null;

  // Update lesson completion
  const handleToggleComplete = (lessonId: string, completed: boolean) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      if (completed) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      return newSet;
    });
  };

  // Handle quiz completion
  const handleQuizComplete = (passed: boolean) => {
    if (passed && currentLesson) {
      handleToggleComplete(currentLesson.id, true);
    }
  };

  // Update course data with current completion state
  const updatedCourse = {
    ...mockCourse,
    completedLessons: completedLessons.size,
    sections: mockCourse.sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedLessons.has(lesson.id),
      })),
    })),
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <LearningSidebar
        sections={updatedCourse.sections}
        currentLessonId={currentLesson.id}
        courseId={courseId}
        courseTitle={mockCourse.title}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-gray-900">
                {currentLesson.title}
              </h1>
              <p className="text-sm text-gray-500">{mockCourse.title}</p>
            </div>
            <MobileLearningSidebar
              sections={updatedCourse.sections}
              currentLessonId={currentLesson.id}
              courseId={courseId}
              courseTitle={mockCourse.title}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Course Progress */}
            <CourseProgressBar
              totalLessons={updatedCourse.totalLessons}
              completedLessons={updatedCourse.completedLessons}
              courseTitle={updatedCourse.title}
            />

            {/* Video Player */}
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
            />

            {/* Mark Complete Button */}
            <MarkCompleteButton
              lessonId={currentLesson.id}
              isCompleted={completedLessons.has(currentLesson.id)}
              onToggleComplete={handleToggleComplete}
            />

            {/* Quiz (if lesson has quiz) */}
            {currentQuiz && !completedLessons.has(currentLesson.id) && (
              <Quiz quiz={currentQuiz} onComplete={handleQuizComplete} />
            )}

            {/* Completion Message */}
            {completedLessons.has(currentLesson.id) && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ Lesson completed! Great job!
                </p>
                {currentQuiz && (
                  <p className="text-green-600 text-sm mt-1">
                    Quiz passed successfully.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
