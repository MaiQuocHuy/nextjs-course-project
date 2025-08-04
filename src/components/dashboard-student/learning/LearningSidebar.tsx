"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  FileText,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Course, Section, Lesson } from "@/types/student";

interface LearningSidebarProps {
  course?: Course;
  sections?: Section[];
  currentLessonId?: string;
  progress?: number;
  onSelectLesson: (lessonId: string) => void;
  onClose?: () => void; // Add onClose prop for mobile
}

const getLessonIcon = (lesson: Lesson) => {
  if (lesson.isCompleted) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }

  switch (lesson.type) {
    case "VIDEO":
      return <Play className="h-4 w-4 text-blue-500" />;
    case "QUIZ":
      return <HelpCircle className="h-4 w-4 text-purple-500" />;
    case "TEXT":
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

export function LearningSidebar({
  course,
  sections = [],
  currentLessonId,
  progress = 0,
  onSelectLesson,
  onClose,
}: LearningSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(
    sections.map((section) => section.id) // Open all sections by default
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Calculate total lessons
  const totalLessons = sections.reduce(
    (total, section) => total + section.lessonCount,
    0
  );
  const completedLessons = sections.reduce(
    (total, section) =>
      total + section.lessons.filter((lesson) => lesson.isCompleted).length,
    0
  );

  return (
    <div className="h-full bg-white lg:border-r lg:border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link
            href="/dashboard/my-courses"
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to My Courses
          </Link>

          {/* Mobile Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1.5 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {course && (
          <div>
            <h2 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
              {course.title}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {completedLessons} of {totalLessons} lessons
                </span>
              </div>
              <Progress value={progress * 100} className="h-1.5 sm:h-2" />
              <div className="text-xs text-gray-500">
                {Math.round(progress * 100)}% complete
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg">
              <Button
                variant="ghost"
                className="w-full justify-between p-3 sm:p-4 h-auto text-left hover:bg-gray-50 text-sm sm:text-base"
                onClick={() => toggleSection(section.id)}
              >
                <span className="font-medium line-clamp-2">
                  {section.title}
                </span>
                {openSections.includes(section.id) ? (
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                )}
              </Button>

              {openSections.includes(section.id) && (
                <div className="border-t border-gray-200">
                  <div className="space-y-0.5 sm:space-y-1">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={cn(
                          "w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 text-left text-xs sm:text-sm hover:bg-gray-50 transition-colors",
                          currentLessonId === lesson.id &&
                            "bg-blue-50 border-r-2 border-blue-500"
                        )}
                      >
                        <div className="flex-shrink-0">
                          {getLessonIcon(lesson)}
                        </div>
                        <span
                          className={cn(
                            "flex-1 line-clamp-2",
                            lesson.isCompleted && "line-through text-gray-500",
                            currentLessonId === lesson.id &&
                              "font-medium text-blue-700"
                          )}
                        >
                          {lesson.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
