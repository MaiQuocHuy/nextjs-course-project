'use client';

import { useEffect, useState } from 'react';
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
} from '@/components/instructor/commom/Collapsible';
import { Trash2, Plus, Edit3, ChevronRight } from 'lucide-react';
import { DragDropReorder } from '@/components/instructor/course/create-course/create-lessons/DragDropReorder';
import type { QuizQuestionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import WarningAlert from '@/components/instructor/commom/WarningAlert';

interface QuizEditorProps {
  canEdit: boolean;
  questions: QuizQuestionType[];
  onQuestionsChange: (questions: QuizQuestionType[]) => void;
}

export function QuizEditor({
  canEdit,
  questions,
  onQuestionsChange,
}: QuizEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuizQuestionType | null>(null);
  const [isDeleteQuizDialogOpen, setDeleteQuizDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setDeleteQuizDialogOpen(true);
    }
  }, [selectedQuestion]);

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
      q.orderIndex = index;
    });
    onQuestionsChange(updatedQuestions);
  };

  const addNewQuestion = () => {
    const newQuestion: QuizQuestionType = {
      id: `new-question-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      questionText: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      }, // Start with two empty options
      correctAnswer: 'A',
      explanation: '',
      orderIndex: questions.length,
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingId(newQuestion.id);
  };

  const updateOption = (questionId: string, option: string, answer: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      const newOptions = { ...question.options, [option]: answer };
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const renderQuestion = (question: QuizQuestionType, index: number) => (
    <Collapsible key={question.id} defaultOpen={index === 0}>
      <Card className="gap-3">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 ">
            <CardTitle className="text-base flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90 shrink-0" />
                <span className="whitespace-nowrap">
                  Question {question.orderIndex + 1}
                </span>
                {question.questionText && (
                  <span className="line-clamp-1 text-sm font-normal text-muted-foreground ">
                    - {question.questionText}
                  </span>
                )}
              </div>
              {canEdit && (
                <div className="flex" onClick={(e) => e.stopPropagation()}>
                  {/* Edit button */}
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

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!question.id.includes('new-question')) {
                        setSelectedQuestion(question);
                      } else {
                        deleteQuestion(question.id);
                      }
                    }}
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
                {/* Questions */}
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    value={question.questionText}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        questionText: e.target.value,
                      })
                    }
                    placeholder="Enter question..."
                  />
                </div>

                {/* List of options */}
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {Object.entries(question.options).map(
                      ([option, optionText], optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 text-center">
                              {String.fromCharCode(65 + optionIndex)}:
                            </div>
                            <Input
                              value={optionText}
                              onChange={(e) =>
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

                {/* List of correct answers */}
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={question.correctAnswer}
                    onValueChange={(value) =>
                      updateQuestion(question.id, {
                        correctAnswer: value as 'A' | 'B' | 'C' | 'D',
                      })
                    }
                  >
                    {Object.entries(question.options).map(
                      ([option, optionText], optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${optionIndex}`}
                          />
                          <Label htmlFor={`${question.id}-${optionIndex}`}>
                            {`Option ${String.fromCharCode(65 + optionIndex)}`}
                          </Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
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
                <p className="font-medium">{question.questionText}</p>
                <div className="space-y-1">
                  {Object.values(question.options).map(
                    (optionText: string, optionIndex: number) => {
                      const optionLetter = String.fromCharCode(
                        65 + optionIndex
                      );
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
        <h3 className="font-semibold">Quiz Questions ({questions.length})</h3>
        {canEdit && (
          <Button type="button" onClick={addNewQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
      </div>

      {questions.length > 0 ? (
        <DragDropReorder
          items={questions}
          onReorder={
            canEdit
              ? (reorderedQuestions) => {
                  // Update the order property and reorder
                  const updatedQuestions = reorderedQuestions.map(
                    (question, index) => ({
                      ...question,
                      orderIndex: index,
                    })
                  );
                  onQuestionsChange(updatedQuestions);
                }
              : null
          }
          renderItem={renderQuestion}
          className="space-y-8"
        />
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No questions yet. Click "Add Question" to get started.</p>
        </Card>
      )}

      {selectedQuestion && (
        <WarningAlert
          open={isDeleteQuizDialogOpen}
          onOpenChange={(open) => {
            setDeleteQuizDialogOpen(open);
            if (!open) {
              setSelectedQuestion(null);
            }
          }}
          title="Are you sure you want to delete this question?"
          onClick={() => {
            deleteQuestion(selectedQuestion.id);
            setSelectedQuestion(null);
          }}
          actionTitle="Delete Question"
        />
      )}
    </div>
  );
}
