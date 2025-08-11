'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Trash2, Plus, Edit3, ChevronRight } from 'lucide-react';
import { DragDropReorder } from '@/components/instructor/course/create-course/create-lessons/drag-drop-reorder';
import type { QuizQuestionType } from '@/utils/instructor/create-course-validations/lessons-validations';

interface EnhancedQuizEditorProps {
  canEdit: boolean;
  questions: QuizQuestionType[];
  onQuestionsChange: (questions: QuizQuestionType[]) => void;
}

export function EnhancedQuizEditor({
  canEdit,
  questions,
  onQuestionsChange,
}: EnhancedQuizEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateQuestion = (id: string, updates: Partial<QuizQuestionType>) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    // Reorder remaining questions
    updatedQuestions.forEach((q, index) => {
      q.order = index + 1;
    });
    onQuestionsChange(updatedQuestions);
  };

  const addNewQuestion = () => {
    const newQuestion: QuizQuestionType = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: '',
      options: ['', ''],
      correctAnswer: 0,
      explanation: '',
      order: questions.length + 1,
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingId(newQuestion.id);
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

  const renderQuestion = (question: QuizQuestionType, index: number) => (
    <Collapsible key={question.id} defaultOpen={editingId === question.id}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                <span>Question {question.order + 1}</span>
                {question.question && (
                  <span className="text-sm font-normal text-muted-foreground truncate max-w-md">
                    - {question.question}
                  </span>
                )}
              </div>
              {canEdit && (
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditingId(
                        editingId === question.id ? null : question.id
                      )
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
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Quiz Questions ({questions.length})
        </h3>
        {canEdit && (
          <Button type="button" onClick={addNewQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
      </div>

      {questions.length > 0 ? (
        <DragDropReorder
          items={questions} // Pass full question objects
          onReorder={
            canEdit
              ? (reorderedQuestions) => {
                  // Update the order property and reorder
                  const updatedQuestions = reorderedQuestions.map(
                    (question, index) => ({
                      ...question,
                      order: index + 1,
                    })
                  );
                  onQuestionsChange(updatedQuestions);
                }
              : null
          }
          renderItem={renderQuestion}
          className="space-y-4"
        />
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No questions yet. Click "Add Question" to get started.</p>
        </Card>
      )}
    </div>
  );
}
