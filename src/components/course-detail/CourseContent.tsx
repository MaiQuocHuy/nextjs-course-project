"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PlayCircle,
  FileText,
  Clock,
  CheckCircle,
  Lock,
  Eye,
  BookOpen,
  Target,
  Users,
  Globe,
} from "lucide-react";
import { Course } from "@/app/data/courses";
import { cn } from "@/lib/utils";

interface CourseContentProps {
  course: Course;
  isEnrolled: boolean;
  className?: string;
}

export function CourseContent({
  course,
  isEnrolled,
  className = "",
}: CourseContentProps) {
  const [expandedSection, setExpandedSection] = useState<string>("");

  const getTotalLessons = () => {
    return (
      course.sections?.reduce(
        (total, section) => total + (section.lessons?.length || 0),
        0
      ) || 0
    );
  };

  const getDurationInHours = () => {
    // Estimate 10 minutes per lesson
    const totalMinutes = getTotalLessons() * 10;
    return Math.round(totalMinutes / 60);
  };

  const getCompletedLessons = () => {
    // Mock completion data - in real app, this would come from user progress API
    if (!isEnrolled) return 0;
    return Math.floor(getTotalLessons() * 0.3); // 30% completed for demo
  };

  const mockWhatYouLearn = [
    "Build responsive web applications with React and TypeScript",
    "Master advanced JavaScript concepts and ES6+ features",
    "Implement authentication and authorization systems",
    "Work with APIs and handle data management",
    "Deploy applications to production environments",
    "Follow best practices for code organization and testing",
  ];

  const mockRequirements = [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "Familiarity with programming concepts",
    "A computer with internet connection",
    "Willingness to learn and practice coding",
  ];

  return (
    <div className={cn("space-y-8", className)}>
      {/* What You'll Learn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            What you'll learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockWhatYouLearn.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Course content
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{course.sections?.length || 0} sections</span>
              <span>{getTotalLessons()} lessons</span>
              <span>{getDurationInHours()}h total length</span>
            </div>
          </div>

          {isEnrolled && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (getCompletedLessons() / getTotalLessons()) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {getCompletedLessons()}/{getTotalLessons()} completed
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Accordion
            type="single"
            collapsible
            value={expandedSection}
            onValueChange={setExpandedSection}
            className="space-y-2"
          >
            {course.sections?.map((section, sectionIndex) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-t-lg">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Section {sectionIndex + 1}:
                      </span>
                      <span className="font-semibold text-left">
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto mr-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{section.lessons?.length || 0} lessons</span>
                      <span>{(section.lessons?.length || 0) * 10}min</span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {section.lessons?.map((lesson, lessonIndex) => {
                      const isCompleted = isEnrolled && lessonIndex < 2; // Mock completion
                      const isPreviewable = lessonIndex < 2; // First 2 lessons are previewable
                      const canAccess = isEnrolled || isPreviewable;

                      return (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                            canAccess
                              ? "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                              : "opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {lesson.type === "VIDEO" ? (
                              <PlayCircle
                                className={cn(
                                  "w-5 h-5",
                                  isCompleted
                                    ? "text-green-600"
                                    : "text-blue-600"
                                )}
                              />
                            ) : (
                              <FileText
                                className={cn(
                                  "w-5 h-5",
                                  isCompleted
                                    ? "text-green-600"
                                    : "text-gray-600"
                                )}
                              />
                            )}

                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-medium",
                                  isCompleted
                                    ? "text-green-700 dark:text-green-400"
                                    : ""
                                )}
                              >
                                {lesson.title}
                              </span>

                              {isPreviewable && !isEnrolled && (
                                <Badge variant="outline" className="text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Badge>
                              )}

                              {!canAccess && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>

                            {/* Lesson description would come from lesson.content or lesson.videoContent */}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>10min</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRequirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {requirement}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            This course includes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              <span>{getDurationInHours()} hours on-demand video</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Downloadable resources</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span>Certificate of completion</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Access on mobile and TV</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
