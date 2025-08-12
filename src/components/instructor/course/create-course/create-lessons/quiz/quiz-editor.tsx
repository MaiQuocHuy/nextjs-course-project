'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit3 } from 'lucide-react';
import type { QuizQuestionType } from '@/lib/instructor/create-course-validations/lessons-validations';

interface QuizEditorProps {
  questions: QuizQuestionType[];
  onQuestionsChange: (questions: QuizQuestionType[]) => void;
}

export function QuizEditor({ questions, onQuestionsChange }: QuizEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateQuestion = (id: string, updates: Partial<QuizQuestionType>) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    onQuestionsChange(updatedQuestions);
  };

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options.length < 6) {
      updateQuestion(questionId, {
        options: [...question.options, ''],
      });
    }
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options.length > 2) {
      const newOptions = question.options.filter(
        (_, index) => index !== optionIndex
      );
      const correctAnswer =
        question.correctAnswer === optionIndex
          ? 0
          : question.correctAnswer > optionIndex
          ? question.correctAnswer - 1
          : question.correctAnswer;

      updateQuestion(questionId, {
        options: newOptions,
        correctAnswer,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Edit Questions ({questions.length})
        </h3>
      </div>

      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Question {index + 1}</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingId(editingId === question.id ? null : question.id)
                  }
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingId === question.id ? (
              <>
                <div>
                  <Label>Question</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, { question: e.target.value })
                    }
                    placeholder="Enter question..."
                  />
                </div>

                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              question.id,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeOption(question.id, optionIndex)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(question.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={question.correctAnswer.toString()}
                    onValueChange={(value) =>
                      updateQuestion(question.id, {
                        correctAnswer: Number.parseInt(value),
                      })
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`${question.id}-${optionIndex}`}
                        />
                        <Label htmlFor={`${question.id}-${optionIndex}`}>
                          {option || `Option ${optionIndex + 1}`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Explanation (optional)</Label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Explain the answer..."
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">{question.question}</p>
                <div className="space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-muted'
                      }`}
                    >
                      {optionIndex === question.correctAnswer && '✓ '}
                      {option}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
