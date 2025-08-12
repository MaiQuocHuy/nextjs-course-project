"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, FileText, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCompleteLessonMutation,
  useSubmitQuizMutation,
} from "@/services/student/studentApi";
import type { Lesson, Section, QuizSubmissionResponse } from "@/types/student";
import { useAppDispatch } from "@/store/hook";
import {
  markLessonCompleted,
  updateQuizScore,
} from "@/store/slices/student/learningProgressSlice";

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
  submissionResult?: QuizSubmissionResponse;
}

const VideoContent = ({
  lesson,
  onAutoComplete,
}: {
  lesson: Lesson;
  onAutoComplete?: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!lesson.video) return null;

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { currentTime, duration } = video;

    setCurrentTime(currentTime);
    setDuration(duration);

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

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleLoadedData = () => setIsLoaded(true);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Video Container with Enhanced Design */}
      <div className="relative group">
        {/* Video Player with Shadow and Border */}
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 relative">
          {/* Loading State */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin " />
                <span className="text-gray-300 text-sm">Loading video...</span>
              </div>
            </div>
          )}

          {/* Video Element */}
          <video
            key={lesson.id}
            controls={true}
            className="w-full h-full object-cover"
            poster=""
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedData={handleLoadedData}
            style={{
              filter: "contrast(1.05) brightness(1.02)",
            }}
          >
            <source src={lesson.video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Overlay Indicator */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
              isPlaying ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 mb-5">
              <Play className="h-10 w-10 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Completion Badge Overlay */}
        {lesson.isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Video Information Panel */}
      <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Video Lesson
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Duration: {Math.floor(lesson.video.duration / 60)} minutes
                </p>
              </div>
            </div>

            {lesson.isCompleted ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Watched
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                {progressPercentage > 0
                  ? `${Math.round(progressPercentage)}% watched`
                  : "Not started"}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {progressPercentage > 0 && !lesson.isCompleted && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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

const QuizContent = ({
  lesson,
  section,
  courseId,
  onMarkComplete,
}: {
  lesson: Lesson;
  section: Section;
  courseId: string;
  onMarkComplete?: () => void;
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    answers: {},
    submitted: false,
    showResults: false,
  });

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const dispatch = useAppDispatch();

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

  const handleSubmitQuiz = async () => {
    if (!section?.id || isSubmitting) return;

    try {
      const result = await submitQuiz({
        sectionId: section.id,
        lessonId: lesson.id,
        answers: quizState.answers,
      }).unwrap();

      setQuizState((prev) => ({
        ...prev,
        submitted: true,
        showResults: true,
        submissionResult: result,
      }));

      // Update Redux state with quiz completion and score
      dispatch(
        markLessonCompleted({
          lessonId: lesson.id,
          sectionId: section.id,
          courseId,
          isCompleted: true,
          completedAt: result.submittedAt,
        })
      );

      dispatch(
        updateQuizScore({
          lessonId: lesson.id,
          score: result.score,
        })
      );

      // Mark lesson as complete after successful quiz submission
      if (onMarkComplete) {
        onMarkComplete();
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      // You might want to show an error message to the user here
    }
  };

  const getScore = () => {
    if (quizState.submissionResult) {
      return quizState.submissionResult.score;
    }

    // Fallback to client-side calculation if no server result
    const totalQuestions = lesson.quiz!.questions.length;
    const correctAnswers = lesson.quiz!.questions.filter(
      (q) => quizState.answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const getCorrectAnswersCount = () => {
    if (quizState.submissionResult) {
      return quizState.submissionResult.correctAnswers;
    }

    // Fallback to client-side calculation
    return lesson.quiz!.questions.filter(
      (q) => quizState.answers[q.id] === q.correctAnswer
    ).length;
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
              Your score: {getScore()}% ({getCorrectAnswersCount()}/
              {lesson.quiz.questions.length} correct)
            </p>
            {quizState.submissionResult?.feedback && (
              <p className="text-green-600 text-sm sm:text-base mt-2">
                {quizState.submissionResult.feedback}
              </p>
            )}
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
          disabled={!allQuestionsAnswered || isSubmitting}
          className="w-full h-10 sm:h-11"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm sm:text-base">Submitting...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">Submit Quiz</span>
          )}
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
  const dispatch = useAppDispatch();

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

      // Update Redux state
      dispatch(
        markLessonCompleted({
          lessonId: currentLesson.id,
          sectionId: section.id,
          courseId,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        })
      );

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

      // Update Redux state
      dispatch(
        markLessonCompleted({
          lessonId: currentLesson.id,
          sectionId: section.id,
          courseId,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        })
      );

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
              key={currentLesson.id}
              lesson={currentLesson}
              onAutoComplete={handleAutoComplete}
            />
          )}
          {currentLesson.type === "QUIZ" && (
            <QuizContent
              key={currentLesson.id}
              lesson={currentLesson}
              section={section}
              courseId={courseId}
              onMarkComplete={handleAutoComplete}
            />
          )}
          {currentLesson.type === "TEXT" && (
            <TextContent key={currentLesson.id} lesson={currentLesson} />
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
