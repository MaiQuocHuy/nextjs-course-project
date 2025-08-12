"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, FileText, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompleteLessonMutation } from "@/services/student/studentApi";
import type { Lesson, Section, QuizQuestion } from "@/types/student";

interface LearningContentProps {
  currentLesson?: Lesson;
  section?: Section;
  courseId: string;
  onMarkComplete?: (lessonId: string) => void;
  onRefetchCourse?: () => void;
}

interface QuizState {
  answers: Record<string, string>;
  submitted: boolean;
  showResults: boolean;
}

const VideoContent = ({
  lesson,
  onAutoComplete,
}: {
  lesson: Lesson;
  onAutoComplete?: () => void;
}) => {
  if (!lesson.video) return null;

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { currentTime, duration } = video;

    // Auto complete when user watches >= 90% of video
    if (
      duration > 0 &&
      currentTime >= duration * 0.9 &&
      !lesson.isCompleted &&
      onAutoComplete
    ) {
      onAutoComplete();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full"
          poster="/placeholder-video.jpg"
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={lesson.video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="text-xs sm:text-sm text-gray-600">
        Duration: {Math.floor(lesson.video.duration / 60)} minutes
      </div>
      {lesson.isCompleted && (
        <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Video completed!</span>
        </div>
      )}
    </div>
  );
};

const TextContent = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="prose prose-sm sm:prose max-w-none">
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          This is a text lesson. In a real application, you would render the
          actual text content here.
        </p>
        <div className="space-y-3 sm:space-y-4">
          <h4 className="font-semibold text-sm sm:text-base">Key Topics:</h4>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
            <li>Understanding the fundamentals</li>
            <li>Best practices and patterns</li>
            <li>Common pitfalls to avoid</li>
            <li>Real-world applications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const QuizContent = ({ lesson }: { lesson: Lesson }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    answers: {},
    submitted: false,
    showResults: false,
  });

  if (!lesson.quiz) return null;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (quizState.submitted) return;

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      submitted: true,
      showResults: true,
    }));
  };

  const getScore = () => {
    const totalQuestions = lesson.quiz!.questions.length;
    const correctAnswers = lesson.quiz!.questions.filter(
      (q) => quizState.answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const allQuestionsAnswered = lesson.quiz.questions.every(
    (q) => quizState.answers[q.id]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {quizState.showResults && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="font-semibold text-green-800 text-sm sm:text-base">
                Quiz Completed!
              </span>
            </div>
            <p className="text-green-700 text-sm sm:text-base">
              Your score: {getScore()}% (
              {
                lesson.quiz.questions.filter(
                  (q) => quizState.answers[q.id] === q.correctAnswer
                ).length
              }
              /{lesson.quiz.questions.length} correct)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 sm:space-y-6">
        {lesson.quiz.questions.map((question, index) => (
          <Card key={question.id} className="border-gray-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg leading-snug">
                Question {index + 1}: {question.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {question.options.map((option) => {
                  const optionLetter = option.charAt(0);
                  const isSelected =
                    quizState.answers[question.id] === optionLetter;
                  const isCorrect = optionLetter === question.correctAnswer;
                  const showResult = quizState.showResults;

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        handleAnswerSelect(question.id, optionLetter)
                      }
                      className={cn(
                        "w-full text-left p-2.5 sm:p-3 rounded-lg border-2 transition-colors text-sm sm:text-base",
                        !quizState.submitted && "hover:border-blue-300",
                        isSelected &&
                          !showResult &&
                          "border-blue-500 bg-blue-50",
                        showResult &&
                          isCorrect &&
                          "border-green-500 bg-green-50",
                        showResult &&
                          isSelected &&
                          !isCorrect &&
                          "border-red-500 bg-red-50",
                        !showResult && !isSelected && "border-gray-200"
                      )}
                      disabled={quizState.submitted}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 mt-0.5 sm:mt-0",
                            isSelected &&
                              !showResult &&
                              "border-blue-500 bg-blue-500 text-white",
                            showResult &&
                              isCorrect &&
                              "border-green-500 bg-green-500 text-white",
                            showResult &&
                              isSelected &&
                              !isCorrect &&
                              "border-red-500 bg-red-500 text-white",
                            !showResult && !isSelected && "border-gray-300"
                          )}
                        >
                          {optionLetter}
                        </div>
                        <span className="leading-relaxed">
                          {option.substring(3)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {quizState.showResults && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Explanation:
                  </h5>
                  <p className="text-blue-800 text-sm sm:text-base leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!quizState.submitted && (
        <Button
          onClick={handleSubmitQuiz}
          disabled={!allQuestionsAnswered}
          className="w-full h-10 sm:h-11"
        >
          <span className="text-sm sm:text-base">Submit Quiz</span>
        </Button>
      )}
    </div>
  );
};

export function LearningContent({
  currentLesson,
  section,
  courseId,
  onMarkComplete,
  onRefetchCourse,
}: LearningContentProps) {
  const [completeLesson, { isLoading: isCompleting }] =
    useCompleteLessonMutation();

  if (!currentLesson || !section) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Select a lesson to begin
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a lesson from the sidebar to start learning
          </p>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (!section?.id || isCompleting || currentLesson.isCompleted) return;

    try {
      await completeLesson({
        sectionId: section.id,
        lessonId: currentLesson.id,
        courseId,
      }).unwrap();

      // Call parent callback if provided
      if (onMarkComplete) {
        onMarkComplete(currentLesson.id);
      }

      // Refetch course data to update progress and UI
      if (onRefetchCourse) {
        onRefetchCourse();
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    }
  };

  const handleAutoComplete = async () => {
    // Same logic as manual complete but for auto-completion
    if (!section?.id || isCompleting || currentLesson.isCompleted) return;

    try {
      await completeLesson({
        sectionId: section.id,
        lessonId: currentLesson.id,
        courseId,
      }).unwrap();

      if (onMarkComplete) {
        onMarkComplete(currentLesson.id);
      }

      if (onRefetchCourse) {
        onRefetchCourse();
      }
    } catch (error) {
      console.error("Failed to auto-complete lesson:", error);
    }
  };

  const getLessonTypeIcon = () => {
    switch (currentLesson.type) {
      case "VIDEO":
        return <Play className="h-5 w-5" />;
      case "QUIZ":
        return <HelpCircle className="h-5 w-5" />;
      case "TEXT":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getLessonTypeBadge = () => {
    if (currentLesson.isCompleted) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }

    switch (currentLesson.type) {
      case "VIDEO":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Video
          </Badge>
        );
      case "QUIZ":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Quiz
          </Badge>
        );
      case "TEXT":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Reading
          </Badge>
        );
      default:
        return <Badge variant="secondary">Lesson</Badge>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {/* Header - now part of scrollable content */}
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
            <span className="truncate">{section.title}</span>
          </div>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {getLessonTypeIcon()}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight line-clamp-2">
                  {currentLesson.title}
                </h1>
                <div className="mt-1 sm:mt-0 sm:inline-block">
                  {getLessonTypeBadge()}
                </div>
              </div>
            </div>
            {currentLesson.isCompleted && (
              <div className="flex items-center gap-1 sm:gap-2 text-green-600 flex-shrink-0">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          {currentLesson.type === "VIDEO" && (
            <VideoContent
              lesson={currentLesson}
              onAutoComplete={handleAutoComplete}
            />
          )}
          {currentLesson.type === "QUIZ" && (
            <QuizContent lesson={currentLesson} />
          )}
          {currentLesson.type === "TEXT" && (
            <TextContent lesson={currentLesson} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 lg:p-6 bg-white">
          <Button
            onClick={handleMarkComplete}
            disabled={currentLesson.isCompleted || isCompleting}
            className="w-full h-10 sm:h-11"
          >
            {isCompleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm sm:text-base">Completing...</span>
              </div>
            ) : currentLesson.isCompleted ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm sm:text-base">Completed</span>
              </div>
            ) : (
              <span className="text-sm sm:text-base">Mark as Complete</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
