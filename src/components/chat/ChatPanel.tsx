"use client";

import React, { useState, useEffect } from "react";
import { useGetAllEnrolledCoursesQuery } from "@/services/student/studentApi";
import Chat from "./Chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/student";
import { ChevronLeft, X } from "lucide-react";

interface ChatPanelProps {
  initialCourseId?: string;
  onClose: () => void;
  isMobile?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  initialCourseId,
  onClose,
  isMobile = false,
}) => {
  const { data: courses, isLoading, isError } = useGetAllEnrolledCoursesQuery();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    initialCourseId
  );
  const [showCourseList, setShowCourseList] = useState(!isMobile);

  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].courseId);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    setShowCourseList(!isMobile);
  }, [isMobile]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (isMobile) {
      setShowCourseList(false);
    }
  };

  const handleBackToCourseList = () => {
    setShowCourseList(true);
  };

  return (
    <div
      className={cn(
        "flex shadow-2xl bg-white rounded-lg overflow-hidden",
        // Desktop sizing
        "md:w-[800px] md:h-[600px]",
        // Tablet sizing
        "sm:w-[600px] sm:h-[500px]",
        // Mobile sizing (fullscreen)
        "w-full h-full md:rounded-lg sm:rounded-lg rounded-none"
      )}
    >
      {/* Course List Sidebar */}
      <aside
        className={cn(
          "border-r bg-gray-50/50 transition-all duration-300",
          // Desktop: always visible
          "md:w-80 md:flex",
          // Tablet: always visible but smaller
          "sm:w-64 sm:flex",
          // Mobile: toggleable
          isMobile ? (showCourseList ? "w-full" : "hidden") : "flex",
          "flex-col"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="text-lg font-semibold">Your Courses</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground px-2 py-8 text-center">
              Loading courses...
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500 px-2 py-8 text-center">
              Failed to load courses
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="text-sm text-muted-foreground px-2 py-8 text-center">
              No enrolled courses
            </div>
          ) : (
            <ul className="space-y-2">
              {courses.map((course: Course) => (
                <li key={course.courseId}>
                  <button
                    onClick={() => handleCourseSelect(course.courseId)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "hover:bg-white hover:shadow-sm border border-transparent",
                      selectedCourseId === course.courseId
                        ? "bg-white shadow-sm border-primary/20 ring-1 ring-primary/10"
                        : "hover:border-gray-200"
                    )}
                  >
                    <div className="font-medium text-sm truncate text-gray-900">
                      {course.title || `Course ${course.courseId}`}
                    </div>
                    {course.instructor?.name && (
                      <div className="text-xs text-gray-500 mt-1">
                        {course.instructor.name}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main
        className={cn(
          "flex-1 flex flex-col",
          // Mobile: hide when course list is shown
          isMobile ? (showCourseList ? "hidden" : "flex") : "flex"
        )}
      >
        {/* Mobile Header with Back Button */}
        {isMobile && !showCourseList && (
          <div className="flex items-center justify-between p-3 border-b bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCourseList}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Courses
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {selectedCourseId ? (
          <Chat
            courseId={selectedCourseId}
            onClose={onClose}
            isMobile={isMobile}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                Select a course
              </div>
              <div className="text-sm text-gray-500">
                Choose a course from the sidebar to start chatting
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPanel;
