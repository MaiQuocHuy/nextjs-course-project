import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  CircleDot,
  Circle,
  Clock,
  FileText,
  HelpCircle,
} from "lucide-react";
import { CourseSection, Lesson } from "@/types/learning";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LessonListProps {
  sections: CourseSection[];
  currentLessonId?: string;
  courseId: string;
}

function LessonItem({
  lesson,
  isActive,
  courseId,
}: {
  lesson: Lesson;
  isActive: boolean;
  courseId: string;
}) {
  return (
    <Link
      href={`/dashboard/learning/${courseId}?lesson=${lesson.id}`}
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

function SectionItem({
  section,
  currentLessonId,
  courseId,
}: {
  section: CourseSection;
  currentLessonId?: string;
  courseId: string;
}) {
  const completedCount = section.lessons.filter(
    (lesson) => lesson.isCompleted
  ).length;
  const totalCount = section.lessons.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2">
        <h3 className="font-medium text-gray-900">{section.title}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="space-y-1">
        {section.lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            isActive={currentLessonId === lesson.id}
            courseId={courseId}
          />
        ))}
      </div>
    </div>
  );
}

export function LessonList({
  sections,
  currentLessonId,
  courseId,
}: LessonListProps) {
  const totalLessons = sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  const completedLessons = sections.reduce(
    (acc, section) =>
      acc + section.lessons.filter((lesson) => lesson.isCompleted).length,
    0
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Course Content
        </CardTitle>
        <p className="text-sm text-gray-500">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            currentLessonId={currentLessonId}
            courseId={courseId}
          />
        ))}
      </CardContent>
    </Card>
  );
}
