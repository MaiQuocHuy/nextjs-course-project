'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { QuizQuestionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';

interface QuestionContentProps {
  question: QuizQuestionType;
  isEditing: boolean;
  updateQuestion: (id: string, updates: Partial<QuizQuestionType>) => void;
  updateOption: (questionId: string, option: string, answer: string) => void;
}

export function QuestionContent({
  question,
  isEditing,
  updateQuestion,
  updateOption,
}: QuestionContentProps) {
  if (isEditing) {
    return (
      <div className="space-y-4 w-full">
        {/* Questions */}
        <div className="space-y-2 w-full">
          <Label>Question</Label>
          <Textarea
            className="w-full"
            value={question.questionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateQuestion(question.id, {
                questionText: e.target.value,
              })
            }
            placeholder="Enter question..."
          />
        </div>

        {/* Options */}
        <div className="w-full">
          <Label>Options</Label>
          <div className="space-y-2">
            {Object.entries(question.options).map(
              ([option, optionText], optionIndex) => (
                <div key={optionIndex} className="flex gap-2 w-full">
                  <div className="flex gap-2 items-center w-full">
                    <div className="w-8 text-center flex-shrink-0">
                      {String.fromCharCode(65 + optionIndex)}:
                    </div>
                    <Input
                      className="w-full"
                      value={optionText}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateOption(
                          question.id,
                          String.fromCharCode(65 + optionIndex),
                          e.target.value
                        )
                      }
                      placeholder={`Option ${String.fromCharCode(
                        65 + optionIndex
                      )}`}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Correct answers */}
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          <RadioGroup
            value={question.correctAnswer}
            onValueChange={(value: string) =>
              updateQuestion(question.id, {
                correctAnswer: value as 'A' | 'B' | 'C' | 'D',
              })
            }
          >
            {Object.keys(question.options).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-${optionIndex}`}
                  />
                  <Label htmlFor={`${question.id}-${optionIndex}`}>
                    {`Option ${option}`}
                  </Label>
                </div>
              )
            )}
          </RadioGroup>
        </div>

        {/* Explanation */}
        <div className="space-y-2 w-full">
          <Label>Explanation (optional)</Label>
          <Textarea
            className="w-full"
            value={question.explanation || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateQuestion(question.id, {
                explanation: e.target.value,
              })
            }
            placeholder="Explain the answer..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <p className="font-medium">{question.questionText}</p>

      {/* Options */}
      <div className="space-y-1">
        {Object.values(question.options).map(
          (optionText: string, optionIndex: number) => {
            const optionLetter = String.fromCharCode(65 + optionIndex);
            return (
              <div
                key={optionIndex}
                className={`p-2 rounded text-sm ${
                  question.correctAnswer === optionLetter
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-muted'
                }`}
              >
                {question.correctAnswer === optionLetter && '✓ '}
                {optionLetter}: {optionText}
              </div>
            );
          }
        )}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <p className="text-sm text-muted-foreground">
          <strong>Explanation:</strong> {question.explanation}
        </p>
      )}
    </div>
  );
}
