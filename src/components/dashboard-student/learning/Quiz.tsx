"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Quiz as QuizType } from "@/types/learning";
import { cn } from "@/lib/utils";

interface QuizProps {
  quiz: QuizType;
  onComplete: (passed: boolean) => void;
}

type QuizState = "answering" | "submitted" | "completed";

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("answering");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setQuizState("submitted");
    setShowResult(true);

    setTimeout(() => {
      const passed = selectedAnswer === quiz.correctAnswerIndex;
      onComplete(passed);
      setQuizState("completed");
    }, 2000);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setQuizState("answering");
    setShowResult(false);
  };

  const isCorrectAnswer = selectedAnswer === quiz.correctAnswerIndex;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          Quiz Time!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">{quiz.question}</h3>

          <div className="space-y-3">
            {quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() =>
                  quizState === "answering" && setSelectedAnswer(index)
                }
                disabled={quizState !== "answering"}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  "hover:bg-white hover:shadow-sm",
                  selectedAnswer === index
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white",
                  quizState !== "answering" && "cursor-not-allowed",
                  showResult &&
                    index === quiz.correctAnswerIndex &&
                    "border-green-500 bg-green-50",
                  showResult &&
                    selectedAnswer === index &&
                    index !== quiz.correctAnswerIndex &&
                    "border-red-500 bg-red-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      selectedAnswer === index
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300"
                    )}
                  >
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>

                  {showResult && index === quiz.correctAnswerIndex && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                  )}
                  {showResult &&
                    selectedAnswer === index &&
                    index !== quiz.correctAnswerIndex && (
                      <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div
            className={cn(
              "p-4 rounded-lg flex items-center gap-3",
              isCorrectAnswer
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            )}
          >
            {isCorrectAnswer ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {isCorrectAnswer
                ? "Correct! Well done!"
                : "Incorrect. The correct answer is highlighted above."}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          {quizState === "answering" && (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Submit Answer
            </Button>
          )}

          {quizState === "submitted" && (
            <Button disabled className="flex-1">
              Checking Answer...
            </Button>
          )}

          {quizState === "completed" && !isCorrectAnswer && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
