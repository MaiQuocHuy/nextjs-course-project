"use client";

import React, { useState, useEffect } from "react";
import { useGetAllEnrolledCoursesQuery } from "@/services/student/studentApi";
import Chat from "./Chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/student";

interface ChatPanelProps {
  initialCourseId?: string;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ initialCourseId, onClose }) => {
  const { data: courses, isLoading, isError } = useGetAllEnrolledCoursesQuery();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    initialCourseId
  );

  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].courseId);
    }
  }, [courses, selectedCourseId]);

  return (
    <div className="w-96 h-[32rem] flex shadow-2xl bg-white">
      <aside className="w-72 border-r p-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-sm font-semibold">Your Courses</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground px-2">
            Loading courses...
          </div>
        ) : isError ? (
          <div className="text-sm text-red-500 px-2">
            Failed to load courses
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="text-sm text-muted-foreground px-2">
            No enrolled courses
          </div>
        ) : (
          <ul className="space-y-1">
            {courses.map((course: Course) => (
              <li key={course.courseId}>
                <button
                  onClick={() => setSelectedCourseId(course.courseId)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded hover:bg-muted",
                    selectedCourseId === course.courseId ? "bg-muted/50" : ""
                  )}
                >
                  <div className="font-medium text-sm truncate">
                    {course.title || `Course ${course.courseId}`}
                  </div>
                  {course.instructor?.name && (
                    <div className="text-xs text-muted-foreground">
                      {course.instructor.name}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="flex-1">
        {selectedCourseId ? (
          <Chat courseId={selectedCourseId} onClose={onClose} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Select a course to open chat
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPanel;
