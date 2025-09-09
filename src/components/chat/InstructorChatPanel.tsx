"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Chat from "./Chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/instructor/courses";
import { ChevronLeft, X, BookOpen, Loader2 } from "lucide-react";
import { useGetPublishedCoursesQuery } from "@/services/instructor/courses/courses-api";

// Course thumbnail placeholder component
const CourseThumbnailPlaceholder: React.FC<{
  isMobile?: boolean;
  title?: string;
}> = ({ isMobile, title }) => (
  <div
    className={cn(
      "rounded-md border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-100",
      "flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200",
      "transition-colors duration-200",
      isMobile ? "w-12 h-8" : "w-15 h-10"
    )}
  >
    <BookOpen
      className={cn(
        "text-gray-400 group-hover:text-gray-500 transition-colors duration-200",
        isMobile ? "w-3 h-3" : "w-4 h-4"
      )}
    />
  </div>
);

// Loading thumbnail component
const CourseThumbnailLoading: React.FC<{ isMobile?: boolean }> = ({
  isMobile,
}) => (
  <div
    className={cn(
      "rounded-md border border-gray-200 bg-gray-100 animate-pulse",
      isMobile ? "w-12 h-8" : "w-15 h-10"
    )}
  />
);

// Course list item skeleton
const CourseItemSkeleton: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <li className="w-full p-3 rounded-lg border border-gray-100">
    <div className="flex gap-3 items-start">
      <CourseThumbnailLoading isMobile={isMobile} />
      <div className="flex-1 min-w-0 space-y-2">
        <div
          className={cn(
            "h-4 bg-gray-200 rounded animate-pulse",
            isMobile ? "w-24" : "w-32"
          )}
        />
        <div
          className={cn(
            "h-3 bg-gray-150 rounded animate-pulse",
            isMobile ? "w-16" : "w-20"
          )}
        />
        <div className="h-2 bg-gray-100 rounded animate-pulse w-12" />
      </div>
    </div>
  </li>
);

interface InstructorChatPanelProps {
  initialCourseId?: string;
  onClose: () => void;
  isMobile?: boolean;
}

const InstructorChatPanel: React.FC<InstructorChatPanelProps> = ({
  initialCourseId,
  onClose,
  isMobile = false,
}) => {
  const {
    data: courses,
    isLoading,
    isError,
    refetch,
  } = useGetPublishedCoursesQuery();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    initialCourseId
  );
  const [showCourseList, setShowCourseList] = useState(!isMobile);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set());
  const [switchingCourse, setSwitchingCourse] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    setShowCourseList(!isMobile);
  }, [isMobile]);

  const handleCourseSelect = (courseId: string) => {
    if (courseId === selectedCourseId) return; // Don't switch if already selected

    setSwitchingCourse(courseId);
    setSelectedCourseId(courseId);

    if (isMobile) {
      setShowCourseList(false);
    }

    // Clear switching state after a delay to allow Chat component to load
    setTimeout(() => {
      setSwitchingCourse(null);
    }, 500);
  };

  const handleBackToCourseList = () => {
    setShowCourseList(true);
  };

  const handleImageError = (courseId: string) => {
    setImageErrors((prev) => new Set([...prev, courseId]));
    setImageLoading((prev) => {
      const newSet = new Set([...prev]);
      newSet.delete(courseId);
      return newSet;
    });
  };

  const handleImageLoadStart = (courseId: string) => {
    setImageLoading((prev) => new Set([...prev, courseId]));
  };

  const handleImageLoadComplete = (courseId: string) => {
    setImageLoading((prev) => {
      const newSet = new Set([...prev]);
      newSet.delete(courseId);
      return newSet;
    });
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
        <div className="flex items-center justify-between p-4 border-b bg-gray-100">
          <h3 className="text-lg font-semibold">Your Courses</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="space-y-2">
              {/* Show skeleton loading for 3 course items */}
              <CourseItemSkeleton isMobile={isMobile} />
              <CourseItemSkeleton isMobile={isMobile} />
              <CourseItemSkeleton isMobile={isMobile} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-red-500 mb-3">
                <X className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-red-500 font-medium mb-1">
                Failed to load courses
              </div>
              <div className="text-xs text-red-400 mb-4">
                Please check your connection and try again
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="text-xs"
              >
                Try Again
              </Button>
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="w-8 h-8 text-gray-300 mb-2" />
              <div className="text-sm text-muted-foreground font-medium mb-1">
                No enrolled courses
              </div>
              <div className="text-xs text-gray-400">
                Enroll in a course to start chatting
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {courses.map((course: Course) => (
                <li key={course.id}>
                  <button
                    onClick={() => handleCourseSelect(course.id)}
                    disabled={switchingCourse === course.id}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                      "hover:bg-white hover:shadow-sm border border-transparent",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      selectedCourseId === course.id
                        ? "bg-white shadow-sm border-primary/20 ring-1 ring-primary/10"
                        : "hover:border-gray-200"
                    )}
                  >
                    <div className="flex gap-3 items-start">
                      {/* Course Thumbnail */}
                      <div className="relative flex-shrink-0">
                        {imageLoading.has(course.id) && (
                          <div className="absolute inset-0 z-10">
                            <CourseThumbnailLoading isMobile={isMobile} />
                          </div>
                        )}
                        {!imageErrors.has(course.id) && course.thumbnailUrl ? (
                          <Image
                            src={course.thumbnailUrl}
                            alt={course.title || "Course thumbnail"}
                            width={isMobile ? 48 : 60}
                            height={isMobile ? 32 : 40}
                            className={cn(
                              "rounded-md object-cover border border-gray-200 bg-gray-100",
                              "transition-opacity duration-300",
                              isMobile ? "w-12 h-8" : "w-15 h-10",
                              imageLoading.has(course.id)
                                ? "opacity-0"
                                : "opacity-100"
                            )}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            onLoadingComplete={() =>
                              handleImageLoadComplete(course.id)
                            }
                            onLoadStart={() => handleImageLoadStart(course.id)}
                            onError={() => handleImageError(course.id)}
                          />
                        ) : (
                          <CourseThumbnailPlaceholder
                            isMobile={isMobile}
                            title={course.title}
                          />
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "font-medium truncate text-gray-900 mb-1 flex items-center gap-2",
                            isMobile ? "text-xs" : "text-sm"
                          )}
                        >
                          <span className="truncate">
                            {course.title || `Course ${course.id}`}
                          </span>
                          {switchingCourse === course.id && (
                            <Loader2 className="w-3 h-3 animate-spin text-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
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
          switchingCourse === selectedCourseId ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-900 mb-2">
                  Loading chat...
                </div>
                <div className="text-sm text-gray-500">
                  Fetching messages for{" "}
                  {courses?.find((c) => c.id === selectedCourseId)?.title ||
                    "this course"}
                </div>
              </div>
            </div>
          ) : (
            <Chat
              courseId={selectedCourseId}
              courseTitle={
                courses?.find((c) => c.id === selectedCourseId)?.title
              }
              onClose={onClose}
              isMobile={isMobile}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-4" />
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

export default InstructorChatPanel;
