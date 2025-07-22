"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Menu,
  CheckCircle,
  CircleDot,
  Circle,
  Clock,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { CourseSection, Lesson } from "@/types/learning";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LearningSidebarProps {
  sections: CourseSection[];
  currentLessonId?: string;
  courseId: string;
  courseTitle: string;
}

function LessonItem({
  lesson,
  isActive,
  courseId,
  onLessonClick,
}: {
  lesson: Lesson;
  isActive: boolean;
  courseId: string;
  onLessonClick?: () => void;
}) {
  return (
    <Link
      href={`/dashboard/learning/${courseId}?lesson=${lesson.id}`}
      onClick={onLessonClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
        "hover:bg-gray-50",
        isActive && "bg-primary/10 border border-primary/20"
      )}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {lesson.isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : isActive ? (
          <CircleDot className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Lesson Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              "text-sm font-medium truncate",
              isActive ? "text-primary" : "text-gray-900"
            )}
          >
            {lesson.title}
          </h4>
          {lesson.hasQuiz && (
            <HelpCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {lesson.duration && (
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{lesson.duration}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function SidebarContent({
  sections,
  currentLessonId,
  courseId,
  courseTitle,
  onLessonClick,
}: LearningSidebarProps & { onLessonClick?: () => void }) {
  const totalLessons = sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  const completedLessons = sections.reduce(
    (acc, section) =>
      acc + section.lessons.filter((lesson) => lesson.isCompleted).length,
    0
  );

  // Find which section contains the current lesson for default open
  const currentSectionId = sections.find((section) =>
    section.lessons.some((lesson) => lesson.id === currentLessonId)
  )?.id;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Link
          href="/dashboard/my-courses"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>
        <h2 className="font-semibold text-gray-900 line-clamp-2">
          {courseTitle}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion
          type="multiple"
          defaultValue={
            currentSectionId ? [currentSectionId] : [sections[0]?.id]
          }
          className="space-y-2"
        >
          {sections.map((section) => {
            const sectionCompletedCount = section.lessons.filter(
              (lesson) => lesson.isCompleted
            ).length;
            const sectionTotalCount = section.lessons.length;

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg mb-3 shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-2">
                    <span className="font-medium text-left">
                      {section.title}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {sectionCompletedCount}/{sectionTotalCount}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-1">
                    {section.lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isActive={currentLessonId === lesson.id}
                        courseId={courseId}
                        onLessonClick={onLessonClick}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

// Desktop Sidebar
export function LearningSidebar(props: LearningSidebarProps) {
  return (
    <div className="hidden lg:block w-80 border-r bg-background">
      <SidebarContent {...props} />
    </div>
  );
}

// Mobile Sidebar
export function MobileLearningSidebar(props: LearningSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4 mr-2" />
          Course Content
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Course Navigation</SheetTitle>
        </SheetHeader>
        <SidebarContent {...props} onLessonClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
